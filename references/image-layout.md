# 图片插入与布局最佳实践

当 slide 需要配截图/示意图时（`cards` 类型加 `image` / `images` / `layout` 字段），遵循以下规则。这些是真实项目里反复调试出来的经验，**别绕弯**。

---

## 一、绝不用深色装饰壳包裹图片（血泪教训）

❌ **错误做法**（用户称为"占位符填充效果"）：

```css
/* 把图片塞进一个深色渐变 + 内阴影 + 圆角的"相框壳"里 */
.phone-frame{
  background:linear-gradient(160deg,#1a1a2e,#0d1117);
  border-radius:14px; padding:7px;
  border:1px solid rgba(255,255,255,.08);
  box-shadow:0 0 40px rgba(88,166,255,.12),inset 0 0 20px rgba(0,0,0,.3);
}
.phone-frame img{ width:100%; height:100%; }
```

**为什么错**：深色壳 + `width/height:100%` 会让图片像被"填充"进一个框，显得被挤压、不饱满，视觉上图片变小了。用户第一反应是"去掉这个占位符填充效果"。

✅ **正确做法**（学 guizang）：图片**浮在浅灰底 cell 里、按比例自适应缩进**，没有任何深色装饰壳。

---

## 二、图片容器的黄金法则

```css
/* img-col：浅灰底 cell，flex 居中 + overflow 防溢出 */
.img-col{
  display:flex; align-items:center; justify-content:center;
  overflow:hidden; min-width:0; min-height:0;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.06);
  border-radius:10px;
}
/* img：只设 max-%，让图按比例缩进容器，绝不变形不溢出 */
.img-col img{
  max-width:100%; max-height:100%;
  object-fit:contain; display:block;
}
```

**关键**：img **绝不设 `width:100%` 或 `height:100%`**，只设 `max-width/max-height:100%`。这样图会保持原比例、向容器内"缩进"，而不是被拉伸/裁切填满。

---

## 三、让图片"更饱满"的真正关键：grid 跨行（不是加宽列）

图片 + 文字双列布局时，用户常反馈"图片太小/不够饱满"。**解决办法不是把右列加宽，而是让图片跨多行占满整个高度**。

```css
/* feature-page 用 3 行 grid：标题 / 卡片(1fr) / quote */
.feature-page{
  display:grid;
  grid-template-columns: 1fr 34%;   /* 左文字 右图 */
  grid-template-rows: auto 1fr auto; /* 标题 卡片 quote */
  gap:2vh 3.5%;
}
/* 左列：标题+卡片，占第 1-2 行 */
.wide-left{ grid-column:1; grid-row:1 / 3; display:flex; flex-direction:column; }
/* 右列：图片跨全部 3 行，从标题顶部到 quote 底部 */
.img-col{ grid-column:2; grid-row:1 / 4; }
/* img 填满这个跨行的容器 */
.img-col img{ width:100%; height:100%; object-fit:contain; }
```

**效果**：图片高度 = 标题 + 卡片 + quote 的总高，自然变得饱满，且和左列内容上下对齐。

---

## 四、多图横排（如双手机截图）

外层容器**纯透明无底**（只是个 flex row），每个 img **自带灰底 cell** + `aspect-ratio` 锁形状 + `flex:1` 均分宽度：

```css
.img-col.multi{ flex-direction:row; gap:2%; background:transparent; border:0; border-radius:0; }
.img-col.multi img{
  flex:1; min-width:0;
  aspect-ratio:9/17;            /* 锁竖屏比例 */
  border-radius:10px;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.06);
}
```

---

## 五、layout 字段速查（cards 类型扩展）

在标准 `cards` 上加这些字段即可配图：

| 字段 | 说明 |
|---|---|
| `image` | 单张图（横屏或竖屏截图） |
| `images` | 多张图数组（如 `['a.png','b.png']`，横排均分） |
| `layout:'feature-wide'` | 横屏大图 + 左文字（决策推演/时间折叠） |
| `layout:'feature-phones'` | 多张竖屏手机图 + 左文字（朋友圈） |
| `layout:'feature-deep'` | 3 卡片 + 右竖屏图（知识星图，图跨满高度） |
| `imgLeft:true` | 图在左、文字在右（默认图在右） |

示例：

```js
{type:'cards',center:true,
  layout:'feature-deep',
  image:'image/知识星图.png',
  tag:{l:'更深一层',c:'var(--green)'},
  title:'知识星图：让你的思考变成发光的月球',
  sub:'副标题',
  cols:3,
  items:[
    {icon:'🌍',t:'开垦星球',d:'描述',a:'var(--purple)'},
    {icon:'🤖',t:'AI 产粮',d:'描述',a:'var(--gold)'},
    {icon:'📊',t:'价值雷达',d:'描述',a:'var(--green)'}
  ],
  quote:'底部金句'
}
```

---

## 六、调试清单（图片不满意时按此排查）

| 症状 | 原因 | 解决 |
|---|---|---|
| 图片显得被"填充"、变小 | 用了深色装饰壳 + `width:100%` | 删装饰壳，改浅灰底 cell + `max-%` |
| 图片上下有大片留白 | img-col 只占一行高度 | 用 `grid-row:1/N` 让 img-col 跨多行 |
| 图片变形/被裁切 | 设了 `width:100%;height:100%` 无 contain | 加 `object-fit:contain` |
| 某页标题比别页矮 | 该页 `margin-top` 不一致 | 所有功能页统一 `margin-top:3.5%` |
| 双图宽度不均 | 没设 `flex:1;min-width:0` | 每个 img 加 `flex:1;min-width:0` |
