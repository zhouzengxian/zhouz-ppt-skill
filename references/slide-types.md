# Slide 类型数据规范

`slides.js` 中 `const SLIDES=[...]` 数组每个元素描述一页幻灯片。所有类型共享以下通用字段：

| 字段 | 类型 | 说明 |
|---|---|---|
| `type` | string | **必填**，slide 类型名 |
| `title` | string | 主标题（除 cover/chapter/qa 外必填） |
| `sub` | string | 副标题（可选） |
| `tag` | `{l,c}` | 右上角标签，`l`=文字 `c`=颜色（如 `'var(--gold)'`） |
| `center` | boolean | 内容是否垂直居中（适合卡片页） |
| `quote` | string | 底部金句（可选，加上下边框发光线） |

---

## 1. cover · 封面

```js
{type:'cover',data:{
  badge:'活动标识 · 2026',
  logo:'BRAND NAME',
  h1:'EnglishName',          // 大标题（渐变填充）
  cn:'中  文  名',            // 中间金色副标（带间距）
  slogan:'一句话 Slogan',
  desc:'补充说明文字',
  links:[['▶ 立即体验','https://...'],['📦 源码','https://...']]  // 可选，两个按钮
}}
```

## 2. toc · 目录

```js
{type:'toc',tag:{l:'目录',c:'var(--gold)'},title:'目录 · CONTENTS',sub:'共 N 章',
  items:[
    {n:'一',t:'章节标题',p:'P3',c:'var(--cyan)'},
    // n=章节号, t=标题, p=页码, c=色变量
  ],
  note:''                     // 底部说明（可选）
}
```

## 3. chapter · 章节扉页

```js
{type:'chapter',
  chapter:'二',               // 章节号（大字号金色）
  title:'章节标题',
  icon:'🎯',                  // emoji 图标
  color:'var(--red)',         // 章节主色
  sub:'一句话章节说明'
}
```

## 4. cards · 卡片网格（最常用）

```js
{type:'cards',center:true,
  tag:{l:'2.2 解法',c:'var(--gold)'},
  title:'页面标题',
  cols:3,                     // 2/3/4（4 会自动 2×2 网格）
  items:[
    {icon:'🤝',t:'卡片标题',d:'卡片描述（支持 \\n 换行，但建议单行紧凑）',a:'var(--gold)'}
    // a = accent 强调色，决定卡片左侧色条
  ],
  quote:'底部金句'             // 可选
}
```

### cards 配图（扩展字段）

`cards` 可加图片字段配截图，布局规则见 [`image-layout.md`](./image-layout.md)：

```js
{type:'cards',center:true,
  layout:'feature-wide',      // feature-wide/feature-phones/feature-deep
  image:'image/截图.png',       // 单图（或用 images:['a.png','b.png'] 多图）
  imgLeft:true,               // 图在左（默认图在右）
  // ... 其余同标准 cards
}
```

```js
{type:'panels',center:true,
  tag:{l:'2.1 痛点',c:'var(--red)'},
  title:'页面标题',
  cols:3,                     // 2/3/4 列
  panels:[
    {icon:'🤖',title:'面板标题',a:'var(--red)',
     rows:[
       ['键','值描述'],
       ['现状','这是说明文字']
     ]
    }
  ]
}
```

## 6. table · 表格

```js
{type:'table',center:true,
  tag:{l:'4.1 技术栈',c:'var(--blue)'},
  title:'表格标题',
  head:['层','技术','说明'],    // 表头
  rows:[
    ['3D 渲染','Three.js','星体渲染'],
    // 第一列自动白色加粗，第二列自动金色加粗
  ],
  note:'底部说明'              // 可选
}
```

## 7. formula+cards · 公式 + 卡片

```js
{type:'formula+cards',center:true,
  tag:{l:'核心理念',c:'var(--gold)'},
  title:'页面标题',
  formula:'决策 = 多人格 × 时间维度 × 知识沉淀',   // 居中金色边框公式
  cols:3,
  items:[                      // 同 cards 的 items
    {icon:'🤝',t:'标题',d:'描述',a:'var(--gold)'}
  ]
}
```

## 8. panel+stats · 面板 + 统计

```js
{type:'panel+stats',center:true,
  tag:{l:'3.6 数据',c:'var(--cyan)'},
  title:'页面标题',
  left:{                       // 左侧面板（列表行）
    icon:'🌌',title:'左侧标题',
    rows:[['核心','说明'],['光环','说明']]
  },
  right:{                      // 右侧面板（统计数据）
    icon:'⭐',title:'关键参数',
    stats:[
      ['13','星系','补充说明'],
      // 第一个金色大数字，第二个青色标签，第三个灰色描述
    ]
  }
}
```

## 9. versions · 版本里程碑

```js
{type:'versions',center:true,
  tag:{l:'V1 → V4',c:'var(--green)'},
  title:'版本里程碑',
  versions:[
    {v:'V1.0',t:'版本主题',d:'补充说明'},
    {v:'V2.0',t:'版本主题',d:''}
  ],
  check:{                      // 右侧统计面板
    icon:'✅',title:'功能覆盖',
    items:[
      ['14','大功能模块已实现'],
      // 第一个金色大数字，第二个灰色说明
    ]
  }
}
```

## 10. pitch · 金句定位页

```js
{type:'pitch',
  tag:{l:'定位语',c:'var(--cyan)'},
  title:'页面标题',
  main:'核心金句（大字号金色，居中显示）',
  sub:'补充说明（较小灰色字）',
  keywords:[                   // 底部关键词胶囊
    ['🤝','多人格','var(--gold)'],
    ['⏳','时间维度','var(--cyan)']
    // [icon, 文字, 颜色变量]
  ]
}
```

## 11. qa · Q&A 收束页

```js
{type:'qa',data:{
  ty:'谢谢观看 · 期待反馈',
  url:'▶  your-domain.com',
  params:'技术参数 · 关键数字',
  stack:'源码地址 · 技术栈说明',
  foot:'品牌名 · 作者 · 活动'
}}
```

---

## 配色选择建议

| 内容主题 | accent 色 | CSS 变量 |
|---|---|---|
| 痛点 / 问题 / 风险 | 红 | `var(--red)` |
| 方案 / 核心价值 / 强调 | 金 | `var(--gold)` |
| 技术 / 数据 / 信息 | 青 / 蓝 | `var(--cyan)` / `var(--blue)` |
| 创意 / 未来 / 愿景 | 紫 | `var(--purple)` |
| 成功 / 完成 / 增长 | 绿 | `var(--green)` |

## 内容长度限制（避免 PDF 溢出）

- `cards` 单页 ≤ 6 张，每张描述 ≤ 3 行
- `panels` 单页 ≤ 4 个，每个 rows ≤ 6 条
- `table` 单页 ≤ 8 行
- 避免描述里用多个 `\n`（建议用 `→` 或空格串联）
- 整页 slide 总高度不超过 7.5in（PDF 会按此分页）
