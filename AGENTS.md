# zhouz-ppt-skill — for OpenAI Codex

> This is the Codex entry point. The full workflow + design spec lives in [`SKILL.md`](./SKILL.md).

## What this is

A skill that turns Markdown / project docs / an agent answer into a **Folded Starry** (折叠星空美学) HTML slide deck and a 16:9 paginated PDF. Codex reads this `AGENTS.md` automatically when it's in the project root or a subdirectory it's working in.

## Quick start

1. Add this folder to your project (git submodule or copy).
2. Tell Codex:

   > "Use the zhouz-ppt-skill skill (AGENTS.md / SKILL.md) to turn docs/pitch.md into a slide deck + PDF. Put output in ./output/pitch/."

3. Codex follows the 5-stage workflow in `SKILL.md`:
   - Plan slide outline from the source.
   - Copy `assets/template/{index.html,style.css,app.js}` → output dir, write `slides.js`.
   - Preview via `python -m http.server 8000`.
   - Export PDF: `bash scripts/export-pdf.sh <dir> <name> 8000` (or `.ps1` on Windows).
   - Return the PDF path.

## Key files

| File | Purpose |
|---|---|
| `SKILL.md` | Full workflow + design spec (read this). |
| `assets/template/` | HTML/CSS/JS skeleton — copy these. |
| `assets/slides.sample.js` | Sample slide array — model your `slides.js` on this. |
| `references/slide-types.md` | The 12 slide-type JSON schemas. |
| `scripts/` | PDF export (vector + image + iOS-safe). |

## Hard rules (from SKILL.md)

- Output to an output dir, never overwrite source files.
- `slides.js` must match the schema in `references/slide-types.md`.
- Deck must open by double-clicking `index.html` (no build step).
- PDF is the default final deliverable.
- Preserve the starry palette — don't silently switch to a light theme.
