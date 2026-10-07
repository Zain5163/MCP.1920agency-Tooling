// Slide types. Each builder gets the validated slide and `r`, which renders a
// text string with its marks (gradient phrase, mono, chips) and escapes it.
// Words are never added here: every visible string comes from the spec. The
// only non-spec marks are the byline, the carousel counter, list numbers and
// drawn shapes (arrows, aspect-ratio frames).

import { esc, rich, pad2, ARROW_DOWN_BLOCK } from '../lib/text.mjs';
import { slideMarks } from '../lib/spec.mjs';

const BRAND_MARK = '<span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>';

const ATMOSPHERE = {
  cover: ['glow glow--teal', 'glow glow--lilac', 'ribbon', 'orb'],
  point: ['glow glow--teal', 'glow glow--lilac', 'ribbon ribbon--lilac'],
  data: ['glow glow--teal', 'glow glow--lilac', 'ribbon'],
  quote: ['glow glow--teal', 'glow glow--lilac', 'ribbon', 'orb'],
  checklist: ['glow glow--teal', 'glow glow--lilac', 'ribbon'],
  flow: ['glow glow--teal', 'glow glow--lilac', 'ribbon ribbon--lilac'],
  closing: ['glow glow--teal', 'story-orb', 'ribbon ribbon--lilac'],
  none: [],
};

const list = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const eyebrow = (s, r) => (s.eyebrow ? `<p class="eyebrow">${r(s.eyebrow)}</p>` : '');

function frame(ratio) {
  const [w, h] = String(ratio).split(':');
  return `<span class="shape" style="aspect-ratio: ${Number(w)} / ${Number(h)}" title="${esc(ratio)}"></span>`;
}

const BUILDERS = {
  cover: (s, r) =>
    `${eyebrow(s, r)}<h1 class="display">${r(s.headline)}</h1>${s.sub ? `<p class="lead">${r(s.sub)}</p>` : ''}`,

  point: (s, r) =>
    `${eyebrow(s, r)}<h2 class="headline">${r(s.headline)}</h2>` +
    `<div class="copy">${list(s.body).map((p) => `<p class="body">${r(p)}</p>`).join('')}</div>`,

  data: (s, r) => {
    const tiles = s.tiles.map((t) => {
      if (t.frames) {
        return `<div class="tile tile--shape glass"><div class="frames">${t.frames.map(frame).join('')}</div>` +
          `<div class="tile-copy"><span class="tile-label">${r(t.label)}</span><span class="tile-sub">${r(t.value)}</span></div></div>`;
      }
      const value = s.gradientTiles ? `<span class="tile-value g">${esc(t.value)}</span>` : `<span class="tile-value">${r(t.value)}</span>`;
      return `<div class="tile glass">${value}<span class="tile-label">${r(t.label)}</span></div>`;
    });
    const layout = s.layout ?? 'rows';
    return `${eyebrow(s, r)}<h2 class="headline">${r(s.headline)}</h2>` +
      (s.lead ? `<p class="body lead-in">${r(s.lead)}</p>` : '') +
      `<div class="tiles tiles--${layout}" style="--cols: ${Math.min(3, s.tiles.length)}">${tiles.join('')}</div>` +
      (s.footer ? `<p class="body foot">${r(s.footer)}</p>` : '');
  },

  quote: (s, r, marks) => {
    // Keep the draft's straight quote marks; colour them and hang the opening one.
    const q = s.quote;
    const open = q.startsWith('"');
    const close = q.length > 1 && q.endsWith('"');
    const inner = q.slice(open ? 1 : 0, close ? -1 : undefined);
    return `${eyebrow(s, r)}${s.lead ? `<p class="lead">${r(s.lead)}</p>` : ''}` +
      `<blockquote class="quote">${open ? '<span class="qm qm-open">&quot;</span>' : ''}${rich(inner, marks)}${close ? '<span class="qm">&quot;</span>' : ''}</blockquote>`;
  },

  checklist: (s, r) =>
    `${eyebrow(s, r)}<h2 class="headline">${r(s.headline)}</h2>` +
    `<ol class="checklist">${s.items.map((it, i) => `<li class="check glass"><span class="check-n">${pad2(i + 1)}</span><span class="check-text">${r(it)}</span></li>`).join('')}</ol>` +
    (s.footer ? `<p class="note">${r(s.footer)}</p>` : ''),

  flow: (s, r) =>
    `${eyebrow(s, r)}<h2 class="headline">${r(s.headline)}</h2>` +
    `<div class="flow">${s.steps.map((st, i) => `${i ? ARROW_DOWN_BLOCK : ''}<div class="step glass">${r(st)}</div>`).join('')}</div>` +
    (s.footer ? `<p class="body foot">${r(s.footer)}</p>` : ''),

  closing: (s, r) => {
    const body = list(s.body);
    return `${eyebrow(s, r)}<h2 class="headline">${r(s.headline)}</h2>` +
      (body.length ? `<div class="copy${body.length > 1 ? ' copy--lines' : ''}">${body.map((p) => `<p class="body">${r(p)}</p>`).join('')}</div>` : '') +
      (s.takeaway ? `<p class="takeaway">${r(s.takeaway)}</p>` : '');
  },
};

export function renderSlide(slide, ctx) {
  const marks = slideMarks(slide);
  const r = (text) => rich(text, marks);
  const preset = slide.atmosphere ?? slide.type;
  const atmos = ATMOSPHERE[preset].map((c) => `<i class="${c}"></i>`).join('');
  const counter = ctx.counter ? `<span class="counter">${pad2(ctx.index)} / ${pad2(ctx.total)}</span>` : '';
  return `<section class="slide t-${slide.type}" data-n="${ctx.index}"${slide.series ? ` data-series="${esc(slide.series)}"` : ''}>` +
    `<div class="atmos atmos--${preset}" aria-hidden="true">${atmos}</div>` +
    `<div class="frame"><header class="top"><span class="byline">${BRAND_MARK}<strong>${esc(ctx.byline)}</strong></span>${counter}</header>` +
    `<div class="main"><div class="stack">${BUILDERS[slide.type](slide, r, marks)}</div></div></div></section>`;
}
