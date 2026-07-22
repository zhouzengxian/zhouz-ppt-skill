// ====== 星空背景 ======
const cv=document.getElementById('stars'),cx=cv.getContext('2d');
let ST=[];
function resize(){cv.width=innerWidth;cv.height=innerHeight;}
function initStars(){ST=[];const n=Math.floor(innerWidth*innerHeight/4000);for(let i=0;i<n;i++)ST.push({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.6+.15,s:Math.random()*.25+.04,t:Math.random()*6.28,g:Math.random()<.1,b:Math.random()<.15});}
let ft=0;
function loop(){ft+=.01;cx.clearRect(0,0,cv.width,cv.height);for(const s of ST){s.y+=s.s;if(s.y>cv.height){s.y=0;s.x=Math.random()*cv.width;}const tw=.6+.4*Math.sin(ft*2+s.t);cx.beginPath();cx.arc(s.x,s.y,s.r,0,6.28);if(s.b){cx.fillStyle=`rgba(88,166,255,${tw*.6})`;cx.shadowColor='#58A6FF';cx.shadowBlur=6;}else if(s.g){cx.fillStyle=`rgba(255,215,0,${tw*.95})`;cx.shadowColor='#FFD700';cx.shadowBlur=10;}else{cx.fillStyle=`rgba(200,210,240,${tw*.65})`;cx.shadowBlur=0;}cx.fill();}cx.shadowBlur=0;requestAnimationFrame(loop);}
addEventListener('resize',()=>{resize();initStars();});resize();initStars();loop();

// ====== 全局配置（按需修改品牌名与页脚链接）======
const CONFIG={
  brand:'YOUR_BRAND',              // 左上角品牌名（如 'FoldNeb'）
  site:'your-domain.com/path'      // 右下角网址（如 'zhouzengxian.github.io/foldneb'）
};

// ====== 渲染 ======
const deck=document.getElementById('deck'),progress=document.getElementById('progress'),counter=document.getElementById('counter');
const TOTAL=SLIDES.length;
let cur=0;
const cardHTML=it=>`<div class="card" style="--accent:${it.a||'var(--cyan)'}"><span class="icon">${it.icon}</span><div class="ct">${it.t}</div><div class="cd">${it.d}</div></div>`;
const brand=()=>`<div class="brand"><span class="dot"></span>${CONFIG.brand}</div>`;
const footer=no=>`<div class="footer"><span>${CONFIG.brand} · ${no} / ${TOTAL}</span><span>${CONFIG.site}</span></div>`;
const tagHTML=tg=>tg?`<div class="tag" style="color:${tg.c};border-color:${tg.c}">${tg.l}</div>`:'';
const titleHTML=s=>`<div class="title-wrap"><div class="page-title">${s.title}</div>${s.sub?`<div class="page-sub">${s.sub}</div>`:''}</div>`;
const headHTML=(s,no)=>`${brand()}${tagHTML(s.tag)}${s.title!==undefined?titleHTML(s):''}`;
const gridClass=n=>n===2?'grid-2':n===4?'grid-4':'grid-3';

function renderSlide(s,no){
  let body='';
  if(s.type==='cover'){
    const d=s.data;
    body=`<div class="cover"><span class="badge">${d.badge}</span><div class="logo"><span class="dot" style="width:10px;height:10px;border-radius:50%;background:var(--gold);box-shadow:0 0 10px var(--gold)"></span>${d.logo}</div><h1>${d.h1}</h1><div class="cn">${d.cn}</div><div class="line"></div><div class="slogan">${d.slogan}</div><div class="desc">${d.desc}</div>${d.links?`<div class="cover-links"><a class="primary" href="${d.links[0][1]}" target="_blank">▶ ${d.links[0][0]}</a><a href="${d.links[1][1]}" target="_blank">📦 ${d.links[1][0]}</a></div>`:''}</div>`;
  } else if(s.type==='cards'){
    body=`<div class="grid ${gridClass(s.cols)}">${s.items.map(cardHTML).join('')}</div>${s.quote?`<div class="quote">${s.quote}</div>`:''}`;
  } else if(s.type==='formula+cards'){
    body=`<div class="formula">${s.formula}</div><div class="grid ${gridClass(s.cols)}">${s.items.map(cardHTML).join('')}</div>`;
  } else if(s.type==='table'){
    body=`<table class="tbl"><thead><tr>${s.head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===1?'g':i===0?'c':''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>${s.note?`<div class="quote">${s.note}</div>`:''}`;
  } else if(s.type==='panels'){
    const col=s.cols||2;
    body=`<div style="display:grid;grid-template-columns:repeat(${col},1fr);gap:2.5%;margin-top:2.8%">${s.panels.map(p=>`<div class="panel"><div class="ph"><span class="pi">${p.icon}</span>${p.title}</div>${p.rows.map(r=>`<div class="list-row" style="--accent:${p.a||'var(--gold)'}"><div class="bar"></div><div class="lk" style="color:${p.a||'var(--gold)'}">${r[0]}</div><div class="lv">${r[1]}</div></div>`).join('')}</div>`).join('')}</div>`;
  } else if(s.type==='panel+stats'){
    body=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:2.5%;margin-top:2.8%;height:72%"><div class="panel"><div class="ph"><span class="pi">${s.left.icon}</span>${s.left.title}</div>${s.left.rows.map(r=>`<div class="list-row"><div class="bar"></div><div class="lk">${r[0]}</div><div class="lv">${r[1]}</div></div>`).join('')}</div><div class="panel"><div class="ph"><span class="pi">${s.right.icon}</span>${s.right.title}</div>${s.right.stats.map(st=>`<div style="display:flex;align-items:center;gap:5%;margin-top:2.5%"><div class="stat" style="min-width:28%;padding:5% 4%"><div class="sv">${st[0]}</div><div class="sl">${st[1]}</div></div><div class="lv" style="font-size:clamp(8px,.82vw,10px);color:var(--gray);line-height:1.35">${st[2]}</div></div>`).join('')}</div></div>`;
  } else if(s.type==='versions'){
    body=`<div style="display:grid;grid-template-columns:1.6fr 1fr;gap:2.5%;margin-top:2.8%"><div>${s.versions.map(v=>`<div class="ver"><div class="vn">${v.v}</div><div><div class="vt">${v.t}</div><div class="vd">${v.d}</div></div></div>`).join('')}</div><div class="panel"><div class="ph"><span class="pi">${s.check.icon}</span>${s.check.title}</div>${s.check.items.map(it=>`<div style="display:flex;align-items:center;gap:8%;margin-top:3.5%"><div class="stat" style="min-width:28%;padding:4% 6%"><div class="sv">${it[0]}</div></div><div class="lv" style="font-size:clamp(8px,.85vw,10px);color:var(--gray);line-height:1.3">${it[1]}</div></div>`).join('')}</div></div>`;
  } else if(s.type==='chapter'){
    body=`<div class="chapter"><div class="chapter-icon">${s.icon}</div><div class="chapter-num" style="--wc:${s.color}">${s.chapter}</div><div class="chapter-title">${s.title}</div>${s.sub?`<div class="chapter-sub">${s.sub}</div>`:''}<div class="chapter-deco" style="--wc:${s.color}"></div></div>`;
  } else if(s.type==='pitch'){
    body=`<div class="pitch"><div class="pitch-main">${s.main}</div>${s.sub?`<div class="pitch-sub">${s.sub}</div>`:''}${s.keywords?`<div class="pitch-kw">${s.keywords.map(k=>`<div class="pitch-kw-item" style="--tc:${k[2]}"><span>${k[0]}</span>${k[1]}</div>`).join('')}</div>`:''}</div>`;
  } else if(s.type==='toc'){
    body=`<div class="toc-grid">${s.items.map(it=>`<div class="toc-item" style="--tc:${it.c||'var(--gold)'}"><div class="toc-n">${it.n}</div><div class="toc-tt">${it.t}</div><div class="toc-pp">${it.p}</div></div>`).join('')}</div>${s.note?`<div class="quote">${s.note}</div>`:''}`;
  } else if(s.type==='qa'){
    const d=s.data;
    body=`<div class="qa"><h1>Q & A</h1><div class="ln"></div><div class="ty">${d.ty}</div><div class="url">${d.url}</div><div style="margin-top:4%;font-size:clamp(10px,1vw,13px);color:var(--gray);text-align:center">${d.params}<br>${d.stack}</div><div style="margin-top:3%;font-size:clamp(9px,.9vw,12px);color:var(--lgray)">${d.foot}</div></div>`;
  }
  const head=s.type==='chapter'?brand():s.type==='pitch'?`${brand()}${tagHTML(s.tag)}<div class="title-wrap"><div class="page-title">${s.title}</div></div>`:headHTML(s,no);
  return `<div class="slide-inner">${head}${s.center?`<div class="body-center">`:''}${body}${s.center?`</div>`:''}${s.type!=='cover'&&s.type!=='qa'?footer(no):''}</div>`;
}

// 构建
SLIDES.forEach((s,i)=>{const el=document.createElement('div');el.className='slide';el.innerHTML=renderSlide(s,i+1);deck.appendChild(el);});
const els=[...deck.children];

function show(n){
  if(n<0||n>=TOTAL)return;
  els.forEach((el,i)=>{el.classList.remove('active','prev');if(i===n)el.classList.add('active');else if(i<n)el.classList.add('prev');});
  cur=n;counter.textContent=`${n+1} / ${TOTAL}`;
  progress.style.width=`${(n+1)/TOTAL*100}%`;
}
function next(){show(cur+1);}
function prev(){show(cur-1);}

document.getElementById('next').onclick=next;
document.getElementById('prev').onclick=prev;
addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();next();}
  else if(e.key==='ArrowLeft'){e.preventDefault();prev();}
  else if(e.key==='Home')show(0);
  else if(e.key==='End')show(TOTAL-1);
  else if(e.key==='f'||e.key==='F'){if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen();}
});
// 滚轮翻页（节流）
let wheelLock=0;
addEventListener('wheel',e=>{const now=Date.now();if(now-wheelLock<600)return;if(Math.abs(e.deltaY)<30&&Math.abs(e.deltaX)<30)return;wheelLock=now;if(e.deltaY>0||e.deltaX>0)next();else prev();},{passive:true});
// 点击左右半屏
addEventListener('click',e=>{
  if(e.target.closest('#nav')||e.target.closest('.card')||e.target.closest('a'))return;
  const x=e.clientX/innerWidth;
  if(x<.3)prev();else if(x>.7)next();
});

show(0);
