// Carousel PDF: one page per rendered PNG, printed by the same Chrome.
//
// Why from the PNGs and not from the slide HTML: Chrome's PDF output ignores
// backdrop-filter (the glass cards stop blurring) and turns blurred glows into
// large images. Printing the finished PNGs gives pages identical to the images.
//
// Why the MediaBox patch: Chrome rounds the page height up to 1/100 inch, so a
// 1350 px page (1012.5 pt) comes out 1013.04 pt tall with a thin strip at the
// bottom. The patch crops that strip by raising the box's bottom edge, written
// in exactly as many bytes as before, so the xref offsets stay valid.

import { esc } from './text.mjs';

export function pdfPageHtml(imageUrls, { width, height, title }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src file: data:">
<title>${esc(title ?? 'carousel')}</title>
<style>
@page { size: ${width}px ${height}px; margin: 0; }
html, body { margin: 0; padding: 0; background: #081b2d; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
img { display: block; width: ${width}px; height: ${height}px; break-after: page; }
img:last-child { break-after: auto; }
</style></head>
<body>${imageUrls.map((u) => `<img src="${esc(u)}" alt="">`).join('')}</body></html>`;
}

const BOX = /\/(MediaBox|CropBox)\s*\[\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*\]/g;

function num(n) {
  const r = Math.round(n * 100) / 100;
  let s = r.toFixed(2).replace(/\.?0+$/, '');
  if (s.startsWith('0.')) s = s.slice(1);
  if (s.startsWith('-0.')) s = '-' + s.slice(2);
  return s === '' || s === '-0' ? '0' : s;
}

/**
 * Makes every page box exactly widthPt x heightPt, keeping the top edge.
 * Returns { buffer, patched, boxes } and throws if a box is off by more than
 * the known rounding or cannot be rewritten in the same number of bytes.
 */
export function fixPageBoxes(pdf, widthPt, heightPt) {
  const text = pdf.toString('latin1');
  let patched = 0;
  const boxes = [];
  const out = text.replace(BOX, (whole, key, a, b, c, d) => {
    const [x0, y0, x1, y1] = [a, b, c, d].map(Number);
    const w = x1 - x0;
    const h = y1 - y0;
    boxes.push({ key, box: [x0, y0, x1, y1] });
    if (Math.abs(w - widthPt) > 0.01) throw new Error(`PDF ${key} width ${w} pt, expected ${widthPt} pt`);
    if (Math.abs(h - heightPt) <= 0.005) return whole;
    if (h < heightPt || h - heightPt > 2) throw new Error(`PDF ${key} height ${h} pt, expected ${heightPt} pt`);
    const top = Math.round(y1 * 100) / 100;
    const bottom = Math.round((top - heightPt) * 100) / 100;
    const inner = `/${key} [${num(x0)} ${num(bottom)} ${num(x1)} ${num(top)}`;
    if (inner.length + 1 > whole.length) throw new Error(`cannot rewrite ${whole} in place`);
    patched += 1;
    return inner + ' '.repeat(whole.length - inner.length - 1) + ']';
  });
  if (out.length !== text.length) throw new Error('PDF length changed while patching');
  return { buffer: Buffer.from(out, 'latin1'), patched, boxes };
}

/** Page count and page boxes, read from the raw PDF (Chrome writes them uncompressed). */
export function pdfInfo(pdf) {
  const text = pdf.toString('latin1');
  const pages = (text.match(/\/Type\s*\/Page(?![a-zA-Z])/g) ?? []).length;
  const counts = [...text.matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)|\/Count\s+(\d+)[^>]*?\/Type\s*\/Pages\b/g)].map((m) => Number(m[1] ?? m[2]));
  const boxes = [...text.matchAll(BOX)].filter((m) => m[1] === 'MediaBox').map((m) => [m[2], m[3], m[4], m[5]].map(Number));
  return { pages, count: counts.length ? Math.max(...counts) : null, mediaBoxes: boxes, header: text.slice(0, 8) };
}
