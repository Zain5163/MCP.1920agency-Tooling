// The render job: validate specs, launch Chrome once, render every slide to
// an exact-size PNG, check it, and assemble a carousel PDF from the PNGs.

import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { findChrome, launchChrome } from './chrome.mjs';
import { buildDocument, loadTemplates, FONT_FILES, PATHS } from './document.mjs';
import { coveredCodepoints } from './glyphs.mjs';
import { pdfPageHtml, fixPageBoxes, pdfInfo } from './pdf.mjs';
import { pngInfo } from './png.mjs';
import { loadSpec } from './spec.mjs';
import { pad2 } from './text.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function loadConfig() {
  const defaults = { neverOnImage: [], minAnyPx: 24, khMin: 0.62 };
  if (!existsSync(PATHS.config)) return defaults;
  return { ...defaults, ...JSON.parse(readFileSync(PATHS.config, 'utf8')) };
}

async function writeAtomic(target, data) {
  const tmp = `${target}.tmp-${process.pid}`;
  await fs.writeFile(tmp, data);
  for (let attempt = 0; ; attempt++) {
    try {
      await fs.rename(tmp, target);
      return;
    } catch (error) {
      // An image viewer can hold the old file open for a moment on Windows.
      if (attempt >= 8 || !['EPERM', 'EBUSY', 'EACCES'].includes(error.code)) {
        await fs.rm(tmp, { force: true });
        throw new Error(`Could not replace ${target}: ${error.message}`);
      }
      await sleep(250);
    }
  }
}

/** Loads and validates every spec before anything is launched. */
export async function prepare(specFiles, { out } = {}) {
  const config = loadConfig();
  const covered = coveredCodepoints([FONT_FILES.sans, FONT_FILES.mono]);
  const jobs = [];
  for (const file of specFiles) {
    const spec = await loadSpec(path.resolve(file), { covered, blocklist: config.neverOnImage });
    let outDir = path.dirname(path.resolve(file));
    if (out) outDir = specFiles.length > 1 ? path.join(path.resolve(out), spec.id) : path.resolve(out);
    jobs.push({ file: path.resolve(file), spec, outDir });
  }
  return { jobs, config };
}

export async function render(specFiles, opts = {}) {
  const t0 = Date.now();
  const { jobs, config } = await prepare(specFiles, opts);
  const chromePath = findChrome(opts.chrome);
  if (!chromePath) throw new Error('No Chrome or Edge found. Pass --chrome <path> or set SOCIAL_RENDER_CHROME.');
  const templates = loadTemplates();
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'social-render-'));
  const log = opts.log ?? (() => {});
  const browser = await launchChrome({ chromePath, profileDir: path.join(tmp, 'profile') });
  const reports = [];
  try {
    for (const job of jobs) reports.push(await renderJob(browser, job, { tmp, templates, config, log, force: opts.force === true }));
  } finally {
    await browser.close();
    if (!opts.keepTemp) await fs.rm(tmp, { recursive: true, force: true, maxRetries: 10, retryDelay: 250 }).catch(() => {});
  }
  return { chromePath, reports, seconds: (Date.now() - t0) / 1000, tmp: opts.keepTemp ? tmp : null };
}

async function renderJob(browser, job, { tmp, templates, config, log, force }) {
  const { spec } = job;
  const { width, height } = spec.size;
  const stem = spec.id.replace(/[^\w.-]+/g, '_');
  const report = { id: spec.id, spec: job.file, outDir: job.outDir, format: spec.format, width, height, kind: spec.kind, slides: [], pdf: null, problems: [], warnings: [], written: false };
  log(`[${spec.id}] ${spec.format} ${width}x${height}, ${spec.slides.length} slide(s)`);

  const htmlPath = path.join(tmp, `${stem}.html`);
  await fs.writeFile(htmlPath, buildDocument(spec, templates), 'utf8');
  const page = await browser.newPage({ width, height });
  try {
    await page.navigate(pathToFileURL(htmlPath).href);

    const faces = await page.evaluate('window.__sr.ready()');
    const failed = faces.filter((f) => f.status !== 'loaded');
    const loaded = new Set(faces.filter((f) => f.status === 'loaded').map((f) => f.family));
    if (failed.length || !loaded.has('Geist') || !loaded.has('Geist Mono')) {
      throw new Error(`fonts did not load: ${failed.map((f) => `${f.family} ${f.status}${f.error ? ` (${f.error})` : ''}`).join('; ') || 'Geist or Geist Mono missing'}`);
    }

    const fit = await page.evaluate(`window.__sr.fit(${JSON.stringify({ minBodyPx: spec.minBodyPx, minAnyPx: config.minAnyPx, khMin: config.khMin })})`);
    if (page.errors.length) throw new Error(`the page reported errors: ${page.errors.join(' | ')}`);
    for (const s of fit) for (const p of s.problems) report.problems.push(`slide ${s.n}: ${p}`);

    const shots = [];
    for (const s of fit) {
      await page.evaluate(`window.__sr.show(${s.n})`);
      const png = await page.screenshot({ width, height });
      const info = pngInfo(png);
      if (info.width !== width || info.height !== height) report.problems.push(`slide ${s.n}: PNG is ${info.width}x${info.height}, expected ${width}x${height}`);
      shots.push({ s, png, info });
    }

    // Fail closed: a job with problems never replaces the files in the output folder.
    const ok = report.problems.length === 0 || force;
    const dest = ok ? job.outDir : path.join(os.tmpdir(), 'social-render-rejected', stem);
    await fs.mkdir(dest, { recursive: true });
    const pngs = [];
    for (const { s, png, info } of shots) {
      const target = path.join(dest, spec.output.png.replace('{nn}', pad2(s.n)));
      await writeAtomic(target, png);
      pngs.push(target);
      report.slides.push({ ...s, file: target, bytes: png.length, width: info.width, height: info.height });
    }

    if (spec.kind === 'carousel' && spec.output.pdf) {
      const pdfHtml = path.join(tmp, `${stem}-pdf.html`);
      await fs.writeFile(pdfHtml, pdfPageHtml(pngs.map((p) => pathToFileURL(p).href), { width, height, title: spec.documentTitle ?? spec.id }), 'utf8');
      await page.navigate(pathToFileURL(pdfHtml).href);
      const images = await page.evaluate('Promise.all([...document.images].map((i) => i.decode())).then(() => [...document.images].map((i) => i.naturalWidth + "x" + i.naturalHeight))');
      if (images.length !== pngs.length || images.some((d) => d !== `${width}x${height}`)) report.problems.push(`PDF source images did not load as ${width}x${height}: ${images.join(', ')}`);
      const raw = await page.pdf();
      const fixed = fixPageBoxes(raw, (width * 3) / 4, (height * 3) / 4);
      const info = pdfInfo(fixed.buffer);
      const before = report.problems.length;
      if (info.pages !== pngs.length) report.problems.push(`PDF has ${info.pages} pages, expected ${pngs.length}`);
      if (info.mediaBoxes.length !== pngs.length) report.problems.push(`PDF has ${info.mediaBoxes.length} page boxes, expected ${pngs.length}`);
      const wrongBox = info.mediaBoxes.filter((b) => Math.abs(b[2] - b[0] - (width * 3) / 4) > 0.01 || Math.abs(b[3] - b[1] - (height * 3) / 4) > 0.01);
      if (wrongBox.length) report.problems.push(`PDF page boxes not ${(width * 3) / 4}x${(height * 3) / 4} pt: ${JSON.stringify(wrongBox)}`);
      const pdfOk = ok && (report.problems.length === before || force);
      const target = path.join(pdfOk ? job.outDir : path.join(os.tmpdir(), 'social-render-rejected', stem), spec.output.pdf);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await writeAtomic(target, fixed.buffer);
      report.pdf = { file: target, bytes: fixed.buffer.length, pages: info.pages, boxesPatched: fixed.patched, mediaBox: info.mediaBoxes[0] ?? null };
    }

    report.written = ok;
    if (!ok) report.rejectedDir = dest;

    if (ok && spec.kind === 'carousel') {
      // Leftovers from an earlier, longer render of the same spec.
      const pattern = new RegExp(`^${spec.output.png.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\\{nn\\}', '(\\d{2})')}$`);
      for (const name of await fs.readdir(job.outDir)) {
        const m = name.match(pattern);
        if (m && Number(m[1]) > spec.slides.length) report.warnings.push(`stale file from an earlier render: ${name}`);
      }
    }
  } finally {
    await page.close();
  }
  return report;
}
