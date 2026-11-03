
// ---- 任务详情：全局页面（不再用弹窗）。左：任务头 + 概览面板 + 对话流 + 输入框；右：工具窗口（执行过程 / 产物 / 上下文）。
function taskPageTask(){return s.taskDetail?s.tasks?.find(x=>x.id===s.taskDetail):null;}
function taskPageOpen(id){if(!s.tasks?.find(x=>x.id===id))return false;s.taskDetail=id;s.taskTool=s.taskTool||'run';closeModal();render();document.querySelector('#demo .tp-flow')?.scrollTo({top:1e6});return true;}
function taskArtifacts(t){
  if(!['review','done'].includes(t.status))return [];
  const v='V'+t.rev;
  if(t.kind==='spec')return [['spec-'+t.id.toLowerCase()+'.md','Spec · '+v,'file','md'],['MR-1284','合并请求 · 待审查','code','mr'],['test-report.md','测试报告 · 32 / 32 通过','shield','md']];
  if(t.kind==='performance')return [['performance-fix.diff','修复补丁 · '+v,'code','diff'],['test-report.md','测试报告 · 32 / 32 通过','shield','md']];
  return [['analysis-report.md','分析报告 · '+v,'file','md'],['evidence.csv','证据明细 · 24 条','grid','csv']];
}
function taskPageUI(){return window.__tpUI||(window.__tpUI={ov:{todo:true,art:true,ctx:true}});}
function taskContextUse(t){const h=[...t.id].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7);return 38+h%50;}
function taskPageOverview(t){
  const plan=runPlan(t),states=t.run?runStates(t):plan.map(()=>['pending',0]),done=states.filter(x=>x[0]==='done').length,arts=taskArtifacts(t),ui=taskPageUI().ov,use=taskContextUse(t);
  const sec=(key,icon,title,count,body)=>`<section class="tp-ov-sec" data-open="${ui[key]}"><button class="tp-ov-head" data-a="task-ov" data-v="${key}" aria-expanded="${ui[key]}">${ico(icon)}<b>${title}</b>${count!=null?`<span class="as-num">${count}</span>`:''}<i>${ico('down')}</i></button>${ui[key]?`<div class="tp-ov-body">${body}</div>`:''}</section>`;
  return `<div class="tp-overview">
    ${sec('todo','check','待办',done+' / '+plan.length,`<ul class="tp-todo">${plan.map(([label],k)=>`<li data-state="${states[k][0]}">${states[k][0]==='done'?ico('check'):states[k][0]==='running'?'<span class="as-spinner"></span>':'<i></i>'}<span>${esc(label)}</span></li>`).join('')}</ul>`)}
    ${sec('art','archive','任务产物',arts.length,arts.length?arts.map(([name,meta,icon],k)=>`<button class="tp-art" data-a="task-artifact" data-v="${k}">${ico(icon)}<span><b>${esc(name)}</b><small>${esc(meta)}</small></span></button>`).join(''):'<p class="tp-muted">执行完成后，产物会出现在这里。</p>')}
    ${sec('ctx','book','上下文用量',null,`<div class="tp-ctx"><span>上下文 Token</span><b class="as-num">${use}k<small> / 200k</small></b></div><div class="tp-ctx-bar"><i style="width:${use/2}%"></i></div>`)}
  </div>`;
}
function taskPageFlow(t){
  const agent=t.executor||'CodeAgent',who=taskTriggeredBy(t)||t.owner||'我',arts=taskArtifacts(t),plan=runPlan(t);
  const msg=(name,body,time='')=>`<div class="tp-msg"><div class="tp-msg-head"><span class="as-avatar ${/Agent|ACE/.test(name)?'agent" data-kind="agent':''}">${esc(name==='CodeAgent'?'C':name==='QA Agent'?'Q':name==='OfficeACE'?'O':name[0])}</span><b>${esc(name)}</b>${time?`<time>${esc(time)}</time>`:''}</div><div class="tp-msg-body">${body}</div></div>`;
  const user=`<div class="tp-user"><p>${esc(t.goal||t.title)}</p><small>${esc(t.scope)} · 目标 V${t.rev} · ${esc(triggerLabel(taskTrigger(t)))}</small></div>`;
  const tools=`<button class="tp-tools" data-a="task-tool" data-v="run">${ico('code')}已使用 <b class="as-num">${plan.length}</b> 个工具${ico('chevron')}</button>`;
  let reply='';
  if(t.status==='pending')reply=msg(agent,`<p>我已整理执行计划，批准后开始执行。</p>${runView(t,'full')}`);
  else if(t.status==='running')reply=msg(agent,`<p>收到，正在按目标 V${t.rev} 执行。</p>${runView(t,'compact')}${tools}<div class="tp-actions">${btn('推进演示：返回结果','finish-task',t.id,'sm')}${btn('停止','cancel-task',t.id,'link sm')}</div>`);
  else if(t.status==='wait')reply=msg(agent,`<p>需要你确认后才能继续：请核对当前步骤的输入与范围。</p><div class="tp-actions">${btn('去确认','task-tool','run','primary sm')}</div>`);
  else if(['review','done'].includes(t.status))reply=msg(agent,`<p>${t.status==='done'?'已按目标 V'+t.rev+' 验收。':'执行完成，产物已返回，等待你验收。'}</p>${tools}<div class="tp-art-list">${arts.map(([name,meta,icon],k)=>`<button class="tp-art" data-a="task-artifact" data-v="${k}">${ico(icon)}<span><b>${esc(name)}</b><small>${esc(meta)}</small></span></button>`).join('')}</div>${t.status==='review'?`<div class="tp-actions">${btn('验收通过','accept-task',t.id,'primary sm')}${btn('提出修订','revise-task',t.id,'sm')}</div>`:''}`);
  else reply=msg(agent,`<p>${t.status==='failed'?'执行失败，已保留日志与中间产物。':'任务已停止，历史执行与产物保留。'}</p><div class="tp-actions">${btn('重新发起','restart-task',t.id,'sm')}</div>`);
  const extra=(t.chat||[]).map(m=>m.who==='me'?`<div class="tp-user"><p>${esc(m.text)}</p></div>`:msg(agent,`<p>${esc(m.text)}</p>`)).join('');
  return msg(who,user)+reply+extra;
}
function taskPageTool(t){
  const tab=s.taskTool||'run',arts=taskArtifacts(t),k=Math.min(s.taskArtifact||0,Math.max(arts.length-1,0)),a=arts[k];
  const tabs=[['run','执行过程'],['artifact','产物'+(arts.length?' '+arts.length:'')],['context','上下文']];
  let body='';
  if(tab==='run')body=runView(t,'full')||'<p class="tp-muted">确认执行后，步骤、工具调用与产物会实时显示在这里。</p>';
  else if(tab==='artifact')body=a?`<div class="tp-file-head">${ico(a[2])}<div><b>${esc(a[0])}</b><small>${esc(a[1])} · 来自 ${esc(t.id)}</small></div><span class="spacer"></span>${arts.length>1?arts.map((x,i)=>`<button class="tp-file-tab ${i===k?'active':''}" data-a="task-artifact" data-v="${i}">${esc(x[0])}</button>`).join(''):''}</div><pre class="tp-file-body">${taskArtifactPreview(t,a)}</pre>`:`<div class="tk-empty">${ico('archive')}<span>任务完成后，产物会在这里预览</span></div>`;
  else body=`<dl class="tp-kv"><div><dt>所属</dt><dd>${esc(t.scope)}</dd></div><div><dt>责任人</dt><dd>${esc(t.owner||'未分配')}</dd></div><div><dt>触发</dt><dd>${esc(triggerLabel(taskTrigger(t)))} · ${esc(taskTriggeredBy(t))}</dd></div><div><dt>来源</dt><dd>${esc(t.source||'—')}</dd></div><div><dt>目标</dt><dd>V${t.rev} · ${esc(t.goal||'')}</dd></div><div><dt>验收</dt><dd>${esc(t.accept||'结果完整、来源可追溯，按当前目标版本确认。')}</dd></div><div><dt>Run</dt><dd>${t.run?'R-'+t.id.slice(2)+'-'+t.run:'待确认后创建'}</dd></div></dl>${taskKnowledgeSummary(t)}`;
  return `<aside class="tp-tool"><nav class="tp-tool-tabs">${tabs.map(([v,l])=>`<button class="${tab===v?'active':''}" data-a="task-tool" data-v="${v}">${l}</button>`).join('')}<span class="spacer"></span><span class="as-badge as-badge--mock">示例数据</span></nav><div class="tp-tool-body">${body}</div></aside>`;
}
function taskArtifactPreview(t,a){
  if(a[3]==='diff')return esc(`diff --git a/task/list.ts b/task/list.ts\n@@ -42,9 +42,7 @@ export async function listTasks(page) {\n-  for (const task of page.items) {\n-    task.resource = await getResourceStatus(task.id)\n-  }\n+  const ids = page.items.map(t => t.id)\n+  const status = await batchResourceStatus(ids)   // 20 次 → 1 次\n+  page.items.forEach(t => (t.resource = status[t.id]))\n   return page\n }`);
  if(a[3]==='csv')return esc(`id,类别,结论,证据\nE-01,阻塞项,发布前回归证据待补齐,质量平台 · 回归报告\nE-02,需求变更,RR-124 验收条件变化,RR-124 · 变更记录\nE-03,风险,资源状态重复查询 20 次,接口日志 · 10月27日`);
  return esc(`# ${a[0]}\n\n## 目标 V${t.rev}\n${t.goal||t.title}\n\n## 结论\n- 已按执行计划完成：${runPlan(t).map(p=>p[0]).join(' → ')}\n- ${t.accept||'结果完整、来源可追溯'}\n\n## 证据\n- 任务 ${t.id} · ${t.executor||'CodeAgent'} 执行记录\n- 产物版本与目标版本一致（V${t.rev}）`);
}
function renderTaskPage(){
  const t=taskPageTask();
  return `<div class="tp-page"><section class="tp-left">
    <header class="tp-head"><button class="tp-back" data-a="task-page-back" aria-label="返回">${ico('back')}</button><div class="tp-title"><b title="${esc(t.title)}">${esc(t.title)}</b><small>${esc(t.id)} · ${esc(t.scope)} · ${esc(t.executor||'CodeAgent')}</small></div>${taskChip(t)}</header>
    <div class="tp-flow">${taskPageFlow(t)}</div>
    <div class="tp-compose"><div class="composer"><textarea id="taskPageInput" aria-label="补充任务要求" placeholder="补充要求，或 @${esc(t.executor||'CodeAgent')} 继续…"></textarea><div class="composerfoot"><span class="spacer"></span><button class="btn primary sm" data-a="task-send" data-v="${t.id}" aria-label="发送">${ico('send')}发送</button></div></div></div>
  </section>${taskPageTool(t)}</div>`;
}
function taskPageAction(a,v){
  if(s.taskDetail&&['mode','nav-personal','channel','project','task-board','studio','extensions','evolution','messages','board-open-project','open-bench','search-project','workflow-import'].includes(a))s.taskDetail=null;
  if(a==='task-page-back'){s.taskDetail=null;render();return true;}
  if(a==='task-tool'){s.taskTool=v||'run';render();return true;}
  if(a==='task-ov'){const ov=taskPageUI().ov;ov[v]=!ov[v];render();return true;}
  if(a==='task-artifact'){s.taskTool='artifact';s.taskArtifact=Number(v)||0;render();return true;}
  if(a==='task-send'){const t=s.tasks.find(x=>x.id===v),ta=document.getElementById('taskPageInput'),text=ta?.value.trim();if(!t||!text)return true;t.chat=[...(t.chat||[]),{who:'me',text},{who:'agent',text:'已记录补充要求，会在下一轮执行中采用；变更目标前会先请你确认。'}];render();document.querySelector('#demo .tp-flow')?.scrollTo({top:1e6});return true;}
  return false;
}
document.addEventListener('keydown',e=>{if(e.target.id==='taskPageInput'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();document.querySelector('#demo [data-a="task-send"]')?.click();}});
