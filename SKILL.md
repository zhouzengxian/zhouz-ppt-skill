---
name: folded-starry-slide
description: Turn Markdown / agent output into a "Folded Starry" (折叠星空美学) HTML slide deck, then export a paginated PDF. Use when the user says "做幻灯片/做 PPT/做路演稿/做路演 PDF/做演示文稿", names "折叠星空/折叠星空美学/Folded Starry", or asks to turn a .md / folder / URL into a browsable HTML presentation plus a distributable high-fidelity PDF.
license: MIT
version: 1.0.0
---

# Folded Starry Slide (折叠星空美学)

A single-file, dependency-free HTML slide skill. Reads Markdown (or any agent answer), renders a **Folded Starry** dark deck — deep-space gradient + serif Chinese headlines + neon-pink/cyan accents + starfield + slow drift nebula glow — and exports a 16:9 paginated PDF. Works on CodeBuddy, Claude Code, Codex, CodeBuddy and any agent that reads markdown instructions.

## When to use

Triggers (any one):
- User provides a `.md` / folder / URL / agent answer and asks to "make slides / PPT / 路演稿 / 演示文稿 / 路演 PDF".
- User explicitly names "折叠星空 / 折叠星空美学 / Folded Starry".
- User wants a browsable HTML deck **and** a distributable PDF.

## Assets (where things live)

- `assets/template/index.html` — skeleton with `{{DOCUMENT_TITLE}}` placeholder.
- `assets/template/style.css` — all styling (colors, animations, print rules). **Edit here to retune the look.**
- `assets/template/app.js` — rendering engine + keyboard/touch nav + hash router + smooth scroll.
- `assets/slides.sample.js` — 9-type sample slide array. Copy as `slides.js`.
- `references/slide-types.md` — the 12 slide-type JSON schemas.
- `references/image-layout.md` — image placement rules (avoid overflow, smart crop).
- `scripts/export-pdf.ps1` — Windows PDF export (Edge/Chrome headless).
- `scripts/export-pdf.sh` — macOS/Linux PDF export (Chrome/Chromium headless).
- `scripts/export-img-pdf.cjs` — image-based PDF via Playwright (when emoji / iOS WeChat rendering matters most).
- `scripts/fix-ios-pdf.py` — universal PDF fix (rasterize + dither) so iOS WeChat won't band.

## The 5-stage workflow

### Stage 1 — Plan the deck
Before writing any HTML:
1. Read the source (.md / folder / URL / agent answer).
2. Decide slide count (aim 8–16 for a pitch; 18–28 for a teaching deck).
3. Pick a slide type per slide (see `references/slide-types.md`).
4. Define the page-rhythm (chapter dividers every 3–5 content slides).

State the outline to the user, then proceed. Don't stop to wait for approval unless the user explicitly asked you to confirm first.

### Stage 2 — Generate the deck
1. Copy `assets/template/index.html` + `assets/template/style.css` + `assets/template/app.js` into an output directory (e.g. `./output/<deck-name>/`).
2. Generate a `slides.js` from `assets/slides.sample.js` using the source content — one element per slide, **strictly following** the JSON schema in `references/slide-types.md`.
3. Replace `{{DOCUMENT_TITLE}}` in `index.html`.
4. Open `index.html` directly to preview (double-click works; no build step).

### Stage 3 — Preview & refine
- Start a static server: `python -m http.server 8000` (under the output dir).
- Tell the user to open `http://localhost:8000/` and report visual issues.
- Fix problems by editing `slides.js` (content) or `style.css` (look). Keep the 16:9 single-page structure.

### Stage 4 — Export PDF
Two paths — pick by priority:

**A. Vector PDF (default — text selectable, smallest):**
```
# Windows
powershell -ExecutionPolicy Bypass -File scripts/export-pdf.ps1 "<deck-dir>" "<name>" 8000
# macOS / Linux
bash scripts/export-pdf.sh <deck-dir> <name> 8000
```

**B. Image PDF (when the deck has emoji or must look identical in iOS WeChat):**
```
node scripts/export-img-pdf.cjs
```
(adjust the paths inside, or pass `<deck-dir> <port>`)

**C. iOS/WeChat-safe pass** (rasterize + dither, banding-free everywhere):
```
python scripts/fix-ios-pdf.py <source.pdf> 200
```

### Stage 5 — Hand over
- Give the user the PDF path + (optionally) the HTML folder.
- If deploying the HTML to a public link is requested, deploy the output dir as static assets.

## Design spec (Folded Starry aesthetic)

**Palette — do NOT drift.** Edit `style.css` `:root` if you must, but keep the contrast ratios.
| Token | Value | Use |
|---|---|---|
| `--bg-0` | `#06091a` | page bg deep end |
| `--bg-1` | `#0d1430` | page bg shallow end |
| `--text` | `#e7eaf3` | primary text |
| `--text-soft` | `rgba(231,234,243,.72)` | secondary text |
| `--accent-pink` | `#ff5a8a` | primary accent (numbers, emphasis) |
| `--accent-cyan` | `#6ec5ff` | secondary accent (links, labels) |
| `--gold` | `#ffd166` | highlight / data peaks |
| `--card-bg` | `rgba(20,26,52,.55)` | card surfaces |
| `--card-border` | `rgba(150,170,255,.14)` | card edges |

**Typography**
- Headlines: `Noto Serif SC` (Chinese serif, gravitas).
- Body: `Noto Sans SC`.
- Numbers / code: `JetBrains Mono`.

**Layout**
- 16:9 single page (design base 1280×720). Safe margin: 80px sides / 60px top-bottom.
- One idea per slide. Hierarchy: label → headline → body → data card.
- Decorative layers (starfield, noise, drifting nebula) are behind content; they never carry text.

## Hard rules

1. **Output goes to an output dir, never over the user's source files.**
2. **`slides.js` must validate against the JSON schema** in `references/slide-types.md` — wrong `type` / missing required field breaks the renderer.
3. **HTML/CSS/JS stay single-file-friendly** — the deck must open by double-clicking `index.html` with no build step.
4. **PDF is always the final deliverable** unless the user says HTML-only.
5. **Preserve the starry aesthetic** — if asked for a "light theme", that's a different skill; note it but don't silently switch palettes.
