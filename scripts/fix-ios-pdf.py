"""
Fix PDF for iOS WeChat compatibility + universal (no banding).

Two problems solved in one pass:
  1. iOS WeChat PDFKit mangles Chromium vector PDFs (Soft Mask scaling bug)
     -> rasterize each page to image so PDFKit only renders flat images.
  2. 8-bit RGB quantization causes visible banding in dark gradients on
     desktop/retina screens -> apply random dithering (+-1 per channel) to
     break up the color steps into high-frequency noise (visually smooth).

Outputs:
  - *-ios.pdf    : rasterized + dithered, UNIVERSAL (iOS + desktop + Android)
  - *-clean.pdf  : vector cleaned/normalized, lightweight, text selectable

Usage:
  python fix-ios-pdf.py <source.pdf> [DPI]
    DPI default 200
"""
import sys, os
import fitz  # pymupdf
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else 'deck.pdf'
DPI = int(sys.argv[2]) if len(sys.argv) > 2 else 200

base, ext = os.path.splitext(SRC)
out_ios = base + "-ios.pdf"
out_clean = base + "-clean.pdf"

doc = fitz.open(SRC)
n = doc.page_count
print(f"Source: {n} pages, DPI={DPI}")

# --- Version 1: cleaned/normalized vector PDF (lightweight fix) ---
doc.save(out_clean, garbage=4, deflate=True, clean=True)
print(f"Clean vector PDF -> {out_clean} ({os.path.getsize(out_clean)//1024} KB)")

# --- Version 2: rasterized + dithered image PDF (UNIVERSAL: iOS + desktop) ---
zoom = DPI / 72.0
mat = fitz.Matrix(zoom, zoom)
rng = np.random.default_rng(1337)

new = fitz.open()
for i in range(n):
    page = doc[i]
    pix = page.get_pixmap(matrix=mat, alpha=False)
    # Dither: +-1 random noise per channel to break 8-bit banding in gradients.
    arr = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
    noise = rng.integers(-1, 2, arr.shape, dtype=np.int16)  # -1, 0, +1
    dithered = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    new_pix = fitz.Pixmap(pix.colorspace, pix.width, pix.height, dithered.tobytes())
    img_bytes = new_pix.tobytes("png")
    rect = page.rect
    np_page = new.new_page(width=rect.width, height=rect.height)
    np_page.insert_image(rect, stream=img_bytes)
    print(f"  page {i+1}/{n} rasterized+dithered ({pix.width}x{pix.height})")

new.save(out_ios, garbage=4, deflate=True)
new.close()
print(f"\nUniversal rasterized PDF -> {out_ios} ({os.path.getsize(out_ios)//1024} KB)")
print("DONE")
