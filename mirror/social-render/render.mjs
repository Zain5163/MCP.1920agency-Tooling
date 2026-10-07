#!/usr/bin/env node
// Social-Render: turns a JSON spec into brand PNGs (and a PDF for carousels).
//
//   node render.mjs <spec.json> [more specs...] [options]
//
//   --out <dir>       write here instead of next to the spec (one spec), or into
//                     <dir>\<spec id> (several specs)
//   --chrome <path>   Chrome or Edge to use (default: auto-detect, or SOCIAL_RENDER_CHROME)
//   --check           validate the specs only; no browser is started
//   --force           write the files even if the QA checks found problems
//   --keep-temp       keep the built HTML and browser profile for debugging
//   --json            print the full report as JSON
//
// Exit codes: 0 all clean, 1 QA problems or bad spec, 2 usage or setup error.
// Node built-ins only. One Chrome launch per run.

import { parseArgs } from 'node:util';
import path from 'node:path';
import { prepare, render } from './lib/render.mjs';
import { SpecError } from './lib/spec.mjs';

const usage = 'Usage: node render.mjs <spec.json> [more specs...] [--out <dir>] [--chrome <path>] [--check] [--force] [--keep-temp] [--json]';

let args;
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      out: { type: 'string' },
      chrome: { type: 'string' },
      check: { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
      'keep-temp': { type: 'boolean', default: false },
      json: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
} catch (error) {
  console.error(`${error.message}\n${usage}`);
  process.exit(2);
}
if (args.values.help || args.positionals.length === 0) {
  console.log(usage);
  process.exit(args.values.help ? 0 : 2);
}

const kb = (n) => `${Math.round(n / 1024).toLocaleString('en-US')} KB`;

async function main() {
  const files = args.positionals;
  if (args.values.check) {
    const { jobs } = await prepare(files, { out: args.values.out });
    for (const j of jobs) console.log(`ok  ${j.spec.id}: ${j.spec.kind}, ${j.spec.format} ${j.spec.size.width}x${j.spec.size.height}, ${j.spec.slides.length} slide(s)`);
    return 0;
  }

  const result = await render(files, {
    out: args.values.out,
    chrome: args.values.chrome,
    force: args.values.force,
    keepTemp: args.values['keep-temp'],
    log: args.values.json ? () => {} : (line) => console.log(line),
  });

  if (args.values.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    for (const r of result.reports) {
      for (const s of r.slides) {
        const fit = s.kh < 1 || s.kb < 1 ? `  scaled h=${s.kh.toFixed(2)} b=${s.kb.toFixed(2)}` : '';
        console.log(`  ${path.basename(s.file).padEnd(16)} ${s.width}x${s.height}  ${kb(s.bytes).padStart(8)}  body>=${s.minBodyPx ?? '-'}px  gradient: ${s.gradients.map((g) => JSON.stringify(g)).join(' + ') || 'none'}${fit}`);
      }
      if (r.pdf) {
        const [x0, y0, x1, y1] = r.pdf.mediaBox ?? [0, 0, 0, 0];
        console.log(`  ${path.basename(r.pdf.file).padEnd(16)} ${r.pdf.pages} pages, ${+(x1 - x0).toFixed(2)}x${+(y1 - y0).toFixed(2)} pt  ${kb(r.pdf.bytes).padStart(8)}  (page boxes patched: ${r.pdf.boxesPatched})`);
      }
      for (const w of r.warnings) console.log(`  warning: ${w}`);
      for (const p of r.problems) console.log(`  PROBLEM: ${p}`);
      if (!r.written) console.log(`  Not written to ${r.outDir}. The rejected render is in ${r.rejectedDir}`);
      else console.log(`  -> ${r.outDir}`);
    }
    console.log(`done in ${result.seconds.toFixed(1)} s (${result.chromePath})${result.tmp ? `, temp kept at ${result.tmp}` : ''}`);
  }
  return result.reports.some((r) => r.problems.length) ? 1 : 0;
}

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(error instanceof SpecError ? error.message : `Failed: ${error.stack ?? error.message}`);
    process.exit(error instanceof SpecError ? 1 : 2);
  },
);
