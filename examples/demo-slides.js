// 示例 slides 数据 - 5 页精简版，展示主要 slide 类型用法
// 实际使用时按用户的 md 文档生成完整内容
const SLIDES=[
// P1 封面
{type:'cover',data:{
  badge:'示例活动 · 2026',
  logo:'YOUR_BRAND',
  h1:'DemoDeck',
  cn:'示  例  演  示',
  slogan:'一套精致的折叠星空风格幻灯片模板',
  desc:'深空美学 · 玻璃卡片 · 金青配色 · 一键导出 PDF',
  links:[['▶ 在线演示','https://example.com'],['📦 源码','https://github.com']]
}},

// P2 章节扉页
{type:'chapter',chapter:'一',title:'核心特性',icon:'🎯',color:'var(--gold)',sub:'4 种 slide 类型速览'},

// P3 卡片网格
{type:'cards',center:true,tag:{l:'特性',c:'var(--cyan)'},title:'三大量化优势',cols:3,items:[
  {icon:'🎨',t:'折叠星空美学',d:'深空黑底 + 金色强调 + 青色主题，玻璃质感卡片配左侧发光色条。',a:'var(--gold)'},
  {icon:'📱',t:'全响应式',d:'clamp() 字号 + vw 单位，投影/笔记本/PDF 三端一致。',a:'var(--cyan)'},
  {icon:'📄',t:'矢量 PDF',d:'Edge headless 打印，字体嵌入、分页正确，放大不糊。',a:'var(--purple)'},
]},

// P4 列表面板
{type:'panels',center:true,tag:{l:'工作流',c:'var(--gold)'},title:'md → html → pdf 三步',cols:3,panels:[
  {icon:'📝',title:'① 解析 Markdown',a:'var(--gold)',rows:[['输入','.md 文档'],['映射','10 种 slide 类型'],['产出','slides.js 数据']]},
  {icon:'🖥️',title:'② 渲染 HTML',a:'var(--cyan)',rows:[['模板','index.html + style.css + app.js'],['预览','python -m http.server'],['校验','翻页检查每页效果']]},
  {icon:'📄',title:'③ 导出 PDF',a:'var(--purple)',rows:[['工具','Edge / Chrome headless'],['尺寸','13.333in × 7.5in（16:9）'],['字体','Google Fonts 嵌入']]}
]},

// P5 Q&A 收束
{type:'qa',data:{
  ty:'谢谢观看',
  url:'▶  your-domain.com',
  params:'技术参数 · 字体嵌入 · 分页正确 · 矢量输出',
  stack:'模板 · React-free · 纯 HTML/CSS/JS',
  foot:'YOUR_BRAND · 作者 · 活动 2026'
}},
];
