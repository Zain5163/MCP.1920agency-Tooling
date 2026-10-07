# Social-Render: project context

**Purpose.** Turn a small JSON spec into on-brand social images for the owner
(Zain Usman): exact-size PNGs and, for LinkedIn document carousels, a PDF built
from those PNGs. It uses the personal-brand design system (dark navy, teal and aqua
glass, Geist type, one gradient phrase per slide), so every post visual looks like
the site without hand design. Started 2026-10-02 for the week-1 LinkedIn drafts.

**It renders files only.** It never uploads, posts or calls any platform API.
Publishing stays with `AI-Automation\Social-Publisher` and the owner's approval step
in `AI-Automation\LinkedIn-Content-Ops`.

## How to use

```powershell
cd 'D:\My AI Works\AI-Automation\Social-Render'
node render.mjs <spec.json> [more specs...]      # writes next to each spec
node render.mjs --check <spec.json>              # validate only, no browser
node render.mjs <spec.json> --out <dir>          # write elsewhere (a preview)
npm test                                         # or: node --test test/render.test.mjs
```

Options: `--chrome <path>` (default: auto-detect Chrome, then Edge, or
`SOCIAL_RENDER_CHROME`), `--force` (write despite QA problems), `--keep-temp`,
`--json` (full report). Exit code 0 clean, 1 QA problem or bad spec, 2 setup error.

One run = one Chrome launch, whatever the number of specs and slides (5 specs,
21 slides and 3 PDFs take about 12 s).

Outputs, next to the spec: `image.png` for a single image; `slide-01.png` ...
and `carousel.pdf` for a carousel.

## Spec format

```jsonc
{
  "id": "2026-10-03-pm",
  "source": "path of the draft the text comes from (for the record)",
  "format": "portrait",            // portrait 1080x1350 | square 1080x1080 | story 1080x1920
  "kind": "carousel",              // single (1 slide) | carousel (2-20 slides, counter + PDF)
  "byline": "Zain Usman",          // default; shown with the brand mark on every slide
  "documentTitle": "...",          // optional; becomes the PDF's title metadata
  "slides": [ { "type": "cover", "headline": "...", "gradient": "...", "sub": "..." } ]
}
```

Optional top-level fields: `counter` (default true for carousels, refused on a
single), `minBodyPx` (default 34), `output` (`{ "png": "slide-{nn}.png", "pdf": "carousel.pdf" }`),
`notes`.

| Type | Fields (bold = required) |
|---|---|
| `cover` | eyebrow, **headline**, sub. Headline at the bottom, atmosphere above |
| `point` | eyebrow, **headline**, **body** (string or list of paragraphs) |
| `data` | eyebrow, **headline**, lead, **tiles** `[{value, label, frames?}]`, footer, layout `rows`/`grid`. `frames: ["4:5","1:1"]` draws plain outlines at exactly those ratios |
| `quote` | eyebrow, lead, **quote** (straight quote marks kept, opening one hung) |
| `checklist` | eyebrow, **headline**, **items**, footer. Numbered markers, never a tick |
| `flow` | eyebrow, **headline**, **steps** (2-6, joined by drawn arrows), footer |
| `closing` | eyebrow, **headline**, body, takeaway (large line under a divider) |

Every slide also takes:
- `gradient`: the one phrase in the brand gradient. It must occur exactly once in
  the slide's text. `false` means none. A data slide may use `gradientTiles: true`
  instead (the tile values carry it).
- `mono` (inline Geist Mono) and `chips` (a short code token in a pill): lists of
  phrases, each occurring exactly once.
- `series`: slides with the same series name get one type scale and the same
  headline position (for runs like Gate 1/2/3).
- `atmosphere`: override the decoration preset (`cover`, `point`, ... or `none`).
- `\n` in a text forces a line break; words are never added or changed.

## What the renderer checks (and refuses)

- **Spec:** unknown fields or types, a gradient phrase that is missing or repeated,
  overlapping marks, a counter on a single image.
- **Never on an image:** links, digit runs of 8+ (account, campaign or pixel IDs),
  `act_...`, Meta token fragments, "swipe", and the terms in `config.json`
  `neverOnImage` (the product's working name).
- **Glyphs:** any character the bundled fonts cannot draw. Arrows are drawn as
  inline SVG instead.
- **Fonts:** every Geist face must report `loaded` after `document.fonts.ready`.
- **Layout, per slide:** every text line, glass box and chip inside the content
  area, no word wider than its box, body text at least `minBodyPx` (34 px), any
  text at least 24 px. Type shrinks (headline first, then body, never under the
  minimum) only when needed; a series shares the smallest scale.
- **Decoration:** ribbons and orbs are moved vertically until they cross no text,
  glass box or header (and the byline/counter are never inside a ribbon), or hidden.
- **Files:** each PNG's IHDR is exactly the format size; the PDF has one page per
  slide and every page box is exactly 810 x 1012.5 pt (for portrait).
- **Fail closed:** if any check fails, nothing in the output folder is replaced;
  the render goes to `%TEMP%\social-render-rejected\<id>\` for inspection.

## Files

| Path | What |
|---|---|
| `render.mjs` | CLI |
| `lib/render.mjs` | The job: validate, one Chrome, PNGs, PDF, checks, atomic writes |
| `lib/chrome.mjs` | Chrome discovery, launch and DevTools-protocol client (global WebSocket) |
| `lib/spec.mjs` | Formats, slide types, validation and the never-on-image lint |
| `lib/document.mjs`, `templates/slides.mjs` | Spec to one HTML page (all slides) |
| `templates/brand.css` | The brand stylesheet (tokens from the design system) |
| `templates/fonts.css` | `@font-face` rules for the bundled fonts and the metric fallbacks |
| `templates/page.js` | In-page fit, series alignment, decoration avoidance and QA report |
| `lib/pdf.mjs`, `lib/png.mjs`, `lib/glyphs.mjs`, `lib/text.mjs` | PDF page boxes, PNG size, font coverage, escaping and marks |
| `fonts/` | Geist and Geist Mono WOFF2 (SIL OFL 1.1, see `fonts/README.md`) |
| `examples/` | Test fixtures: every slide type, plus square and story |
| `test/render.test.mjs` | 22 tests (unit, plus 2 integration tests that start Chrome) |
| `config.json` | `neverOnImage`, the 24 px text floor, the smallest headline scale |

## Decisions

- **Headless Chrome over the DevTools protocol, Node built-ins only.** No npm
  packages. `--disable-gpu` because blurred areas differed between runs with the GPU
  on; `--force-color-profile=srgb`; a throwaway profile per run (two Chromes on one
  profile fail with exit code 21); background networking off and a page CSP that
  allows only local files.
- **PDF from the PNGs, not from the slide HTML.** Chrome's PDF output ignores
  `backdrop-filter`, so the glass would differ, and its blurred glows become heavy
  images. Pages built from the PNGs are identical to the images.
- **MediaBox patch.** Chrome rounds the page height up to 1/100 inch (1013.04 pt
  instead of 1012.5 pt for 1350 px). `lib/pdf.mjs` raises the bottom edge of each box
  in the same number of bytes, so the xref stays valid.
- **Design system values are re-stated for a 1080 px canvas** in `brand.css`
  (tokens copied from `brand-tokens.ts` / `globals.css` on 2026-10-02). If the site
  tokens change, update `brand.css` by hand.
- **Byline is "Zain Usman"** (the design system's form); STRATEGY.md uses "Rana Zain
  Usman" for the profile. Change it per spec with `byline` if the owner prefers.
- **No CTA, "swipe" or tagline text** is ever added by a template. The only marks
  not taken from the spec are the byline, the carousel counter (`01 / 06`), list
  numbers and drawn shapes.
- **A one-letter word never ends a line** ("a", "A", "I" are tied to the next word
  with a no-break space). Only line breaking changes.
- **Inline mono is a softer aqua** than the eyebrow so the gradient phrase stays the
  only highlight.

## Current state (2026-10-02)

- Built and tested: `npm test` 22 of 22 pass, including real renders at
  1080x1350, 1080x1080 and 1080x1920 and the fail-closed path.
- Used for the week-1 LinkedIn visuals in
  `Marketing-and-Content\LinkedIn-Content-System\assets\<draft>\` (2 single images,
  3 carousels). **Nothing has been posted or uploaded.** The owner has not yet
  approved the designed cards in place of the optional real screenshots.

## Risks

- **Chrome updates** can shift rendering by a pixel or change the PDF page rounding.
  The size and page-box checks fail closed if that happens; re-run the tests after
  a Chrome update.
- **Text QA is geometric.** The checks catch overflow, clipping, small type and
  decoration crossing text. They cannot judge whether a layout looks good: open the
  PNGs before using them.
- **Spec text must come from the approved draft.** The renderer never invents words,
  but it renders whatever the spec says; keep `source` pointing at the draft.
- **Fonts are latin and latin-ext only.** Urdu or other scripts would be refused
  (correctly) until matching font files are added.

## Next actions

- When the owner approves a designed card, it can be scheduled with the draft:
  `Approve-LinkedInPosts.ps1` passes the draft's `image:` file to the CLI.
- Document (PDF) posting through the publisher is being added separately; the
  drafts already carry `document:` and `document_title:`.
- Possible later: a 1584x396 LinkedIn cover format, a 1280x720 thumbnail format, and
  a video caption-burn step for the 10-07 MID video (out of scope here).
