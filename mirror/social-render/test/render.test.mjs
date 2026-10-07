// node --test test/
// Unit tests need nothing. The integration tests start headless Chrome and are
// skipped when no Chrome or Edge is installed.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { esc, rich, plain, countOf } from '../lib/text.mjs';
import { validateSpec, SpecError, slideTexts } from '../lib/spec.mjs';
import { pngInfo } from '../lib/png.mjs';
import { fixPageBoxes, pdfInfo } from '../lib/pdf.mjs';
import { coveredCodepoints } from '../lib/glyphs.mjs';
import { FONT_FILES } from '../lib/document.mjs';
import { findChrome } from '../lib/chrome.mjs';
import { render } from '../lib/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const single = (slide, extra = {}) => ({ id: 't', format: 'portrait', kind: 'single', slides: [slide], ...extra });
const carousel = (slides, extra = {}) => ({ id: 't', format: 'portrait', kind: 'carousel', slides, ...extra });
const point = (extra = {}) => ({ type: 'point', headline: 'A headline', body: 'Some body text.', gradient: 'headline', ...extra });
const problemsOf = (raw, options) => {
  try {
    validateSpec(raw, options);
    return [];
  } catch (error) {
    assert.ok(error instanceof SpecError, `expected SpecError, got ${error}`);
    return error.problems;
  }
};

describe('text', () => {
  test('escapes HTML', () => {
    assert.equal(esc('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
  });
  test('wraps the gradient phrase once and escapes around it', () => {
    const html = rich('Tom & "Jerry" can\'t stop', [{ phrase: 'can\'t stop', cls: 'g' }]);
    assert.equal(html, 'Tom &amp; &quot;Jerry&quot; <span class="g">can&#39;t stop</span>');
  });
  test('draws arrows as SVG and turns \\n into a break', () => {
    const html = plain('a → b\nc');
    assert.match(html, /<svg class="arrow"/);
    assert.ok(!html.includes('→'));
    assert.match(html, /<br>c$/);
  });
  test('ties one-letter words to the next word', () => {
    assert.equal(plain('call a campaign'), 'call a campaign');
    assert.equal(plain('I said A thing'), 'I said A thing');
    assert.equal(plain('an AI'), 'an AI');
  });
  test('counts phrases', () => {
    assert.equal(countOf('a b a b a', 'a b'), 2);
    assert.equal(countOf('abc', ''), 0);
  });
});

describe('spec validation', () => {
  test('fills defaults for a single image', () => {
    const s = validateSpec(single(point()));
    assert.equal(s.byline, 'Zain Usman');
    assert.equal(s.counter, false);
    assert.deepEqual(s.output, { png: 'image.png', pdf: null });
    assert.deepEqual(s.size, { width: 1080, height: 1350 });
  });
  test('fills defaults for a carousel', () => {
    const s = validateSpec(carousel([point(), point()]));
    assert.equal(s.counter, true);
    assert.deepEqual(s.output, { png: 'slide-{nn}.png', pdf: 'carousel.pdf' });
  });
  test('knows the three sizes', () => {
    assert.deepEqual(validateSpec(single(point(), { format: 'square' })).size, { width: 1080, height: 1080 });
    assert.deepEqual(validateSpec(single(point(), { format: 'story' })).size, { width: 1080, height: 1920 });
    assert.match(problemsOf(single(point(), { format: 'banner' })).join(), /format must be one of/);
  });
  test('the gradient phrase must be in the text exactly once', () => {
    assert.match(problemsOf(single(point({ gradient: 'missing words' }))).join(), /found 0/);
    assert.match(problemsOf(single(point({ headline: 'one one', gradient: 'one' }))).join(), /found 2/);
    assert.match(problemsOf(single(point({ gradient: undefined }))).join(), /"gradient" is required/);
    assert.deepEqual(problemsOf(single(point({ gradient: false }))), []);
  });
  test('gradient tiles only on data slides, never with a phrase', () => {
    const data = { type: 'data', headline: 'Tiles', tiles: [{ value: '5', label: 'things' }], gradientTiles: true };
    assert.deepEqual(problemsOf(single(data)), []);
    assert.match(problemsOf(single({ ...data, gradient: 'Tiles' })).join(), /not both/);
    assert.match(problemsOf(single(point({ gradientTiles: true, gradient: undefined }))).join(), /only for data slides/);
  });
  test('marks may not overlap', () => {
    assert.match(problemsOf(single(point({ body: 'say confirm: true now', mono: ['confirm: true'], gradient: 'true now' }))).join(), /overlap/);
  });
  test('refuses unknown fields and types', () => {
    assert.match(problemsOf(single(point({ hedline: 'typo' }))).join(), /unknown field "hedline"/);
    assert.match(problemsOf(single({ type: 'banner', headline: 'x' })).join(), /type must be one of/);
    assert.match(problemsOf({ ...single(point()), colour: 'red' }).join(), /unknown field "colour"/);
  });
  test('a counter is for carousels only, and slide counts are checked', () => {
    assert.match(problemsOf(single(point(), { counter: true })).join(), /carousels only/);
    assert.match(problemsOf(carousel([point()])).join(), /2 to 20 slides/);
    assert.match(problemsOf({ ...single(point()), slides: [point(), point()] }).join(), /exactly one slide/);
  });
  test('never on an image: links, IDs, tokens, swipe, blocked terms', () => {
    assert.match(problemsOf(single(point({ body: 'see www.example.com' }))).join(), /link/);
    assert.match(problemsOf(single(point({ body: 'account 123456789012345' }))).join(), /digit run/);
    assert.match(problemsOf(single(point({ body: 'act_1234 here' }))).join(), /ad account ID/);
    assert.match(problemsOf(single(point({ body: 'token EAABsbCS1iHgBAKZ' }))).join(), /token/);
    assert.match(problemsOf(single(point({ body: 'Swipe for more' }))).join(), /swipe/);
    assert.match(problemsOf(single(point({ body: 'Built with ProductX.' })), { blocklist: ['productx'] }).join(), /never-on-image/);
  });
  test('refuses characters the fonts cannot draw, except SVG arrows', () => {
    const covered = coveredCodepoints([FONT_FILES.sans, FONT_FILES.mono]);
    assert.deepEqual(problemsOf(single(point({ body: 'paused → approved · done' })), { covered }), []);
    assert.match(problemsOf(single(point({ body: 'done ✓' })), { covered }).join(), /no glyph for "✓"/);
  });
  test('lists every text string of a slide', () => {
    const texts = slideTexts({ type: 'data', headline: 'H', lead: 'L', tiles: [{ value: '5', label: 'x' }], footer: 'F' });
    assert.deepEqual(texts.map((t) => t.text), ['H', 'L', '5', 'x', 'F']);
  });
});

describe('png', () => {
  test('reads the size from IHDR', () => {
    const buf = Buffer.alloc(33);
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
    buf.writeUInt32BE(13, 8);
    buf.write('IHDR', 12, 'latin1');
    buf.writeUInt32BE(1080, 16);
    buf.writeUInt32BE(1350, 20);
    buf[24] = 8;
    buf[25] = 6;
    assert.deepEqual(pngInfo(buf), { width: 1080, height: 1350, bitDepth: 8, colorType: 6 });
    assert.throws(() => pngInfo(Buffer.from('not a png at all, no signature here')), /not a PNG/);
  });
});

describe('pdf page boxes', () => {
  const pdf = (box) => Buffer.from(`%PDF-1.4\n1 0 obj << /Type /Pages /Kids [2 0 R 3 0 R] /Count 2 >> endobj\n2 0 obj << /Type /Page /MediaBox ${box} >> endobj\n3 0 obj << /Type /Page /MediaBox ${box} >> endobj\nxref\n`, 'latin1');
  test('crops Chrome\'s rounded page height in place, keeping the byte length', () => {
    const raw = pdf('[0 0 810 1013.03998]');
    const { buffer, patched } = fixPageBoxes(raw, 810, 1012.5);
    assert.equal(patched, 2);
    assert.equal(buffer.length, raw.length);
    const info = pdfInfo(buffer);
    assert.equal(info.pages, 2);
    assert.equal(info.count, 2);
    for (const [x0, y0, x1, y1] of info.mediaBoxes) {
      assert.equal(x1 - x0, 810);
      assert.ok(Math.abs(y1 - y0 - 1012.5) < 1e-9, `height ${y1 - y0}`);
    }
    assert.match(buffer.toString('latin1'), /\/MediaBox \[0 \.54 810 1013\.04 \]/);
  });
  test('leaves exact boxes alone and refuses unexpected ones', () => {
    assert.equal(fixPageBoxes(pdf('[0 0 810 810]'), 810, 810).patched, 0);
    assert.throws(() => fixPageBoxes(pdf('[0 0 612 792]'), 810, 1012.5), /width/);
    assert.throws(() => fixPageBoxes(pdf('[0 0 810 1020]'), 810, 1012.5), /height/);
  });
});

describe('fonts', () => {
  test('cover Latin, the middle dot and no-break space, but not arrows', () => {
    const covered = coveredCodepoints([FONT_FILES.sans, FONT_FILES.mono]);
    for (const ch of 'Aa09"\'?:()· é') assert.ok(covered.has(ch.codePointAt(0)), `missing ${ch}`);
    assert.ok(!covered.has(0x2192));
  });
});

const chrome = findChrome();

describe('render (headless Chrome)', { skip: chrome ? false : 'no Chrome or Edge installed' }, () => {
  test('renders every slide type at the three exact sizes, and a patched PDF', async () => {
    const out = await fs.mkdtemp(path.join(os.tmpdir(), 'social-render-test-'));
    try {
      const specs = ['all-types-portrait.json', 'square-quote.json', 'story-cover.json'].map((f) => path.join(ROOT, 'examples', f));
      const result = await render(specs, { out });
      const byId = Object.fromEntries(result.reports.map((r) => [r.id, r]));
      for (const r of result.reports) assert.deepEqual(r.problems, [], `${r.id}: ${r.problems.join('; ')}`);

      const deck = byId['example-all-types'];
      assert.equal(deck.slides.length, 8);
      for (const s of deck.slides) {
        const info = pngInfo(await fs.readFile(s.file));
        assert.deepEqual([info.width, info.height], [1080, 1350]);
        assert.equal(s.gradients.length >= 1, true, `slide ${s.n} has no gradient`);
        assert.ok(s.minBodyPx === null || s.minBodyPx >= 34, `slide ${s.n} body ${s.minBodyPx}px`);
      }
      assert.equal(deck.pdf.pages, 8);
      const pdf = pdfInfo(await fs.readFile(deck.pdf.file));
      assert.equal(pdf.pages, 8);
      for (const [x0, y0, x1, y1] of pdf.mediaBoxes) assert.ok(Math.abs(x1 - x0 - 810) < 1e-9 && Math.abs(y1 - y0 - 1012.5) < 1e-9);

      const sq = pngInfo(await fs.readFile(byId['example-square'].slides[0].file));
      assert.deepEqual([sq.width, sq.height], [1080, 1080]);
      const st = pngInfo(await fs.readFile(byId['example-story'].slides[0].file));
      assert.deepEqual([st.width, st.height], [1080, 1920]);
      assert.equal(byId['example-square'].pdf, null);
    } finally {
      await fs.rm(out, { recursive: true, force: true });
    }
  });

  test('fails closed: text that cannot fit is reported and nothing is written', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'social-render-test-'));
    try {
      const long = Array.from({ length: 40 }, (_, i) => `Sentence number ${i + 1} keeps going for a while.`).join(' ');
      const spec = path.join(dir, 'spec.json');
      await fs.writeFile(spec, JSON.stringify(single(point({ body: long }), { id: 'overflow-test' })));
      const result = await render([spec], {});
      const r = result.reports[0];
      assert.ok(r.problems.length > 0, 'expected an overflow problem');
      assert.equal(r.written, false);
      assert.deepEqual((await fs.readdir(dir)).sort(), ['spec.json']);
      await fs.rm(r.rejectedDir, { recursive: true, force: true });
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
