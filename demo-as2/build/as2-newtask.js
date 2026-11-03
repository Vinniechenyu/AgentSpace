
// ---- 新建临时任务：全局沉浸式页面（不再用弹窗），与「新建工作台」同一版式。
// 输入框只写一段任务描述（首句作为任务名称）；下方托盘选择所属项目 / 责任人 / 执行者 / 知识范围；创建后回到对应看板。
function newTaskDraft(){return s.newTask&&typeof s.newTask==='object'?s.newTask:null;}
function newTaskOpen(){
  const project=creationProject();
  s.newTask={project,owner:'我',executorType:'agent',executor:'CodeAgent',title:'',goal:'',spaceIds:defaultTaskKnowledge(project),personal:isMyBoard(),from:{view:s.view,page:s.page,project:s.project}};
  s.taskDetail=null;closeModal();render();requestAnimationFrame(()=>document.getElementById('newTaskGoal')?.focus());return true;
}
function newTaskStarters(){return [
  ['search','问题排查','任务列表翻页变慢，定位原因并给出修复方案','复现慢查询，定位重复的资源状态请求；给出修复补丁与回归验证结果，保留旧客户端行为。'],
  ['file','需求澄清','整理资源组优先策略的需求与验收条件','汇总线程讨论与 RR 记录，列出目标、约束、待确认问题，产出一份可评审的 Spec 草稿。'],
  ['shield','质量巡检','汇总当前迭代的阻塞项与待确认风险','读取质量平台与回归报告，按严重程度列出阻塞项和责任人，生成验证摘要。']];}
function newTaskSpaces(project){return s.knowledgeSpaces.filter(sp=>project==='个人'?sp.scope==='personal':sp.scope==='project'&&sp.project===project);}
function renderNewTaskPage(){
  const d=newTaskDraft(),wf=d.executorType==='workflow',n=d.spaceIds.length;
  const pill=(key,icon,label)=>`<button class="nt-pill" data-a="nt-pick" data-v="${key}" aria-haspopup="menu">${ico(icon)}<span>${esc(label)}</span>${ico('down')}</button>`;
  return `<div class="wc-start nt-start">
    <header class="wc-start-top"><button data-a="nt-cancel" aria-label="返回">${ico('back')}${d.personal?'我的任务':'任务看板'}</button>${ico('chevron')}<span>新建任务</span><span class="spacer"></span><span class="wc-start-status">临时任务 · 确认后开始执行</span></header>
    <main class="wc-start-main">
      <header class="wc-greeting"><h1>想交给 ${wf?'Workflow':'Agent'} 做什么？</h1></header>
      <div class="wc-composer-wrap">
        <img class="nt-hero" src="${newTaskHero()}" alt="" aria-hidden="true">
        <div class="wc-composer-card nt-card">
          <textarea id="newTaskGoal" rows="3" placeholder="描述要交给 ${wf?'Workflow':'Agent'} 的任务，写清目标、约束和希望收到的结果…" aria-label="任务描述">${esc(d.goal)}</textarea>
          <div class="wc-compose-foot"><button class="wc-plus" data-a="composer-add" aria-haspopup="menu" aria-label="添加附件、知识库、技能或 MCP" title="添加">${ico('plus')}</button><div class="nt-mode" role="tablist" aria-label="执行方式">${[['agent','agent','Agent'],['workflow','workflow','Workflow']].map(([v,icon,label])=>`<button role="tab" aria-selected="${d.executorType===v}" data-a="nt-mode" data-v="${v}" title="${label}" aria-label="${label}">${ico(icon)}${d.executorType===v?`<span>${label}</span>`:''}</button>`).join('')}</div><span class="spacer"></span><button class="wc-send" data-a="nt-create" aria-label="创建任务" title="创建任务">${ico('arrow')}</button></div>
        </div>
        <div class="wc-attachbar nt-tray">
          ${d.personal?pill('project','project',d.project==='个人'?'个人任务':d.project):pill('project','project',d.project)}
          ${pill('owner','personal','责任人 · '+d.owner)}
          ${pill('executor',wf?'workflow':'agent',(wf?'Workflow · ':'')+d.executor)}
          ${pill('knowledge','book',n?n+' 个知识库':'不引用知识库')}
        </div>
      </div>
      <section class="wc-start-prompts">${newTaskStarters().map(([icon,label,title],k)=>`<button class="wc-starter" data-a="nt-starter" data-v="${k}">${ico(icon)}<b>${esc(label)}</b><small>${esc(title)}</small></button>`).join('')}</section>
    </main>
  </div>`;
}
function newTaskMenu(key){
  const d=newTaskDraft(),open=document.querySelector('.as2-menu[data-for="nt"]');closeExtMenu();if(open&&open.dataset.id===key)return;
  const btn=document.querySelector(`.nt-tray [data-v="${key}"]`)||document.querySelector(`[data-a="nt-pick"][data-v="${key}"]`);if(!btn)return;const r=btn.getBoundingClientRect();
  const item=(val,label,on,icon='check')=>`<button role="menuitemradio" aria-checked="${on}" data-a="nt-set" data-v="${esc(key+'|'+val)}">${on?ico(icon):'<i class="nt-menu-gap"></i>'}<span>${esc(label)}</span></button>`;
  let items='';
  if(key==='project')items=(d.personal?['个人',...joinedProjects()]:joinedProjects()).map(p=>item(p,p==='个人'?'个人任务':p,d.project===p)).join('');
  else if(key==='owner')items=[...new Set(['我',...DIRECTORY.filter(p=>p.type==='person').map(p=>p.name)])].map(n=>item(n,n,d.owner===n)).join('');
  else if(key==='executor')items='<div class="as2-menu-label">单 Agent</div>'+['CodeAgent','QA Agent','OfficeACE'].map(n=>item('agent:'+n,n,d.executorType==='agent'&&d.executor===n)).join('')
    +'<div class="as2-menu-sep"></div><div class="as2-menu-label">Workflow</div>'+['SpecX · 需求到交付','质量日报生成','每日合入与检视'].map(n=>item('workflow:'+n,n,d.executorType==='workflow'&&d.executor===n)).join('');
  else if(key==='knowledge'){const sp=newTaskSpaces(d.project);items=sp.length?sp.map(x=>item(x.id,x.name+' · '+x.docs.length+' 份资料',d.spaceIds.includes(x.id))).join(''):'<div class="as2-menu-label">当前范围暂无知识库</div>';}
  document.body.insertAdjacentHTML('beforeend',`<div class="as2-menu nt-menu" role="menu" data-for="nt" data-id="${key}">${items}</div>`);
  const m=document.querySelector('.as2-menu[data-for="nt"]');m.style.left=Math.round(Math.min(r.left,innerWidth-m.offsetWidth-8))+'px';m.style.top=Math.round(r.bottom+m.offsetHeight+8>innerHeight?r.top-m.offsetHeight-4:r.bottom+4)+'px';
}
function newTaskCreate(){
  const d=newTaskDraft(),goal=d.goal.trim(),title=(d.title.trim()||goal.split(/[\n。；;]/)[0]).slice(0,50);
  if(!goal){notify('请先写清楚任务目标与验收。');document.getElementById('newTaskGoal')?.focus();return;}
  const project=d.project,task={id:nextTaskId(),title,scope:project,type:'temp',trigger:'manual',status:'pending',source:'临时任务 / '+(project==='个人'?'我的任务':'项目任务看板'),owner:d.owner,triggeredBy:'我',rev:1,run:0,kind:'board',goal,executor:d.executor,spaceIds:[...d.spaceIds],knowledgeSnapshot:contextSnapshot(d.spaceIds)};
  s.tasks.push(task);s.newTask=null;
  if(d.personal){s.view='personal';s.page='tasks';s.personalBoard=newBoardState(true);}else{s.view='team';s.page='board';s.project=project;s.projectBoard=newBoardState();}
  render();notify('任务已加入看板，确认计划后开始执行。');
}
function newTaskAction(a,v){
  const d=newTaskDraft();
  if(d&&['mode','nav-personal','channel','project','task-board','studio','extensions','evolution','messages','open-bench','search-project'].includes(a))s.newTask=null;
  if(!a.startsWith('nt-'))return false;
  if(!d)return true;
  if(a==='nt-cancel'){Object.assign(s,{view:d.from.view,page:d.from.page,project:d.from.project});s.newTask=null;render();}
  else if(a==='nt-pick')newTaskMenu(v);
  else if(a==='nt-starter'){const st=newTaskStarters()[Number(v)];if(st){d.title='';d.goal=st[2]+'。'+st[3];render();}}
  else if(a==='nt-create')newTaskCreate();
  else if(a==='nt-mode'){if(d.executorType!==v){d.executorType=v;d.executor=v==='workflow'?'SpecX · 需求到交付':'CodeAgent';}render();document.getElementById('newTaskGoal')?.focus();}
  else if(a==='nt-set'){
    const [key,...rest]=String(v).split('|'),val=rest.join('|');
    if(key==='project'){d.project=val;d.spaceIds=defaultTaskKnowledge(val);}
    else if(key==='owner')d.owner=val;
    else if(key==='executor'){const [type,...name]=val.split(':');d.executorType=type;d.executor=name.join(':');}
    else if(key==='knowledge'){d.spaceIds=d.spaceIds.includes(val)?d.spaceIds.filter(x=>x!==val):[...d.spaceIds,val];render();setTimeout(()=>newTaskMenu('knowledge'),20);return true;}
    render();
  }
  return true;
}
document.addEventListener('input',e=>{const d=newTaskDraft();if(!d)return;if(e.target.id==='newTaskTitle')d.title=e.target.value;else if(e.target.id==='newTaskGoal')d.goal=e.target.value;});
document.addEventListener('keydown',e=>{if(newTaskDraft()&&e.target.id==='newTaskGoal'&&e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();newTaskCreate();}});
// 已保存的本地数据里，项目知识库可能还是旧名称（构建时会全局替换中文，这里用 Unicode 转义）：载入时改为新名称。
try{(s.knowledgeSpaces||[]).forEach(sp=>{if(/\u9879\u76ee\u7a7a\u95f4$/.test(sp.name||''))sp.name=sp.name.replace(/\u9879\u76ee\u7a7a\u95f4$/,'项目知识库');});}catch(e){}
