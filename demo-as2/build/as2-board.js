
// ---- 任务看板 · 运行看板：卡片字段（类别｜标题 · 环境 / 执行方式 / 任务类型 / 区域 · 参与者 / 时间），hover 显示操作。
function boardHash(str){let h=0;for(const ch of String(str))h=(h*31+ch.codePointAt(0))>>>0;return h;}
function boardFields(t){
  const h=boardHash(t.id),trig=taskTrigger(t);
  const workflow=t.executorType==='workflow'||/SpecX|Workflow|流程/.test((t.source||'')+(t.title||''));
  const cat={spec:'需求开发',performance:'问题排查',automation:'质量巡检',review:'代码检视',doc:'文档更新',fixed:'需求开发'}[t.kind]||(trig==='schedule'?'定时巡检':trig==='event'?'事件响应':'协作任务');
  const agent=t.executor||'CodeAgent',agentKey={'CodeAgent':'C','QA Agent':'Q','OfficeACE':'O'}[agent]||'C';
  const people=[...new Set([t.owner||'我',taskTriggeredBy(t)].map(n=>String(n||'我').trim()[0]))].slice(0,2);
  const hh=String(8+h%10).padStart(2,'0'),mm=String(h%60).padStart(2,'0');
  return {cat,env:t.env||(h%3===0?'本地':'云端'),mode:workflow?'Workflow':'Agent',type:trig==='schedule'?'定时任务':trig==='event'?'事件任务':'临时任务',
    typeIcon:trig==='schedule'?'clock':trig==='event'?'zap':'file',zone:h%2?'黄区':'绿区',people,agentKey,more:(h%4)+1,time:t.time||`10月${20+h%8}日 ${hh}:${mm}`};
}
// A function, not a const: the first render can run before this module's consts are initialised (TDZ).
function boardCols(){return [
  ['pending','待开始','dashed','待人工启动的临时任务与事件任务',t=>t.status==='pending'],
  ['running','运行中','loader','正在由 Agent 或 Workflow 执行的任务',t=>t.status==='running'],
  ['wait','待输入','inputWait','等待用户输入或人工确认后才能继续的任务',t=>t.status==='wait'],
  ['review','待验收','checkCircle','执行完成、等待负责人验收产物的任务',t=>t.status==='review'],
  ['done','已完成','checkCircle','已验收的任务',t=>t.status==='done'],
  ['failed','失败 / 已取消','xCircle','校验失败、系统执行失败或被人工取消的任务',t=>['failed','cancelled'].includes(t.status)]];}
function boardActions(t){
  const a=[];const b=(act,icon,label)=>`<button class="tk-act" data-a="${act}" data-v="${t.id}" aria-label="${label}">${ico(icon)}</button>`;
  if(t.status==='pending')a.push(b('board-start','play','启动'),b('board-archive','archive','归档'));
  else if(t.status==='running')a.push(b('board-sleep','moon','休眠'),b('board-stop','stop','停止'));
  else if(t.status==='wait')a.push(b('open-task','inputWait','去处理'));
  else if(t.status==='review')a.push(b('open-task','check','验收'),b('board-archive','archive','归档'));
  else a.push(b('board-archive','archive','归档'));
  return a.join('');
}
function boardCard(t){const f=boardFields(t);return `<article class="kanban-card tk-card" data-task-id="${t.id}" data-status="${t.status}">
  <button class="tk-title" data-a="open-task" data-v="${t.id}"><span class="tk-cat">${esc(f.cat)}｜</span>${esc(t.title)}${t.status==='failed'?' '+tag('异常','red'):t.status==='cancelled'?' '+tag('已取消','gray'):''}</button>
  <div class="tk-meta"><span data-env="${f.env}">${ico(f.env==='本地'?'monitor':'cloud')}${f.env}</span><span>${ico(f.mode==='Workflow'?'workflow':'agent')}${f.mode}</span><span>${ico(f.typeIcon)}${f.type}</span><span data-zone="${f.zone}">${ico('shield')}${f.zone}</span></div>
  <div class="tk-foot"><span class="tk-people">${f.people.map(p=>`<span class="as-avatar">${esc(p)}</span>`).join('')}<span class="as-avatar agent" data-kind="agent">${f.agentKey}</span>${f.more>1?`<em>+${f.more}</em>`:''}</span><time>${esc(f.time)}</time><span class="tk-actions">${boardActions(t)}</span></div>
</article>`;}
function renderKanbanBoard(ts){
  return `<div class="task-kanban tk-board">${boardCols().map(([key,title,icon,hint,match])=>{const rows=ts.filter(match);
    return `<section class="kanban-column tk-col" data-col="${key}"><header><span class="tk-col-icon">${ico(icon)}</span><b>${title}</b><small>${rows.length}</small>${as2Hint(hint,title+'说明')}</header><div class="kanban-cards">${rows.map(boardCard).join('')||`<div class="tk-empty">${ico('archive')}<span>暂无相关任务</span></div>`}</div></section>`;}).join('')}</div>`;
}
function boardAction(a,v){
  if(a==='ac-menu'){acMenu(v);return true;}
  if(a==='ac-delete'){const r=s.automations?.find(x=>x.id===v);modal('删除自动化',`<p class="tk-confirm">删除后，「${esc(r?.name||v)}」将不再按计划或事件生成任务；已生成的任务实例与执行记录保留。</p><p class="tk-confirm">请确认是否删除？</p>`,btn('取消','close-modal')+btn('删除','ac-delete-confirm',v,'danger'));return true;}
  if(a==='ac-delete-confirm'){closeModal();notify('示例：已删除该自动化规则');return true;}
  if(a==='board-layout-set'){if((boardState().layout==='list')!==(v==='list'))action('board-layout','');return true;}
  const t=s.tasks?.find(x=>x.id===v);
  if(a==='board-start'&&t){modal('启动任务',`<p class="tk-confirm">任务：<b>${esc(t.title)}</b></p><p class="tk-confirm muted">${esc(t.goal||'按任务目标启动执行。')}</p><p class="tk-confirm">请确认是否启动该任务？</p>`,btn('取消','close-modal')+btn('启动','board-start-confirm',t.id,'primary'));return true;}
  if(a==='board-start-confirm'&&t){closeModal();startTask(t.id);notify('已启动：'+t.title);return true;}
  if(a==='board-archive'&&t){modal('归档任务',`<p class="tk-confirm">如若归档，任务将无法恢复继续执行，云上执行任务的沙箱和文件存储将被销毁。可以进入「设置 · 已归档任务」查看执行历史。</p><p class="tk-confirm">请确认是否归档该任务？</p>`,btn('取消','close-modal')+btn('确定','board-archive-confirm',t.id,'primary'));return true;}
  if(a==='board-archive-confirm'&&t){closeModal();notify('示例：已归档「'+t.title+'」');return true;}
  if(a==='board-sleep'&&t){notify('示例：任务已休眠，释放云上资源；恢复后重新进入排队。');return true;}
  if(a==='board-stop'&&t){action('cancel-task',t.id);return true;}
  return false;
}

// ---- 定时 / 事件 / 协作任务卡片：开关 + 更多菜单 · 标题与状态词 · 两行描述 · 虚线分隔 · 触发 / 执行方式胶囊
function automationCard(a,kind){
  const trigger=kind==='schedule'?scheduleDescription(a):a.eventSource+' / '+a.eventType;
  return `<article class="automation-card ac-card" data-rule-id="${a.id}">
    <div class="ac-top"><button class="as2-switch" role="switch" aria-checked="${a.enabled}" data-a="automation-toggle" data-v="${a.id}" aria-label="${a.enabled?'停用':'启用'}「${esc(a.name)}」" title="${a.enabled?'已启用 · 点击停用':'已停用 · 点击启用'}"><i></i></button><button class="iconbtn ac-more" data-a="ac-menu" data-v="${kind}|${a.id}" aria-label="更多操作" aria-haspopup="menu" aria-expanded="false">${ico('more')}</button></div>
    <button class="ac-title" data-a="automation-edit" data-v="${a.id}"><b>${esc(a.name)}</b>${a.lastStatus==='failed'?'<em class="ac-st ac-st--fail">失败</em>':''}${a.enabled?'':'<em class="ac-st">已停用</em>'}</button>
    <p class="ac-desc">${esc(a.prompt||'按所选 Agent 默认指引执行。')}</p>
    <div class="ac-foot"><span class="ac-chip" title="${esc(trigger)}">${ico(kind==='schedule'?'clock':'zap')}<span>${esc(trigger)}</span></span><span class="ac-meta">${ico(a.executorType==='workflow'?'workflow':'agent')}<span>${esc(a.executor)} · ${a.lastRun?'最近 '+esc(a.lastRun):'暂无执行'}</span></span></div>
  </article>`;
}
function renderAutomationCards(kind){const rules=boardRules(kind);return `<div class="board-rule-heading"><p class="small muted">${rules.length} 条${kind==='schedule'?'定时':'事件'}规则 · ${kind==='schedule'?'按计划生成实例，也可立即运行。':'按事件与过滤条件生成实例。'}</p></div><div class="automation-list ac-grid">${rules.map(a=>automationCard(a,kind)).join('')||'<div class="tk-empty">'+ico('archive')+'<span>当前筛选下暂无此类规则</span></div>'}</div>`;}
function collaborationCard(t){
  const ref=collaborationThreadRef(t),wf=collaborationMode(t)==='workflow';
  return `<article class="collaboration-task-card ac-card" data-collaboration-id="${t.id}">
    <div class="ac-top">${tag(collaborationLabel(t),wf?'':'green')}<span class="spacer"></span>${taskChip(t)}<button class="iconbtn ac-more" data-a="ac-menu" data-v="collab|${t.id}" aria-label="更多操作" aria-haspopup="menu" aria-expanded="false">${ico('more')}</button></div>
    <button class="ac-title" data-a="open-task" data-v="${t.id}"><b>${esc(t.title)}</b></button>
    <p class="ac-desc">${esc(t.goal||'')}</p>
    <div class="ac-foot"><span class="ac-chip">${ico(wf?'workflow':'agent')}<span>${esc(t.workflowName||t.executor||'CodeAgent')}${t.workflowVersion?' · v'+esc(t.workflowVersion):''}</span></span><span class="ac-meta">${ico('chat')}<span># ${esc(ref.channel)} · ${esc(t.owner)}</span></span></div>
    <div class="ac-hover">${collaborationTaskActions(t)}</div>
  </article>`;
}
function acMenu(v){
  const [kind,id]=String(v).split('|'),open=document.querySelector('.as2-menu[data-for="ac"]');closeExtMenu();if(open&&open.dataset.id===id)return;
  const btn=document.querySelector(`[data-a="ac-menu"][data-v="${v}"]`);if(!btn)return;const r=btn.getBoundingClientRect();
  const item=(a,val,icon,label,cls='')=>`<button role="menuitem" class="${cls}" data-a="${a}" data-v="${esc(val)}">${ico(icon)}<span>${label}</span></button>`;
  const items=kind==='collab'?item('open-task',id,'file','查看任务')+item('collaboration-origin',id,'chat','打开原始线程')
    :item('automation-edit',id,'edit','编辑')+item('automation-run',id,'play',kind==='schedule'?'立即运行':'模拟事件')+item('automation-instances',id,'clock','查看执行记录')+'<div class="as2-menu-sep"></div>'+item('ac-delete',id,'archive','删除','is-danger');
  document.body.insertAdjacentHTML('beforeend',`<div class="as2-menu" role="menu" data-for="ac" data-id="${esc(id)}">${items}</div>`);
  const m=document.querySelector('.as2-menu[data-for="ac"]');m.style.left=Math.round(Math.max(8,r.right-m.offsetWidth))+'px';m.style.top=Math.round(r.bottom+m.offsetHeight+8>innerHeight?r.top-m.offsetHeight-4:r.bottom+4)+'px';btn.setAttribute('aria-expanded','true');
}
