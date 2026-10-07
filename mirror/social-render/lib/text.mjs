// Text helpers: HTML escaping, inline marks (gradient phrase, mono, chips) and
// SVG stand-ins for the arrow characters Geist has no glyph for.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESC[c]);
}

const svg = (paths, cls = 'arrow') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

// Lucide arrow paths (the site uses Lucide icons).
export const ARROW_SVG = {
  '→': svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'), // right
  '←': svg('<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>'), // left
  '↑': svg('<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>'), // up
  '↓': svg('<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>'), // down
  '↗': svg('<path d="M7 7h10v10"/><path d="M7 17 17 7"/>'), // up-right
};

export const ARROW_DOWN_BLOCK = svg('<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>', 'flow-arrow');

/** Characters drawn as SVG, so they do not need a font glyph. */
export const SVG_CHARS = new Set(Object.keys(ARROW_SVG));

// A one-letter word never ends a line ("call a / campaign"): the space after
// it becomes a no-break space. Only line breaking changes, never the words.
const TIE = /(^|[\s("'])(a|A|I) /g;

/** Escapes text, draws arrows as SVG and turns "\n" into a line break. */
export function plain(text) {
  let out = '';
  for (const ch of String(text).replace(TIE, '$1$2 ')) {
    if (ARROW_SVG[ch]) out += ARROW_SVG[ch];
    else if (ch === '\n') out += '<br>';
    else out += ESC[ch] ?? ch;
  }
  return out;
}

/**
 * Wraps each mark's phrase where it occurs in `text`, then escapes the rest.
 * marks: [{ phrase, cls }]. The spec validator has already made sure every
 * phrase occurs exactly once on its slide and that marks never overlap.
 */
export function rich(text, marks = []) {
  const s = String(text);
  const hits = [];
  for (const m of marks) {
    const at = s.indexOf(m.phrase);
    if (at >= 0) hits.push({ start: at, end: at + m.phrase.length, cls: m.cls });
  }
  hits.sort((a, b) => a.start - b.start);
  let out = '';
  let pos = 0;
  for (const h of hits) {
    if (h.start < pos) throw new Error(`Overlapping marks in "${s}"`);
    out += plain(s.slice(pos, h.start));
    out += `<span class="${h.cls}">${plain(s.slice(h.start, h.end))}</span>`;
    pos = h.end;
  }
  return out + plain(s.slice(pos));
}

/** Counts non-overlapping occurrences of `phrase` in `text`. */
export function countOf(text, phrase) {
  if (!phrase) return 0;
  let n = 0;
  for (let at = text.indexOf(phrase); at >= 0; at = text.indexOf(phrase, at + phrase.length)) n += 1;
  return n;
}

export const pad2 = (n) => String(n).padStart(2, '0');
