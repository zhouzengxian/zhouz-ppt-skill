#!/usr/bin/env node
/**
 * export-img-pdf.cjs — 逐页截图合成「纯图片 PDF」（跨设备通用版）
 *
 * 解决问题：
 *   - Chromium headless 导出的矢量 PDF 在 iOS 微信预览会排版错乱
 *     （Soft Mask 缩放 bug + subset 字体 CMap 问题）
 *   - 矢量 PDF 里 emoji 字体未嵌入时，iOS/安卓 上变方块乱码
 *   - PyMuPDF rasterize 矢量 PDF 对「emoji 缺字形」同样无效
 *
 * 本方案：用 playwright 驱动真实浏览器逐页截图（emoji/渐变/字体全部
 * 渲染成像素），再用 pdf-lib 合成 PDF。任何设备 100% 一致显示。
 *
 * 适配所有「折叠星空风格」deck：自动探测 window.TOTAL / #deck 子元素数，
 * 优先用 window.show(i) 精确切页，回退到键盘 ArrowRight 翻页。
 *
 * 用法：
 *   node export-img-pdf.cjs [URL] [输出.pdf] [页数] [DPR]
 *     URL     本地预览地址，默认 http://localhost:8000/
 *     输出    PDF 路径，默认 ./deck-images.pdf
 *     页数    可选，不传自动探测
 *     DPR     设备像素比，默认 2（1280×720 viewport → 2560×1440 截图）
 *
 * 依赖（首次使用在输出目录或全局安装）：
 *   npm install playwright pdf-lib
 *   npx playwright install chromium   # 仅当系统无 Edge 时需要
 *
 * 优先复用系统 Edge（无需下载浏览器）：脚本自动用 channel:'msedge'，
 * 失败再回退到 playwright 自带 chromium。
 */
'use strict';
const fs = require('fs');
const path = require('path');

// 依赖可能装在「运行目录(cwd)」而非脚本所在目录（脚本随 skill 走），
// 用 require.resolve 的 paths 指定从 cwd 向上查找，兼容全局/项目本地安装。
function tryResolve(name) {
  try { return require.resolve(name); }
  catch {
    try { return require.resolve(name, { paths: [process.cwd()] }); }
    catch { return null; }
  }
}

let chromium, PDFDocument;
if (!tryResolve('playwright')) {
  console.error('\x1b[31m[缺少依赖] 未找到 playwright，请在当前项目目录运行：\x1b[0m');
  console.error('  npm install playwright pdf-lib');
  console.error('  npx playwright install chromium   # 系统无 Edge 时才需要');
  process.exit(1);
}
chromium = require(tryResolve('playwright')).chromium;

if (!tryResolve('pdf-lib')) {
  console.error('\x1b[31m[缺少依赖] 未找到 pdf-lib，请运行：\x1b[0m');
  console.error('  npm install pdf-lib');
  process.exit(1);
}
({ PDFDocument } = require(tryResolve('pdf-lib')));

const URL_ = process.argv[2] || 'http://localhost:8000/';
const OUT = process.argv[3] || 'deck-images.pdf';
const FORCE_TOTAL = process.argv[4] ? parseInt(process.argv[4], 10) : 0;
const DPR = process.argv[5] ? parseFloat(process.argv[5]) : 2;

// 16:9 viewport（截图原始尺寸 = viewport × DPR）
const VW = 1280, VH = 720;

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('\x1b[36m[图片版PDF] 启动浏览器...\x1b[0m');
  let browser;
  // 优先复用系统 Edge，避免下载 chromium
  try {
    browser = await chromium.launch({ channel: 'msedge' });
    console.log('  使用系统 Microsoft Edge');
  } catch {
    browser = await chromium.launch();
    console.log('  使用 playwright chromium');
  }

  const ctx = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: DPR,
  });
  const page = await ctx.newPage();

  console.log(`[图片版PDF] 打开 ${URL_}`);
  try {
    await page.goto(URL_, { waitUntil: 'networkidle', timeout: 30000 });
  } catch {
    // networkidle 超时（持续动画的 deck），降级为 domcontentloaded
    await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 30000 });
  }
  // 等 Google Fonts + 首帧渲染
  await sleep(2500);

  // 探测总页数
  let total = FORCE_TOTAL;
  if (!total) {
    total = await page.evaluate(() => {
      if (typeof window.TOTAL === 'number') return window.TOTAL;
      const deck = document.getElementById('deck');
      if (deck) return deck.children.length;
      return document.querySelectorAll('.slide').length || 1;
    });
  }
  console.log(`[图片版PDF] 共 ${total} 页，DPR=${DPR}，截图分辨率 ${VW * DPR}×${VH * DPR}`);

  const hasShow = await page.evaluate(() => typeof window.show === 'function');

  const shots = [];
  for (let i = 0; i < total; i++) {
    if (hasShow) {
      await page.evaluate(idx => window.show(idx), i);
    } else if (i > 0) {
      // 回退：键盘右箭头翻页
      await page.keyboard.press('ArrowRight');
    }
    // 等切页动画 + canvas 重绘稳定
    await sleep(650);
    const buf = await page.screenshot({ type: 'png' });
    shots.push(buf);
    process.stdout.write(`\r  截图 ${i + 1}/${total} 完成`);
  }
  console.log('');

  // 合成 PDF
  console.log('[图片版PDF] 合成 PDF...');
  const pdf = await PDFDocument.create();
  for (let i = 0; i < shots.length; i++) {
    const png = await pdf.embedPng(shots[i]);
    // PDF 页面尺寸 = 图片像素（保持 16:9），1px = 1pt
    const p = pdf.addPage([png.width, png.height]);
    p.drawImage(png, { x: 0, y: 0, width: png.width, height: png.height });
  }
  const bytes = await pdf.save();
  fs.writeFileSync(OUT, bytes);

  await browser.close();
  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`\x1b[32m[图片版PDF] 完成 → ${OUT}（${kb} KB，${total} 页）\x1b[0m`);
  console.log('  说明：纯图片 PDF，跨设备通用（iOS 微信 / 安卓 / 电脑均一致），文字不可选。');
})().catch(err => {
  console.error('\x1b[31m[图片版PDF] 失败：\x1b[0m', err.message);
  process.exit(1);
});
