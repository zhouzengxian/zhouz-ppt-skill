#requires -version 5
<#
.SYNOPSIS
  Folded Starry Slide - HTML deck to PDF exporter (Windows / PowerShell)
.DESCRIPTION
  Uses Edge / Chrome headless mode to export a local HTML slide deck to a paginated PDF.
  Automatically handles:
  - Locating the browser executable (Edge first, then Chrome)
  - 13.333in x 7.5in (16:9) page size
  - virtual-time-budget to wait for Google Fonts
  - Temporary user-data-dir to avoid conflicts with an already-open browser
.PARAMETER Dir
  Directory of the HTML project (must already be served via `python -m http.server`)
.PARAMETER Name
  Output PDF filename (without extension), default 'deck'
.PARAMETER Port
  Local HTTP server port, default 8000
.PARAMETER Budget
  virtual-time-budget in ms (increase for many pages), default 15000
.EXAMPLE
  .\export-pdf.ps1 "c:\project\mydeck" "mydeck" 8000
.EXAMPLE
  .\export-pdf.ps1 "c:\project\mydeck" "mydeck" 8000 -Ios
  (also produces an iOS/WeChat-compatible version mydeck-ios.pdf)
#>
param(
  [Parameter(Mandatory=$true)][string]$Dir,
  [string]$Name = 'deck',
  [int]$Port = 8000,
  [int]$Budget = 15000,
  [switch]$Ios
)

$ErrorActionPreference = 'Stop'

# 1. Locate browser
$candidates = @(
  'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
  'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
  'C:\Program Files\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
)
$browser = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) {
  Write-Error "Edge or Chrome not found. Please install Microsoft Edge first."
  exit 1
}
Write-Host "Using browser: $browser" -ForegroundColor Cyan

# 2. Validate directory
if (-not (Test-Path (Join-Path $Dir 'index.html'))) {
  Write-Error "index.html not found under $Dir"
  exit 1
}

# 3. Output path
$pdf = Join-Path $Dir "$Name.pdf"
if (Test-Path $pdf) { Remove-Item $pdf -Force }

# 4. Temporary user-data-dir
$userData = Join-Path $env:TEMP "starry-pdf-export-$(Get-Random)"
New-Item -ItemType Directory -Force -Path $userData | Out-Null

# 5. Invoke headless print
$url = "http://localhost:$Port/"
Write-Host "Exporting PDF: $url -> $pdf" -ForegroundColor Yellow

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $browser
$psi.Arguments = "--headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=$Budget --user-data-dir=`"$userData`" --print-to-pdf=`"$pdf`" `"$url`""
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.CreateNoWindow = $true

$proc = [System.Diagnostics.Process]::Start($psi)
$deadline = (Get-Date).AddSeconds(60)
while (-not (Test-Path $pdf) -and (Get-Date) -lt $deadline) {
  Start-Sleep -Milliseconds 500
}
Start-Sleep -Seconds 2

# 6. Cleanup temp dir
try { Remove-Item $userData -Recurse -Force -ErrorAction SilentlyContinue } catch {}

# 7. Report
if (Test-Path $pdf) {
  $size = [math]::Round((Get-Item $pdf).Length / 1KB, 1)
  Write-Host ""
  Write-Host "PDF exported successfully" -ForegroundColor Green
  Write-Host "   Path: $pdf"
  Write-Host "   Size: $size KB"
} else {
  Write-Error "PDF export failed. Check: 1) HTTP server running on port $Port  2) browser not occupied by another process"
  exit 1
}

# 8. iOS/WeChat compatibility (optional, -Ios switch)
if ($Ios) {
  $fixScript = Join-Path $PSScriptRoot "fix-ios-pdf.py"
  $iosPdf = Join-Path $Dir "$Name-ios.pdf"
  if (-not (Test-Path $fixScript)) {
    Write-Host "fix-ios-pdf.py not found, skipping iOS compatibility pass" -ForegroundColor Yellow
    Write-Host "   Run manually: python fix-ios-pdf.py `"$pdf`""
  } else {
    Write-Host ""
    Write-Host "Generating iOS/WeChat-compatible version (rasterized 200 DPI)..." -ForegroundColor Yellow
    python -c "import fitz" 2>$null
    if ($LASTEXITCODE -ne 0) {
      Write-Host "   Installing pymupdf..." -ForegroundColor DarkYellow
      pip install pymupdf --quiet 2>&1 | Out-Null
    }
    & python $fixScript $pdf 2>&1 | Select-Object -Last 3 | ForEach-Object { Write-Host "   $_" }
    if (Test-Path $iosPdf) {
      $iosSize = [math]::Round((Get-Item $iosPdf).Length / 1KB, 1)
      Write-Host ""
      Write-Host "iOS-compatible version generated" -ForegroundColor Green
      Write-Host "   Path: $iosPdf"
      Write-Host "   Size: $iosSize KB"
      Write-Host "   Note: each page rasterized to image, correct layout in iOS WeChat (text not selectable)"
    } else {
      Write-Host "iOS compatibility pass failed, check pymupdf installation" -ForegroundColor Yellow
    }
  }
}
