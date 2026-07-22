#!/usr/bin/env bash
# Folded Starry Slide - HTML deck to PDF exporter (macOS / Linux)
#
# Uses Chrome/Chromium headless mode to export a local HTML slide deck to a
# paginated PDF. Vector PDF, fonts embedded, 16:9 pagination.
#
# Usage:
#   ./export-pdf.sh <dir> [name] [port] [budget_ms]
#     dir       HTML project directory (must be served via `python -m http.server`)
#     name      output PDF filename without extension (default: deck)
#     port      local HTTP server port (default: 8000)
#     budget    virtual-time-budget in ms (default: 15000)
#
# Example:
#   ./export-pdf.sh ./mydeck mydeck 8000
set -euo pipefail

DIR="${1:?Usage: $0 <dir> [name] [port] [budget]}"
NAME="${2:-deck}"
PORT="${3:-8000}"
BUDGET="${4:-15000}"

# 1. Locate browser
BROWSER=""
for cand in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  "/usr/bin/google-chrome" \
  "/usr/bin/google-chrome-stable" \
  "/usr/bin/chromium" \
  "/usr/bin/chromium-browser" \
  "/snap/bin/chromium"; do
  if [ -x "$cand" ]; then BROWSER="$cand"; break; fi
done

if [ -z "$BROWSER" ]; then
  echo "ERROR: Chrome/Chromium/Edge not found. Please install one first." >&2
  exit 1
fi
echo "Using browser: $BROWSER"

# 2. Validate directory
if [ ! -f "$DIR/index.html" ]; then
  echo "ERROR: index.html not found under $DIR" >&2
  exit 1
fi

# 3. Output path
PDF="$DIR/$NAME.pdf"
rm -f "$PDF"

# 4. Temporary user-data-dir
USERDATA="$(mktemp -d 2>/dev/null || mktemp -d -t starry)"
trap 'rm -rf "$USERDATA"' EXIT

# 5. Invoke headless print
URL="http://localhost:$PORT/"
echo "Exporting PDF: $URL -> $PDF"

"$BROWSER" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget="$BUDGET" \
  --user-data-dir="$USERDATA" \
  --print-to-pdf="$PDF" \
  "$URL" >/dev/null 2>&1 || true

# 6. Report
if [ -f "$PDF" ]; then
  SIZE=$(du -k "$PDF" | cut -f1)
  echo ""
  echo "PDF exported successfully"
  echo "   Path: $PDF"
  echo "   Size: ${SIZE} KB"
  echo "   Note: vector PDF (text selectable). For iOS WeChat viewers or decks"
  echo "         with emoji, prefer the image-based PDF (export-img-pdf.cjs)."
else
  echo "ERROR: PDF export failed. Check: 1) HTTP server running on port $PORT  2) browser available" >&2
  exit 1
fi
