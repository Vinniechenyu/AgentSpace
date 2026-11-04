
// ---- Workflow 编辑器：横向流程画布（点阵底 · 卡片节点 · 端口连线 · 回环虚线），节点库卡片等大，
// 拖拽用指针事件实现真实拖动（跟手的浮动卡片 + 插入位指示 + 源节点半透明），两侧面板可拖拽调宽。
function wfPaletteList(){return [['输入','file','工作流入口与初始上下文'],['Agent','agent','按指引自主完成一段工作'],['Skill','spark','调用已安装的技能方法'],['MCP 工具','mcp','读取外部系统的数据'],['CLI 工具','terminal','执行命令行与构建工具'],['条件','condition','按结果分支或回环'],['人工确认','approve','暂停，等待人确认后继续'],['输出','bench','汇总并交付结果']];}
function wfTone(type){return {'输入':'blue','Agent':'violet','Skill':'amber','MCP 工具':'teal','CLI 工具':'slate','条件':'orange','人工确认':'green','输出':'blue','触发':'blue'}[type]||'slate';}
function wfNodeFacts(n){
  const hint=String(n.hint||'待配置').trim(),parts=hint.split(/\s*[·・]\s*/).filter(Boolean),ver=parts.find(p=>/^v\d/i.test(p)),rest=parts.filter(p=>p!==ver);
  if(hint==='待配置')return `<span class="wfn-key"><b class="wfn-key-todo">${ico('info')}待配置</b></span>`;
  const icon=n.type==='人工确认'?ico('personal'):'';
  return `<span class="wfn-key"><b>${icon}${esc(rest[0]||hint)}</b>${ver?`<em>${esc(ver)}</em>`:''}${rest.length>1?`<span>${esc(rest.slice(1).join(' · '))}</span>`:''}</span>`;
}
function wfNodeCard(n,i){
  const icon=NODE_ICON[n.type]||n.icon||'workflow',strip=x=>String(x||'').replace(/^\{\{|\}\}$/g,'');
  return `<div class="wfn-wrap" data-wfn="${i}"><button class="wfn ${s.selectedNode===i?'selected':''}" data-a="node-select" data-v="${i}" data-node-type="${esc(n.type)}" data-tone="${wfTone(n.type)}"><i class="wfn-port wfn-port--in"></i><i class="wfn-port wfn-port--out"></i>
    <span class="wfn-head"><span class="wfn-tile">${ico(icon)}</span><span class="wfn-title"><b>${esc(n.label)}</b><span class="wfn-chip">${ico(icon)}${esc(n.type)}</span></span><span class="wfn-grip" aria-hidden="true">${ico('menu')}</span></span>
    ${wfNodeFacts(n)}
    <span class="wfn-io"><span><i>输入</i>${esc(strip(n.input||'{{previous.output}}'))}</span><span><i>输出</i>${esc(n.output||'result')}</span></span></button></div>`;
}
function wfCanvasHtml(){
  const nodes=s.nodes.map((n,i)=>wfNodeCard(n,i)+(i<s.nodes.length-1?'<div class="wfn-link"><i></i></div>':'')).join('');
  return `<div class="wfstage" id="wfStage"><div class="wfflow" id="wfFlow"><svg class="wfloops" id="wfLoops" aria-hidden="true"></svg>${nodes}<div class="wfn-link wfn-link--end"><i></i></div><button class="wfn-add" data-a="add-node" aria-label="添加节点">${ico('plus')}<span>添加节点</span></button></div></div>
  <div class="wfctl" role="toolbar" aria-label="画布控制"><button data-a="wf-zoom" data-v="out" aria-label="缩小" title="缩小">${ico('zoomOut')}</button><button class="wfctl-pct" data-a="wf-zoom" data-v="reset" id="wfPct" aria-label="重置为 100%" title="重置为 100%">100%</button><button data-a="wf-zoom" data-v="in" aria-label="放大" title="放大">${ico('zoomIn')}</button><i></i><button class="wfctl-fit" data-a="wf-zoom" data-v="fit" aria-label="适应画布" title="适应画布，显示全部节点">${ico('fit')}<span>适应画布</span></button></div>
  <div class="wfhint">${s.nodes.length} 个节点 · 拖动空白处平移 · ⌘ / Ctrl + 滚轮缩放</div>`;
}
function wfPaletteHtml(){
  return `<div class="wfp-head"><b>节点库</b><small>拖入画布，或点击添加</small></div><div class="wfp-grid">${wfPaletteList().map(([l,i,d])=>`<button class="wfp-card" data-palette="${l}" data-a="palette-add" data-v="${l}" data-tone="${wfTone(l)}"><span class="wfp-tile">${ico(i)}</span><b>${l}</b><small>${d}</small></button>`).join('')}</div>`;
}
// 回环：从最后一个「人工确认 / 条件」节点绕回第一个节点（虚线 + 标签）。
function wfDrawLoops(){
  const flow=document.getElementById('wfFlow'),svg=document.getElementById('wfLoops');if(!flow||!svg)return;
  flow.querySelectorAll('.wfloop-label').forEach(x=>x.remove());svg.innerHTML='';
  const wraps=[...flow.querySelectorAll('.wfn-wrap')];if(wraps.length<3)return;
  const loopIdx=[...s.nodes.keys()].reverse().find(i=>['人工确认','条件'].includes(s.nodes[i].type)&&i>0);if(loopIdx==null)return;
  const A=wraps[loopIdx],B=wraps[0],x1=A.offsetLeft+A.offsetWidth/2,x2=B.offsetLeft+B.offsetWidth/2,y0=A.offsetTop-2,y=A.offsetTop-52,r=14;
  svg.setAttribute('width',flow.offsetWidth);svg.setAttribute('height',flow.offsetHeight);
  svg.innerHTML=`<path d="M${x1} ${y0} V${y+r} Q${x1} ${y} ${x1-r} ${y} H${x2+r} Q${x2} ${y} ${x2} ${y+r} V${y0}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 5"/><path d="M${x2-4} ${y0-7} L${x2} ${y0} L${x2+4} ${y0-7}" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
  const label=document.createElement('span');label.className='wfloop-label';label.textContent='回环';label.style.left=((x1+x2)/2)+'px';label.style.top=y+'px';flow.appendChild(label);
}
// ---------- 画布视图：缩放 / 平移 / 适应画布 ----------
const wfView={k:1,x:24,y:0,user:false,sig:null};
function wfClampK(k){return Math.max(.1,Math.min(1.6,k));}
function wfApplyView(){
  const st=document.getElementById('wfStage');if(!st)return;
  st.style.transform=`translate(${Math.round(wfView.x)}px,${Math.round(wfView.y)}px) scale(${wfView.k})`;
  const pct=document.getElementById('wfPct');if(pct)pct.textContent=Math.round(wfView.k*100)+'%';
}
function wfBox(){const c=document.getElementById('wfCanvas'),st=document.getElementById('wfStage');return c&&st?{cw:c.clientWidth,ch:c.clientHeight,w:st.offsetWidth,h:st.offsetHeight}:null;}
function wfFit(user){const b=wfBox();if(!b)return;const k=wfClampK(Math.min(b.cw/b.w,b.ch/b.h)*.94);wfView.k=Math.min(k,1.2);wfView.x=(b.cw-b.w*wfView.k)/2;wfView.y=(b.ch-b.h*wfView.k)/2;wfView.user=!!user;wfApplyView();}
function wfStartView(){const b=wfBox();if(!b)return;wfView.k=Math.min(1,Math.max(.6,b.ch/(b.h+40)));wfView.x=16;wfView.y=Math.max(0,(b.ch-b.h*wfView.k)/2);wfView.user=false;wfApplyView();}
function wfZoomAt(factor,cx,cy){const b=wfBox();if(!b)return;const k=wfClampK(wfView.k*factor);if(k===wfView.k)return;cx=cx??b.cw/2;cy=cy??b.ch/2;wfView.x=cx-(cx-wfView.x)*k/wfView.k;wfView.y=cy-(cy-wfView.y)*k/wfView.k;wfView.k=k;wfView.user=true;wfApplyView();}
function wfEditorAction(a,v){
  if(a==='wf-zoom'){if(v==='in')wfZoomAt(1.2);else if(v==='out')wfZoomAt(1/1.2);else if(v==='fit')wfFit(true);else if(v==='reset'){const b=wfBox();wfView.k=1;wfView.x=16;wfView.y=Math.max(0,(b.ch-b.h)/2);wfView.user=true;wfApplyView();}return true;}
  if(a==='wfh-more'){wfHeaderMenu();return true;}
  return false;
}
function wfHeaderMenu(){
  const open=document.querySelector('.as2-menu[data-for="wfh"]');closeExtMenu();if(open)return;
  const btn=document.querySelector('[data-a="wfh-more"]');if(!btn)return;const r=btn.getBoundingClientRect();
  const item=(a,v,icon,label)=>`<button role="menuitem" data-a="${a}" data-v="${v}">${ico(icon)}<span>${label}</span></button>`;
  document.body.insertAdjacentHTML('beforeend',`<div class="as2-menu" role="menu" data-for="wfh">${item('workflow-import','','file','导入已有 Workflow')}${item('wf-binding','','link','预览绑定')}${item('dependencies','','info','查看依赖')}</div>`);
  const m=document.querySelector('.as2-menu[data-for="wfh"]');m.style.left=Math.round(Math.max(8,r.right-m.offsetWidth))+'px';m.style.top=Math.round(r.bottom+6)+'px';
}
function wfHeaderHtml(){
  const st=s.wfTested&&!s.wfDirty?['ok','已调试通过']:s.wfDirty?['warn','草稿有变更']:s.wfSaved?['ok','草稿已保存']:s.wfVersion>0?['muted','已发布 v'+s.wfVersion]:['muted','草稿 · 未发布'];
  const sw=recentWorkflowSelect().replace('class="build-context">最近流程','class="wfh-switch">').replace('</select></label>','</select>'+ico('down')+'</label>');
  return `<div class="wfedithead wfh">${sw}<span class="wfh-status" data-state="${st[0]}">${st[1]}</span><span class="spacer"></span>
    <label class="wfh-scope" title="Workflow 使用范围">${ico('project')}<select aria-label="Workflow 使用范围" onchange="setBuildScope(this.value)"><option value="global" ${s.buildScope==='global'?'selected':''}>全局</option>${projectNames.map(p=>`<option ${s.buildScope===p?'selected':''}>${esc(p)}</option>`).join('')}</select>${ico('down')}</label>
    <span class="wfh-actions">${btn('保存草稿','wf-save','','sm')}${btn('调试','wf-test','','sm')}${btn('发布新版本','wf-publish','','primary sm')}<button class="wfh-more" data-a="wfh-more" aria-haspopup="menu" aria-label="更多操作" title="导入 · 预览绑定 · 依赖">${ico('more')}</button></span></div>`;
}
// ---------- 真实拖动（节点库 → 画布；画布内节点排序） ----------
const wfDrag={on:false,type:null,index:null,ghost:null,sx:0,sy:0,moved:false,insert:null,marker:null};
function wfInsertIndex(x){
  const wraps=[...document.querySelectorAll('#wfFlow .wfn-wrap')];if(!wraps.length)return 0;
  for(let i=0;i<wraps.length;i++){const r=wraps[i].getBoundingClientRect();if(x<r.left+r.width/2)return i;}
  return wraps.length;
}
function wfShowMarker(idx){
  const flow=document.getElementById('wfFlow');if(!flow)return;
  if(!wfDrag.marker){wfDrag.marker=document.createElement('div');wfDrag.marker.className='wfn-drop';flow.appendChild(wfDrag.marker);}
  const wraps=[...flow.querySelectorAll('.wfn-wrap')];let x,ref;
  if(!wraps.length){x=24;ref=null;}else if(idx>=wraps.length){ref=wraps[wraps.length-1];x=ref.offsetLeft+ref.offsetWidth+20;}else{ref=wraps[idx];x=ref.offsetLeft-22;}
  wfDrag.marker.style.left=x+'px';wfDrag.marker.style.top=(ref?ref.offsetTop:100)+'px';wfDrag.marker.style.height=(ref?ref.offsetHeight:124)+'px';
  wfDrag.insert=idx;
}
function wfStartDrag(e,type,index){
  const src=type!=null?e.target.closest('.wfp-card'):e.target.closest('.wfn-wrap');if(!src)return;
  Object.assign(wfDrag,{on:true,type,index,sx:e.clientX,sy:e.clientY,moved:false,insert:null,src});
  const g=src.cloneNode(true);g.classList.add('wf-ghost',type!=null?'wf-ghost--card':'wf-ghost--node');g.style.width=(type!=null?src.getBoundingClientRect().width:src.offsetWidth)+'px';wfDrag.k=type!=null?1:wfView.k;
  g.querySelectorAll('[data-a]').forEach(x=>x.removeAttribute('data-a'));
  const r=src.getBoundingClientRect();wfDrag.dx=e.clientX-r.left;wfDrag.dy=e.clientY-r.top;wfDrag.ghost=g;
}
function wfMoveDrag(e){
  if(!wfDrag.on)return;
  if(!wfDrag.moved){if(Math.hypot(e.clientX-wfDrag.sx,e.clientY-wfDrag.sy)<5)return;wfDrag.moved=true;document.body.appendChild(wfDrag.ghost);document.body.classList.add('wf-dragging');wfDrag.src.classList.add('wf-src');}
  wfDrag.ghost.style.transformOrigin='0 0';wfDrag.ghost.style.transform=`translate(${e.clientX-wfDrag.dx}px,${e.clientY-wfDrag.dy}px) rotate(2deg) scale(${wfDrag.k||1})`;
  const canvas=document.getElementById('wfCanvas');if(!canvas)return;const cr=canvas.getBoundingClientRect();
  const over=e.clientX>=cr.left&&e.clientX<=cr.right&&e.clientY>=cr.top&&e.clientY<=cr.bottom;
  canvas.classList.toggle('wf-over',over);
  if(over){wfShowMarker(wfInsertIndex(e.clientX));const edge=60;if(e.clientX>cr.right-edge){wfView.x-=14;wfView.user=true;wfApplyView();}else if(e.clientX<cr.left+edge){wfView.x+=14;wfView.user=true;wfApplyView();}}
  else{wfDrag.marker?.remove();wfDrag.marker=null;wfDrag.insert=null;}
}
function wfEndDrag(e){
  if(!wfDrag.on)return;
  const {moved,type,index,insert}=wfDrag;
  wfDrag.ghost?.remove();wfDrag.marker?.remove();wfDrag.src?.classList.remove('wf-src');document.body.classList.remove('wf-dragging');document.getElementById('wfCanvas')?.classList.remove('wf-over');
  const hadInsert=moved&&insert!=null;Object.assign(wfDrag,{on:false,ghost:null,marker:null,src:null,insert:null});
  if(moved){window.__wfSuppressClick=true;setTimeout(()=>{window.__wfSuppressClick=false;},60);}
  if(!hadInsert)return;
  if(type!=null){addNode(type);const n=s.nodes.pop();s.nodes.splice(insert,0,n);s.selectedNode=insert;render();notify('已添加「'+n.type+'」节点。');}
  else if(index!=null){let dest=insert>index?insert-1:insert;if(dest!==index){const node=s.nodes.splice(index,1)[0];s.nodes.splice(dest,0,node);s.selectedNode=dest;s.wfDirty=true;s.wfTested=false;render();notify('节点顺序已更新。');}}
}
document.addEventListener('pointerdown',e=>{
  if(e.button!==0||!e.target.closest)return;
  const card=e.target.closest('#demo .wfp-card'),node=e.target.closest('#demo .wfn-wrap');
  if(card)wfStartDrag(e,card.dataset.palette,null);else if(node&&!e.target.closest('.wfn-add'))wfStartDrag(e,null,Number(node.dataset.wfn));
});
document.addEventListener('pointermove',wfMoveDrag);
document.addEventListener('pointerup',wfEndDrag);
document.addEventListener('pointercancel',wfEndDrag);
document.addEventListener('click',e=>{if(window.__wfSuppressClick&&e.target.closest('#demo .wfp-card, #demo .wfn-wrap')){e.stopPropagation();e.preventDefault();}},true);
// ---------- 两侧面板可拖拽调宽 ----------
function wfPanelWidths(){try{return JSON.parse(localStorage.getItem('as2-wf-panels')||'{}');}catch(e){return {};}}
function wfApplyPanels(){const w=wfPanelWidths(),b=document.querySelector('#demo .wfeditbody');if(!b)return;b.style.setProperty('--wf-left',Math.min(w.left||260,wfPanelLimit('left',b))+'px');b.style.setProperty('--wf-right',Math.min(w.right||300,wfPanelLimit('right',b))+'px');}
function wfDecorate(){
  const body=document.querySelector('#demo .wfeditbody');if(!body)return;
  wfApplyPanels();
  if(!body.querySelector(':scope > .wf-resizer--left')){
    body.insertAdjacentHTML('beforeend','<div class="as2-resizer wf-resizer wf-resizer--left" role="separator" aria-orientation="vertical" aria-label="调整节点库宽度" title="拖动调整宽度 · 双击恢复" tabindex="0"></div><div class="as2-resizer wf-resizer wf-resizer--right" role="separator" aria-orientation="vertical" aria-label="调整配置面板宽度" title="拖动调整宽度 · 双击恢复" tabindex="0"></div>');
  }
  const sig=String(s.currentWorkflowId||s.wfLabel);
  if(wfView.sig!==sig){wfView.sig=sig;wfStartView();}else wfApplyView();
  wfDrawLoops();
  const cv=document.getElementById('wfCanvas');
  if(cv&&!cv._viewBound){cv._viewBound=true;
    cv.addEventListener('wheel',e=>{e.preventDefault();if(e.ctrlKey||e.metaKey){const r=cv.getBoundingClientRect();wfZoomAt(Math.exp(-e.deltaY*.0025),e.clientX-r.left,e.clientY-r.top);}else{wfView.x-=e.deltaX;wfView.y-=e.deltaY;wfView.user=true;wfApplyView();}},{passive:false});
    cv.addEventListener('dblclick',e=>{if(e.target===cv||e.target.id==='wfStage'||e.target.id==='wfFlow')wfFit(true);});
  }
}
const wfObs=new MutationObserver(()=>{if(document.querySelector('#demo .wfeditbody')){wfDecorate();wfObs.takeRecords();}});
wfObs.observe(document.getElementById('demo'),{childList:true,subtree:true});
// 面板调宽：rAF 节流、指针捕获；左 220–360、右 280–460，且保证画布至少 380px。
const WF_PANEL={left:{min:220,max:360,def:260},right:{min:280,max:460,def:300}};
function wfPanelLimit(side,body){const w=wfPanelWidths(),other=w[side==='left'?'right':'left']||WF_PANEL[side==='left'?'right':'left'].def,room=body.clientWidth-other-380;return Math.max(WF_PANEL[side].min,Math.min(WF_PANEL[side].max,room));}
document.addEventListener('pointerdown',e=>{
  const h=e.target.closest?.('.wf-resizer');if(!h)return;
  e.preventDefault();const side=h.classList.contains('wf-resizer--left')?'left':'right',body=document.querySelector('#demo .wfeditbody'),startX=e.clientX,w=wfPanelWidths(),start=w[side]||WF_PANEL[side].def,max=wfPanelLimit(side,body);
  try{h.setPointerCapture(e.pointerId);}catch(er){}
  document.documentElement.dataset.resizing='1';let next=start,raf=0;
  const paint=()=>{raf=0;body.style.setProperty('--wf-'+side,next+'px');};
  const move=ev=>{const dx=ev.clientX-startX;next=Math.round(Math.max(WF_PANEL[side].min,Math.min(max,start+(side==='left'?dx:-dx))));w[side]=next;if(!raf)raf=requestAnimationFrame(paint);};
  const up=()=>{if(raf)cancelAnimationFrame(raf);paint();delete document.documentElement.dataset.resizing;h.removeEventListener('pointermove',move);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',up);h.removeEventListener('lostpointercapture',up);try{localStorage.setItem('as2-wf-panels',JSON.stringify(w));}catch(er){}wfDrawLoops();};
  h.addEventListener('pointermove',move);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',up);h.addEventListener('lostpointercapture',up);
});
document.addEventListener('dblclick',e=>{const h=e.target.closest?.('.wf-resizer');if(!h)return;const w=wfPanelWidths();delete w[h.classList.contains('wf-resizer--left')?'left':'right'];try{localStorage.setItem('as2-wf-panels',JSON.stringify(w));}catch(er){}wfApplyPanels();wfDrawLoops();});

document.addEventListener('pointerdown',e=>{
  if(e.button!==0||!e.target.closest)return;const cv=e.target.closest('#wfCanvas');
  if(!cv||e.target.closest('.wfn-wrap, .wfn-add, .wfctl, .wf-resizer'))return;
  const sx=e.clientX,sy=e.clientY,ox=wfView.x,oy=wfView.y;cv.classList.add('wf-panning');
  const move=ev=>{wfView.x=ox+ev.clientX-sx;wfView.y=oy+ev.clientY-sy;wfView.user=true;wfApplyView();};
  const up=()=>{cv.classList.remove('wf-panning');document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);};
  document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);
});
window.addEventListener('resize',()=>{if(document.getElementById('wfCanvas')&&!wfView.user)wfStartView();});

setTimeout(()=>{if(document.querySelector('#demo .wfeditbody'))wfDecorate();},0);
