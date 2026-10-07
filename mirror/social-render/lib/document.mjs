// Builds the one HTML page that holds every slide of a spec.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { esc } from './text.mjs';
import { renderSlide } from '../templates/slides.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const PATHS = {
  root: ROOT,
  fonts: path.join(ROOT, 'fonts'),
  templates: path.join(ROOT, 'templates'),
  config: path.join(ROOT, 'config.json'),
};

export const FONT_FILES = {
  sans: ['Geist-Latin.woff2', 'Geist-LatinExt.woff2'].map((f) => path.join(PATHS.fonts, f)),
  mono: ['GeistMono-Latin.woff2', 'GeistMono-LatinExt.woff2'].map((f) => path.join(PATHS.fonts, f)),
};

export function loadTemplates() {
  for (const f of [...FONT_FILES.sans, ...FONT_FILES.mono]) {
    if (!fs.existsSync(f)) throw new Error(`Font file missing: ${f}`);
  }
  const fontsUrl = pathToFileURL(PATHS.fonts).href;
  const read = (name) => fs.readFileSync(path.join(PATHS.templates, name), 'utf8');
  return {
    fontsCss: read('fonts.css').replaceAll('url("../fonts/', `url("${fontsUrl}/`),
    brandCss: read('brand.css'),
    pageJs: read('page.js'),
  };
}

// The page only ever needs local files; this keeps it off the network entirely.
const CSP = "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src file:; img-src file: data:";

export function buildDocument(spec, templates) {
  const { width, height } = spec.size;
  const total = spec.slides.length;
  const slides = spec.slides
    .map((s, i) => renderSlide(s, { index: i + 1, total, counter: spec.counter, byline: spec.byline }))
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<title>${esc(spec.documentTitle ?? spec.id)}</title>
<style>${templates.fontsCss}</style>
<style>${templates.brandCss}</style>
<style>:root { --w: ${width}px; --h: ${height}px; }</style>
</head>
<body class="fmt-${spec.format}">
${slides}
<script>${templates.pageJs}</script>
</body>
</html>
`;
}
