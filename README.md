<div align="center">

# ✦ Folded Starry Slide

### 折叠星空美学 · AI 幻灯片生成技能

*把任意 Markdown / 文档 / agent 回答，一键变成可翻页的星空风 HTML 演示稿 + 高保真 PDF*

**通用 · 跨平台 · 零依赖 · 多 Agent 兼容**

[![License: MIT](https://img.shields.io/badge/License-MIT-ff5a8a.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Win%20%7C%20macOS%20%7C%20Linux-6ec5ff.svg)]()
[![No Build](https://img.shields.io/badge/build-none%20(double--click%20to%20run)-ffd166.svg)]()
[![Agents](https://img.shields.io/badge/works%20with-CodeBuddy%20%7C%20Claude%20Code%20%7C%20Codex%20%7C%20more-0d1430.svg)]()

</div>

---

## 这是什么

**Folded Starry Slide** 是一套面向 AI 编程助手（CodeBuddy / Claude Code / Codex / CodeBuddy / 任何读 markdown 的 agent）的**幻灯片生成技能**。

给它一份 Markdown、一个文件夹、一个 URL，或一段 agent 回答，它会：

1. 规划大纲 → 2. 生成**折叠星空美学**的 HTML 演示稿（深空渐变 + 衬线中文标题 + 霓虹粉/青强调 + 星点 + 缓慢漂移的星云光晕）→ 3. 导出 **16:9 分页 PDF**。

成品是一套**双击即可打开**的单文件 HTML 演示（无需 build），外加一份可直接分发的 PDF。

> 适合：产品介绍、黑客松路演、技术汇报、商业计划书、知识分享。

---

## ✨ 特性

- 🌌 **折叠星空美学** — 深空蓝紫黑渐变、衬线标题、霓虹强调色、星点与漂移星云，开箱即用的高质感暗色演示。
- 📑 **12 种幻灯片类型** — 封面 / 章节 / 目录 / 数据 / 卡片网格 / 时间线 / 对比 / 引用 / 图片 / 结束… 覆盖路演与教学全场景。
- 📄 **双产物** — 可翻页交互 HTML + 可分发的高保真 PDF（矢量，文字可选）。
- 🈶 **中文优先排版** — Noto Serif SC 标题、Noto Sans SC 正文，中文断行与层级专门调优。
- 🧩 **多 Agent 兼容** — 提供 `SKILL.md`（CodeBuddy/通用）、`CLAUDE.md`（Claude Code）、`AGENTS.md`（Codex）三种入口。
- 🖥️ **跨平台导出** — Windows (PowerShell) / macOS / Linux (bash) 全覆盖；另有 Playwright 图片版 PDF 与 iOS 微信兼容方案。
- ⚡ **零依赖、无构建** — 纯 HTML/CSS/JS，双击 `index.html` 即预览，不装任何东西。
- 🎨 **可定制** — 改 `style.css` 的 `:root` 变量即可换色，改 `slides.js` 即换内容。

---

## 🚀 快速开始

### 方式一：让 AI 帮你生成（推荐）

把这个仓库放进你的项目，然后对 AI 说：

> "用 folded-starry-slide 技能，把 `README.md` 做成一套折叠星空风格的幻灯片 + PDF，输出到 `./output/pitch/`。"

AI 会自动执行 5 阶段流程（规划 → 生成 → 预览 → 导出 PDF → 交付）。详见 [SKILL.md](./SKILL.md)。

### 方式二：手动使用模板

```bash
# 1. 复制模板到你的输出目录
mkdir -p my-deck
cp assets/template/index.html assets/template/style.css assets/template/app.js my-deck/

# 2. 基于 samples 写 slides.js（编辑 my-deck/slides.js）
cp assets/slides.sample.js my-deck/slides.js

# 3. 预览（双击 index.html，或起个静态服务器）
cd my-deck && python -m http.server 8000
# 浏览器打开 http://localhost:8000/

# 4. 导出 PDF
bash ../scripts/export-pdf.sh . deck 8000     # macOS / Linux
# 或 Windows:
# powershell -ExecutionPolicy Bypass -File ..\scripts\export-pdf.ps1 . deck 8000
```

---

## 🤖 各 AI 编程助手安装方式

本技能**不绑定任何单一 agent**。它本质上是一份结构化的 markdown 指令 + 资产文件，任何能读 markdown 并操作文件的 AI 编程助手都能用。

### CodeBuddy / CodeBuddy

把整个文件夹放到 `.codebuddy/skills/folded-starry-slide/`，它会自动读取 `SKILL.md`（带 frontmatter）：

```bash
cp -r folded-starry-slide ~/.codebuddy/skills/folded-starry-slide
```

触发词：`折叠星空`、`做幻灯片`、`做PPT`、`做路演 PDF`、`做演示文稿`。

### Claude Code

Claude Code 会自动读取 `CLAUDE.md`：

```bash
# 项目级：直接把文件夹放进项目
# 或作为 slash command：
mkdir -p .claude/commands
cp folded-starry-slide/SKILL.md .claude/commands/folded-starry-slide.md
# 然后用 /folded-starry-slide 调用
```

### OpenAI Codex

Codex 会自动读取 `AGENTS.md`。把文件夹加入项目，告诉它 "用 folded-starry-slide 技能…" 即可。

### 其他 agent（Cursor / Windsurf / Cline / 任意支持 markdown 指令的）

把 [SKILL.md](./SKILL.md) 的内容作为项目指令/规则文件喂给 agent 即可。核心是一份通用的人类可读工作流，不依赖任何私有格式。

---

## 📐 幻灯片类型一览

完整 JSON schema 见 [`references/slide-types.md`](./references/slide-types.md)。

| 类型 | `type` | 用途 |
|---|---|---|
| 封面 | `title` | 标题 / 副标题 / 作者 / 日期 |
| 章节分隔 | `chapter` | 大章节过渡 |
| 目录 | `agenda` | 全篇结构导航 |
| 文字要点 | `text` | 标题 + 段落 + 要点列表 |
| 数据 | `stats` | 关键数字 / 指标卡 |
| 卡片网格 | `cards` | 多个并列卡片 |
| 时间线 | `timeline` | 时间轴 / 里程碑 |
| 对比 | `compare` | 双栏对照 |
| 引用 | `quote` | 金句 / 引言 |
| 图片 | `image` | 大图 / 图文混排 |
| 结束 | `closing` | 致谢 / 联系方式 |

图片排版规则见 [`references/image-layout.md`](./references/image-layout.md)。

---

## 📄 PDF 导出（3 种方案）

### A. 矢量 PDF（默认 · 文字可选 · 体积最小）

```bash
# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts/export-pdf.ps1 "<deck-dir>" "<name>" 8000

# macOS / Linux
bash scripts/export-pdf.sh <deck-dir> <name> 8000
```
> 需要本机装有 Edge / Chrome / Chromium（脚本会自动定位）。导出前先在该目录起 `python -m http.server 8000`。

### B. 图片版 PDF（含 emoji / 要求像素级一致）

```bash
node scripts/export-img-pdf.cjs <deck-dir> 8000
```
> 依赖 Playwright（`npm i playwright && npx playwright install chromium`）。每页栅格化为图片，emoji 渲染最稳。

### C. iOS / 微信兼容（防色带 · 全平台一致）

```bash
python scripts/fix-ios-pdf.py <source.pdf> 200   # DPI
```
> 依赖 PyMuPDF（`pip install pymupdf`）。栅格化 + 随机抖动去色带，解决 iOS 微信 PDFKit 渲染矢量 PDF 时的色带与排版错乱。

---

## 🎨 设计规范（折叠星空美学）

### 配色（在 `style.css` `:root` 调整）

| Token | 值 | 用途 |
|---|---|---|
| `--bg-0` | `#06091a` | 页面背景深端 |
| `--bg-1` | `#0d1430` | 页面背景浅端 |
| `--text` | `#e7eaf3` | 主文字 |
| `--accent-pink` | `#ff5a8a` | 主强调（数字 / 重点） |
| `--accent-cyan` | `#6ec5ff` | 副强调（链接 / 标签） |
| `--gold` | `#ffd166` | 高亮 / 数据峰值 |
| `--card-bg` | `rgba(20,26,52,.55)` | 卡片底 |
| `--card-border` | `rgba(150,170,255,.14)` | 卡片描边 |

### 字体

- 标题：**Noto Serif SC**（中文衬线，庄重）
- 正文：**Noto Sans SC**
- 数字 / 代码：**JetBrains Mono**

### 布局

- 16:9 单页（设计基准 1280×720），安全边距 80px / 60px。
- 一页一个观点。装饰层（星点 / 噪点 / 漂移星云）永远在内容之后，不承载文字。

---

## 🛠️ 自定义

- **换配色**：编辑 `assets/template/style.css` 顶部 `:root` 变量。
- **换字体**：改 `index.html` 的 Google Fonts 链接 + `style.css` 的 `font-family`。
- **换主题（浅色）**：本技能专注暗色星空；浅色属于另一套技能，请勿混用 `:root`。
- **加新幻灯片类型**：在 `app.js` 渲染分支 + `references/slide-types.md` schema 同步新增。

---

## ❓ FAQ

**Q: 需要装 Node / 构建工具吗？**
不需要。HTML 演示纯静态，双击即开。PDF 导出才需要浏览器（A 方案）或可选的 Playwright/PyMuPDF（B/C 方案）。

**Q: 为什么我的 PDF 在 iPhone 微信里有色带 / 排版乱？**
iOS 微信用 PDFKit 渲染矢量 PDF 有已知 bug。用 **C 方案**（`fix-ios-pdf.py`）栅格化即可。

**Q: 中文字体会不会缺字？**
不会。通过 Google Fonts 加载 Noto Serif/Sans SC，覆盖全部常用汉字。离线场景可把字体文件下载到本地替换。

**Q: 能不能用别的 AI agent？**
能。只要 agent 能读 markdown 指令 + 操作文件，就能用。`SKILL.md` 是核心通用文档。

**Q: 一套大概多少页合适？**
路演 8–16 页；教学/知识分享 18–28 页。

---

## 📁 项目结构

```
folded-starry-slide/
├── README.md                 # 你正在看的
├── LICENSE                   # MIT
├── SKILL.md                  # 核心技能文档（CodeBuddy / 通用）
├── CLAUDE.md                 # Claude Code 入口
├── AGENTS.md                 # Codex 入口
├── .gitignore
├── assets/
│   ├── template/
│   │   ├── index.html        # 骨架（含 {{DOCUMENT_TITLE}} 占位符）
│   │   ├── style.css         # 全部样式（颜色 / 动画 / 打印规则）
│   │   └── app.js            # 渲染引擎 + 键盘/触摸导航 + 路由
│   └── slides.sample.js      # 9 类样例幻灯片数组
├── references/
│   ├── slide-types.md        # 12 种幻灯片 JSON schema
│   └── image-layout.md       # 图片排版规则
├── scripts/
│   ├── export-pdf.ps1        # Windows 矢量 PDF 导出
│   ├── export-pdf.sh         # macOS/Linux 矢量 PDF 导出
│   ├── export-img-pdf.cjs    # Playwright 图片版 PDF
│   └── fix-ios-pdf.py        # iOS 微信兼容 + 去色带
└── examples/                 # 示例
```

---

## 🤝 贡献

欢迎提 Issue / PR：
- 新增幻灯片类型
- 新增 agent 入口（如 Cursor rules、Windsurf 规则）
- 优化 PDF 导出兼容性
- 补充更多语言字体方案

---

## 📝 License

[MIT](./LICENSE) © 2026 周增现 (Zhou Zengxian)

<div align="center">

*如果这个技能帮到了你，欢迎点个 ⭐ 让更多人看到。*

**折叠星空，让每一次路演都像宇宙级别的浪漫。** ✦

</div>
