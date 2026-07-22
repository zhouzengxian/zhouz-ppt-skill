# zhouz-ppt-skill — for Claude Code

> This is the Claude Code entry point. The full workflow + design spec lives in [`SKILL.md`](./SKILL.md). This file just tells Claude Code how to use it.

## What this is

A skill that turns Markdown / your project docs / an agent answer into a **Folded Starry** (折叠星空美学) HTML slide deck and a 16:9 paginated PDF. Deep-space gradient, serif Chinese headlines, neon-pink/cyan accents, starfield, drifting nebula glow.

## How to install for Claude Code

Two options:

### Option A — Project-level (recommended)
Copy this whole folder into your project (or add as a git submodule), then reference it. Claude Code auto-reads files named `CLAUDE.md`, so just point it at the skill when you need it:

> "Use the zhouz-ppt-skill skill (see CLAUDE.md / SKILL.md in ./zhouz-ppt-skill) to turn README.md into a pitch deck + PDF."

### Option B — As a slash command
Symlink or copy [`SKILL.md`](./SKILL.md) into your `.claude/commands/` directory:

```bash
mkdir -p .claude/commands
cp zhouz-ppt-skill/SKILL.md .claude/commands/zhouz-ppt-skill.md
```

Then invoke with: `/zhouz-ppt-skill`

## How to use (workflow summary)

1. **Plan** — read the source, pick slide types, decide count (see `references/slide-types.md`).
2. **Generate** — copy `assets/template/{index.html,style.css,app.js}` into an output dir, write `slides.js` from the source.
3. **Preview** — `python -m http.server 8000`, open `http://localhost:8000/`, refine.
4. **Export PDF** — `scripts/export-pdf.sh <dir> <name> 8000` (macOS/Linux) or `scripts/export-pdf.ps1` (Windows).
5. **Hand over** the PDF (and HTML folder if wanted).

For the full design spec (palette, typography, layout, hard rules) read [`SKILL.md`](./SKILL.md).
