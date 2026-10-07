# Fonts

| File | Family | Version | Subset |
|---|---|---|---|
| `Geist-Latin.woff2` | Geist (variable, weight 100-900) | 1.800 | latin |
| `Geist-LatinExt.woff2` | Geist (variable, weight 100-900) | 1.800 | latin-ext |
| `GeistMono-Latin.woff2` | Geist Mono (variable, weight 100-900) | 1.701 | latin |
| `GeistMono-LatinExt.woff2` | Geist Mono (variable, weight 100-900) | 1.701 | latin-ext |

- **Licence:** SIL Open Font License 1.1 (the fonts' own `name` table points to
  https://openfontlicense.org). Copyright 2024 The Geist Project Authors
  (https://github.com/vercel/geist-font). If these files are ever shared outside
  this workspace, include the OFL text from that repository with them.
- **Source:** the personal-brand site's `next/font/google` build output,
  `Websites\Zain-Personal-Branding\source\.next\static\media\` (content-hashed
  names `caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2`, `7178b3e590c64307-s.21jp631_3pja2.woff2`,
  `797e433ab948586e-s.p.0r6juujl39pe6.woff2`, `bbc41e54d2fcbd21-s.1rgnod-3esatf.woff2`),
  copied here under stable names on 2026-10-02 so a site rebuild cannot break the renderer.
- **Not in these subsets:** arrows (U+2190-2197), the check mark and the rupee
  sign. `render.mjs` draws arrows as inline SVG and refuses any other character
  the fonts cannot draw, so nothing silently falls back to Arial.
