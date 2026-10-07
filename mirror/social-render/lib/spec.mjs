// Spec loading and validation. A spec is JSON; see PROJECT-CONTEXT.md for the format.
// Validation is strict on purpose: a typo in a field name or a gradient phrase
// that is not in the text should stop the job, not render a wrong image.

import fs from 'node:fs/promises';
import path from 'node:path';
import { SVG_CHARS, countOf } from './text.mjs';

export const FORMATS = {
  portrait: { width: 1080, height: 1350 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
};

// Text-bearing fields per slide type, in reading order. `tiles`, `items`,
// `steps` and an array `body` are lists.
const TYPES = {
  cover: { required: ['headline'], text: ['eyebrow', 'headline', 'sub'] },
  point: { required: ['headline', 'body'], text: ['eyebrow', 'headline', 'body'] },
  data: { required: ['headline', 'tiles'], text: ['eyebrow', 'headline', 'lead', 'tiles', 'footer'] },
  quote: { required: ['quote'], text: ['eyebrow', 'lead', 'quote'] },
  checklist: { required: ['headline', 'items'], text: ['eyebrow', 'headline', 'items', 'footer'] },
  flow: { required: ['headline', 'steps'], text: ['eyebrow', 'headline', 'steps', 'footer'] },
  closing: { required: ['headline'], text: ['eyebrow', 'headline', 'body', 'takeaway'] },
};
export const SLIDE_TYPES = Object.keys(TYPES);

const COMMON_SLIDE_KEYS = ['type', 'gradient', 'gradientTiles', 'mono', 'chips', 'series', 'atmosphere', 'notes'];
const SPEC_KEYS = ['id', 'source', 'notes', 'format', 'kind', 'byline', 'counter', 'documentTitle', 'output', 'slides', 'minBodyPx'];
const ATMOSPHERES = ['cover', 'point', 'data', 'quote', 'checklist', 'flow', 'closing', 'none'];

// Never on an image (LinkedIn STRATEGY.md section 9 and the brand rules).
const LINT = [
  { re: /https?:\/\/|www\.|\.(com|io|ai|net|org|pk)\b/i, why: 'looks like a link' },
  { re: /\d{8,}/, why: 'has a long digit run (possible account, campaign or pixel ID)' },
  { re: /\bact_\d+/i, why: 'looks like an ad account ID' },
  { re: /\bEAA[A-Za-z0-9]{8,}/, why: 'looks like a Meta token fragment' },
  { re: /\bswipe\b/i, why: 'has "swipe" text' },
];

export class SpecError extends Error {
  constructor(problems, file) {
    super(`${file ? path.basename(path.dirname(file)) + '/' + path.basename(file) + ': ' : ''}invalid spec\n  - ${problems.join('\n  - ')}`);
    this.problems = problems;
  }
}

const isText = (v) => typeof v === 'string' && v.trim() !== '';

/** Every text string on a slide, with where it came from. */
export function slideTexts(slide) {
  const out = [];
  for (const field of TYPES[slide.type]?.text ?? []) {
    const v = slide[field];
    if (v === undefined) continue;
    if (field === 'tiles') {
      (Array.isArray(v) ? v : []).forEach((t, i) => {
        if (t && typeof t === 'object') {
          if (typeof t.value === 'string') out.push({ field: `tiles[${i}].value`, text: t.value });
          if (typeof t.label === 'string') out.push({ field: `tiles[${i}].label`, text: t.label });
        }
      });
    } else if (Array.isArray(v)) {
      v.forEach((t, i) => typeof t === 'string' && out.push({ field: `${field}[${i}]`, text: t }));
    } else if (typeof v === 'string') {
      out.push({ field, text: v });
    }
  }
  return out;
}

function locate(texts, phrase) {
  const found = [];
  for (const t of texts) {
    let at = t.text.indexOf(phrase);
    while (at >= 0) {
      found.push({ field: t.field, start: at, end: at + phrase.length });
      at = t.text.indexOf(phrase, at + phrase.length);
    }
  }
  return found;
}

const RATIO = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/;

/**
 * Validates a parsed spec and returns a normalised copy with defaults filled in.
 * options.blocklist: extra terms that must never appear (e.g. the product's working name).
 * options.covered: Set of code points the fonts can draw; others are refused.
 */
export function validateSpec(raw, options = {}) {
  const p = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new SpecError(['spec must be a JSON object']);
  for (const k of Object.keys(raw)) if (!SPEC_KEYS.includes(k) && !k.startsWith('$')) p.push(`unknown field "${k}"`);

  const format = raw.format ?? 'portrait';
  if (!FORMATS[format]) p.push(`format must be one of ${Object.keys(FORMATS).join(', ')} (got "${format}")`);
  const kind = raw.kind ?? (Array.isArray(raw.slides) && raw.slides.length > 1 ? 'carousel' : 'single');
  if (!['single', 'carousel'].includes(kind)) p.push(`kind must be "single" or "carousel" (got "${kind}")`);
  if (!isText(raw.id ?? 'x')) p.push('id must be a non-empty string');
  const byline = raw.byline ?? 'Zain Usman';
  if (!isText(byline)) p.push('byline must be a non-empty string');
  const counter = raw.counter ?? kind === 'carousel';
  if (typeof counter !== 'boolean') p.push('counter must be true or false');
  if (kind === 'single' && counter) p.push('a slide counter is for carousels only');
  if (raw.documentTitle !== undefined && !isText(raw.documentTitle)) p.push('documentTitle must be a non-empty string');
  const minBodyPx = raw.minBodyPx ?? 34;
  if (typeof minBodyPx !== 'number' || minBodyPx < 24 || minBodyPx > 80) p.push('minBodyPx must be a number between 24 and 80');

  const output = { png: kind === 'carousel' ? 'slide-{nn}.png' : 'image.png', pdf: kind === 'carousel' ? 'carousel.pdf' : null, ...(raw.output ?? {}) };
  if (typeof output.png !== 'string' || !output.png.toLowerCase().endsWith('.png')) p.push('output.png must be a file name ending in .png');
  if (kind === 'carousel' && !String(output.png).includes('{nn}')) p.push('output.png must contain {nn} for a carousel');
  if (output.pdf !== null && (typeof output.pdf !== 'string' || !output.pdf.toLowerCase().endsWith('.pdf'))) p.push('output.pdf must be a file name ending in .pdf, or null');
  for (const name of [output.png, output.pdf]) if (typeof name === 'string' && /[\\/]/.test(name)) p.push(`output names are plain file names, not paths ("${name}")`);

  const slides = Array.isArray(raw.slides) ? raw.slides : [];
  if (slides.length === 0) p.push('slides must be a non-empty array');
  if (kind === 'single' && slides.length > 1) p.push(`a single image has exactly one slide (got ${slides.length})`);
  if (kind === 'carousel' && (slides.length < 2 || slides.length > 20)) p.push(`a carousel has 2 to 20 slides (got ${slides.length})`);

  const blocklist = (options.blocklist ?? []).filter(isText);
  const normalised = slides.map((s, i) => checkSlide(s, i + 1, p, { blocklist, covered: options.covered }));

  if (p.length) throw new SpecError(p, options.file);
  return {
    id: raw.id ?? 'render',
    source: raw.source ?? null,
    format,
    size: FORMATS[format],
    kind,
    byline,
    counter,
    documentTitle: raw.documentTitle ?? null,
    minBodyPx,
    output,
    slides: normalised,
  };
}

function checkSlide(s, n, p, { blocklist, covered }) {
  const where = `slide ${n}`;
  if (!s || typeof s !== 'object' || Array.isArray(s)) {
    p.push(`${where}: must be an object`);
    return s;
  }
  const def = TYPES[s.type];
  if (!def) {
    p.push(`${where}: type must be one of ${SLIDE_TYPES.join(', ')} (got "${s.type}")`);
    return s;
  }
  for (const k of Object.keys(s)) {
    if (!COMMON_SLIDE_KEYS.includes(k) && !def.text.includes(k) && !(s.type === 'data' && k === 'layout')) p.push(`${where}: unknown field "${k}" for a ${s.type} slide`);
  }
  for (const f of def.required) {
    const v = s[f];
    const ok = Array.isArray(v) ? v.length > 0 : isText(v);
    if (!ok) p.push(`${where}: "${f}" is required`);
  }
  for (const f of def.text) {
    const v = s[f];
    if (v === undefined || f === 'tiles') continue;
    const listField = ['items', 'steps'].includes(f) || (f === 'body' && Array.isArray(v));
    if (listField) {
      if (!Array.isArray(v) || v.length === 0 || !v.every(isText)) p.push(`${where}: "${f}" must be a list of non-empty strings`);
    } else if (!isText(v)) p.push(`${where}: "${f}" must be a non-empty string`);
  }
  if (s.type === 'data') {
    if (!Array.isArray(s.tiles) || s.tiles.length === 0 || s.tiles.length > 6) p.push(`${where}: "tiles" must list 1 to 6 tiles`);
    else s.tiles.forEach((t, i) => {
      if (!t || typeof t !== 'object') return p.push(`${where}: tile ${i + 1} must be an object`);
      for (const k of Object.keys(t)) if (!['value', 'label', 'frames'].includes(k)) p.push(`${where}: tile ${i + 1} has unknown field "${k}"`);
      if (!isText(t.value)) p.push(`${where}: tile ${i + 1} needs a "value"`);
      if (!isText(t.label)) p.push(`${where}: tile ${i + 1} needs a "label"`);
      if (t.frames !== undefined && (!Array.isArray(t.frames) || !t.frames.every((f) => RATIO.test(String(f))))) p.push(`${where}: tile ${i + 1} frames must be ratios like "4:5"`);
    });
    if (s.layout !== undefined && !['rows', 'grid'].includes(s.layout)) p.push(`${where}: layout must be "rows" or "grid"`);
  }
  if (s.type === 'checklist' && Array.isArray(s.items) && s.items.length > 6) p.push(`${where}: a checklist has at most 6 items`);
  if (s.type === 'flow' && Array.isArray(s.steps) && (s.steps.length < 2 || s.steps.length > 6)) p.push(`${where}: a flow has 2 to 6 steps`);
  if (s.series !== undefined && !isText(s.series)) p.push(`${where}: series must be a non-empty string`);
  if (s.atmosphere !== undefined && !ATMOSPHERES.includes(s.atmosphere)) p.push(`${where}: atmosphere must be one of ${ATMOSPHERES.join(', ')}`);

  const texts = slideTexts(s);

  // Gradient: one key phrase per slide, or the tile values on a data slide.
  const marks = [];
  if (s.gradientTiles !== undefined && s.gradientTiles !== true) p.push(`${where}: gradientTiles can only be true`);
  if (s.gradientTiles === true && s.type !== 'data') p.push(`${where}: gradientTiles is only for data slides`);
  if (s.gradientTiles === true && s.gradient !== undefined) p.push(`${where}: use either "gradient" or "gradientTiles", not both`);
  if (s.gradientTiles !== true) {
    if (s.gradient === undefined) p.push(`${where}: "gradient" is required (the one phrase in brand gradient), or false for none`);
    else if (s.gradient !== false) {
      if (!isText(s.gradient)) p.push(`${where}: "gradient" must be a phrase from the slide text, or false`);
      else {
        const hits = locate(texts, s.gradient);
        if (hits.length !== 1) p.push(`${where}: gradient phrase "${s.gradient}" must occur exactly once in the slide text (found ${hits.length})`);
        else marks.push({ ...hits[0], kind: 'gradient', phrase: s.gradient });
        if ([...s.gradient].some((c) => SVG_CHARS.has(c))) p.push(`${where}: the gradient phrase cannot contain an arrow`);
      }
    }
  }
  for (const kindName of ['mono', 'chips']) {
    const list = s[kindName];
    if (list === undefined) continue;
    if (!Array.isArray(list) || !list.every(isText)) {
      p.push(`${where}: "${kindName}" must be a list of phrases`);
      continue;
    }
    for (const phrase of list) {
      const hits = locate(texts, phrase);
      if (hits.length !== 1) p.push(`${where}: ${kindName} phrase "${phrase}" must occur exactly once in the slide text (found ${hits.length})`);
      else marks.push({ ...hits[0], kind: kindName, phrase });
    }
  }
  for (let a = 0; a < marks.length; a++) {
    for (let b = a + 1; b < marks.length; b++) {
      const x = marks[a];
      const y = marks[b];
      if (x.field === y.field && x.start < y.end && y.start < x.end) p.push(`${where}: "${x.phrase}" and "${y.phrase}" overlap`);
    }
  }

  for (const t of texts) {
    for (const rule of LINT) if (rule.re.test(t.text)) p.push(`${where} ${t.field}: ${rule.why}: "${t.text}"`);
    for (const term of blocklist) {
      if (t.text.toLowerCase().includes(term.toLowerCase())) p.push(`${where} ${t.field}: contains a never-on-image term ("${term}")`);
    }
    if (covered) {
      const missing = [...new Set([...t.text].filter((c) => c !== '\n' && !SVG_CHARS.has(c) && !covered.has(c.codePointAt(0))))];
      if (missing.length) p.push(`${where} ${t.field}: the fonts have no glyph for ${missing.map((c) => `"${c}" (U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')})`).join(', ')}`);
    }
  }
  return s;
}

export async function loadSpec(file, options = {}) {
  let raw;
  try {
    raw = JSON.parse((await fs.readFile(file, 'utf8')).replace(/^﻿/, ''));
  } catch (error) {
    throw new SpecError([`cannot read JSON: ${error.message}`], file);
  }
  return validateSpec(raw, { ...options, file });
}

/** Marks for one slide in the form text.rich() takes. */
export function slideMarks(slide) {
  const marks = [];
  if (isText(slide.gradient)) marks.push({ phrase: slide.gradient, cls: 'g' });
  for (const phrase of slide.mono ?? []) marks.push({ phrase, cls: 'mono' });
  for (const phrase of slide.chips ?? []) marks.push({ phrase, cls: 'chip' });
  return marks;
}

export { countOf };
