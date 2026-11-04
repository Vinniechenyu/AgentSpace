
// ---- 频道「关联任务」「产物」：按真实业务逻辑汇总。
// 关联任务 = 本频道里 Thread 发起的协作任务 + 在频道里 @Agent 创建的任务，按状态分组、可筛选；
// 产物 = 这些任务验收阶段交付的文件，以「书架」呈现：每个任务一本，产物叠放探出，点击直达任务页的产物预览。
function channelTasks(){
  return s.tasks.filter(t=>t.scope===s.project&&((isCollaborationTask(t)&&collaborationThreadRef(t).channel===s.channel)||(t.mentionOf&&t.mentionOf.project===s.project&&t.mentionOf.channel===s.channel)));
}
function channelTaskOrigin(t){
  if(t.mentionOf)return {kind:'mention',label:'@'+(t.executor||'Agent')+' 提及',back:['channel-tab','messages','回到频道消息']};
  const ref=collaborationThreadRef(t),th=projectThreadList(t.scope).find(x=>x.key===ref.key);
  return {kind:'thread',label:'Thread · '+(th?.title||'协作线程'),back:['collaboration-origin',t.id,'回到原线程']};
}
function channelTabCount(v,threads){
  if(v==='threads')return `<span class="co-tab-count">${threads.length}</span>`;
  if(v==='tasks'){const n=channelTasks().length;return n?`<span class="co-tab-count">${n}</span>`:'';}
  if(v==='artifacts'){const n=channelTasks().filter(t=>taskArtifacts(t).length).length;return n?`<span class="co-tab-count">${n}</span>`:'';}
  return '';
}
function channelTaskIcon(st){return {pending:'dashed',running:'running',wait:'needInput',review:'review',done:'checkCircle',failed:'xCircle',cancelled:'xCircle'}[st]||'dashed';}
function channelTaskProgress(t){
  try{if(t.status!=='running'||!t.run)return '';const plan=runPlan(t),states=runStates(t),done=states.filter(x=>x[0]==='done').length;return `<span class="ct-prog"><i style="width:${Math.round(done/plan.length*100)}%"></i></span><span class="ct-prog-n">${done} / ${plan.length}</span>`;}catch(e){return '';}
}
function channelTaskRow(t){
  const o=channelTaskOrigin(t);
  return `<article class="ct-row" data-status="${t.status}"><span class="ct-ico">${ico(channelTaskIcon(t.status))}</span>
    <div class="ct-main"><button class="ct-title" data-a="open-task" data-v="${t.id}">${esc(t.title)}</button>
      <div class="ct-meta"><span>${ico('agent')}${esc(t.executor||'CodeAgent')}</span><span>${ico(o.kind==='mention'?'at':'chat')}${esc(o.label)}</span><span>${ico('personal')}${esc(t.owner||'未分配')} 负责</span><span class="ct-id">${t.id} · 目标 V${t.rev}</span></div>
      ${t.status==='running'?`<div class="ct-progress">${channelTaskProgress(t)}</div>`:''}</div>
    <div class="ct-side">${taskChip(t)}</div>
    ${btn(o.back[2],o.back[0],o.back[1],'sm')}${btn('查看任务','open-task',t.id,'primary sm')}</article>`;
}
function channelTasksView(){
  const all=channelTasks();
  if(!all.length)return `<div class="ch-empty">${ico('task')}<b>本频道还没有关联任务</b><span>在频道里 @Agent，或在 Thread 中启动协作，创建的任务会汇总到这里。</span></div>`;
  const groups=[['wait','需要你处理',t=>['wait','pending'].includes(t.status)],['running','进行中',t=>t.status==='running'],['review','待验收',t=>t.status==='review'],['done','已完成',t=>t.status==='done'],['failed','失败 / 已取消',t=>['failed','cancelled'].includes(t.status)]];
  const f=s.channelTaskFilter||'all',counts=Object.fromEntries(groups.map(([k,,m])=>[k,all.filter(m).length]));
  const pills=[['all','全部',all.length],...groups.filter(g=>counts[g[0]]).map(([k,l])=>[k,l,counts[k]])];
  return `<div class="dtoolbar ch-filters"><div class="dtabs" role="tablist">${pills.map(([k,l,n])=>`<button class="${f===k?'active':''}" role="tab" aria-selected="${f===k}" data-a="channel-task-filter" data-v="${k}">${l}<span class="ch-n">${n}</span></button>`).join('')}</div></div>`
    +groups.filter(([k,,m])=>(f==='all'||f===k)&&counts[k]).map(([k,l,m])=>`<section class="ct-group" data-g="${k}">${all.filter(m).map(channelTaskRow).join('')}</section>`).join('');
}
function channelArtifactSheet(t,a,i,n){
  const lines=String(taskArtifactPreview(t,a)||'').split('\n').filter(x=>x.trim()).slice(0,6);
  const ext=(a[0].split('.').pop()||'').toUpperCase();
  return `<span class="ca-sheet ca-sheet--${i}" data-of="${n}"><span class="ca-sheet-head"><i>${ico(a[2]||'file')}</i><b>${esc(a[0])}</b></span><span class="ca-sheet-body">${lines.map(l=>`<em>${l}</em>`).join('')}</span><span class="ca-sheet-ext">${esc(ext||a[3]||'')}</span></span>`;
}
function channelImmersive(){const o=s.channelArtifactOpen;return o&&s.channelTab==='artifacts'&&o.project===s.project&&o.channel===s.channel?' ca-immersive':'';}
function channelArtifactAsk(open,t,a){
  const chat=(open.chat||[]).filter(m=>m.k===open.k);
  return `${chat.length?`<div class="ca-chat" id="caChat">${chat.map(m=>`<div class="ca-msg ca-msg--${m.who}">${m.who==='agent'?`<span class="ca-msg-ava">${ico('spark')}</span>`:''}<p>${esc(m.text)}</p></div>`).join('')}</div>`:''}
    <div class="composer ca-composer"><textarea id="artifactInput" rows="2" aria-label="向 Agent 提问或提出修订" placeholder="就「${esc(a[0])}」提问，或让 Agent 修改、补充…"></textarea><div class="composerfoot"><span class="co-compose-hint">Enter 发送 · Shift + Enter 换行</span><span class="spacer"></span>${btn(ico('send')+'发送','ca-ask','','primary sm')}</div></div>`;
}
function channelArtifactViewer(open){
  const t=s.tasks.find(x=>x.id===open.id),arts=t?taskArtifacts(t):[];
  if(!t||!arts.length){s.channelArtifactOpen=null;return channelArtifactsView();}
  const k=Math.min(open.k||0,arts.length-1),a=arts[k];open.k=k;
  return `<div class="ca-viewer-head"><button class="ca-back" data-a="ca-close" aria-label="返回产物列表">${ico('back')}<span># ${esc(s.channel)} · 产物</span></button><b>${esc(t.title)}</b>${taskChip(t)}<span class="spacer"></span>${btn('查看任务','open-task',t.id,'sm')}</div>
  <div class="ca-viewer"><aside class="ca-list" role="listbox" aria-label="产物清单"><div class="ca-list-head">${arts.length} 份产物 · V${t.rev}</div>${arts.map(([name,meta,icon],i)=>`<button role="option" aria-selected="${i===k}" class="ca-item${i===k?' active':''}" data-a="ca-pick" data-v="${i}"><span class="ca-item-ico">${ico(icon)}</span><span class="ca-item-txt"><b>${esc(name)}</b><small>${esc(meta)}</small></span></button>`).join('')}</aside>
  <section class="ca-preview" aria-label="产物预览"><header class="ca-pv-head"><span class="ca-item-ico">${ico(a[2])}</span><div class="ca-pv-title"><b>${esc(a[0])}</b><small>${esc(a[1])} · 来自 ${esc(t.id)}</small></div><span class="spacer"></span>${btn('复制内容','ca-copy','','sm')}${btn('收录到项目知识库','space-artifact',t.id,'sm')}</header>
    <div class="ca-pv-scroll"><pre class="ca-pv-body" id="caPreviewBody">${taskArtifactPreview(t,a)}</pre></div>
    <footer class="ca-ask">${channelArtifactAsk(open,t,a)}</footer></section></div>`;
}
function channelArtifactsView(){
  const open=s.channelArtifactOpen;if(open&&open.project===s.project&&open.channel===s.channel)return channelArtifactViewer(open);
  const groups=channelTasks().map(t=>({t,arts:taskArtifacts(t)})).filter(g=>g.arts.length);
  const total=groups.reduce((n,g)=>n+g.arts.length,0);
  if(!groups.length)return `<div class="ch-empty">${ico('archive')}<b>本频道还没有交付产物</b><span>任务验收阶段产出的文档、补丁与报告会按任务收进这里。</span></div>`;
  return `<div class="ca-head"><h4>本频道的交付产物</h4><small>共 ${total} 份 · 来自 ${groups.length} 个任务</small><span class="spacer"></span>${btn('查看关联任务','channel-tab','tasks','link sm')}</div>
  <div class="ca-shelf">${groups.map(({t,arts},gi)=>`<article class="ca-book" tabindex="0" data-a="ca-open" data-v="${t.id}|0" data-tone="${['blue','violet','teal','orange'][gi%4]}" aria-label="${esc(t.title)}，${arts.length} 份产物">
      <div class="ca-title"><b>${esc(t.title)}</b><small>${arts.length} 份产物 · V${t.rev} · ${esc(t.executor||'CodeAgent')}</small></div>
      <span class="ca-state">${taskChip(t)}</span>
      <div class="ca-stack">${arts.slice(0,3).map((a,i)=>channelArtifactSheet(t,a,i,Math.min(arts.length,3))).join('')}</div>
      ${arts.length>3?`<span class="ca-more">+${arts.length-3}</span>`:''}</article>`).join('')}</div>`;
}
function channelTabsAction(a,v){
  if(a==='channel-tab'||a==='channel'){s.channelArtifactOpen=null;return false;}
  if(a==='ca-open'){const [id,k]=String(v).split('|');s.channelArtifactOpen={id,k:Number(k)||0,project:s.project,channel:s.channel};render();return true;}
  if(a==='ca-pick'){if(s.channelArtifactOpen){s.channelArtifactOpen.k=Number(v)||0;render();}return true;}
  if(a==='ca-close'){s.channelArtifactOpen=null;render();return true;}
  if(a==='ca-ask'){
    const o=s.channelArtifactOpen,el=document.getElementById('artifactInput'),text=el?.value.trim();if(!o||!text){notify('先写下想问的问题或修订意见。');return true;}
    const t=s.tasks.find(x=>x.id===o.id),a2=t?taskArtifacts(t)[o.k]:null;o.chat=[...(o.chat||[]),{k:o.k,who:'me',text}];
    const revise=/修改|补充|改成|调整|增加|删除|重写|修订/.test(text);
    o.chat.push({k:o.k,who:'agent',text:revise?'已记录修订意见，会基于「'+(a2?a2[0]:'当前产物')+'」生成 V'+((t?.rev||1)+1)+' 草稿，完成后在这里通知你验收（演示）。':'我已读取「'+(a2?a2[0]:'当前产物')+'」和来源任务 '+(t?.id||'')+' 的执行记录：这份产物与目标 V'+(t?.rev||1)+' 一致，结论与证据可追溯；需要的话我可以继续展开某一节（演示）。'});
    render();requestAnimationFrame(()=>{const c=document.getElementById('caChat');c&&(c.scrollTop=c.scrollHeight);document.getElementById('artifactInput')?.focus();});return true;}
  if(a==='ca-copy'){const el=document.getElementById('caPreviewBody');try{navigator.clipboard?.writeText(el?.textContent||'');}catch(e){}notify('已复制产物内容。');return true;}
  if(a==='channel-task-filter'){s.channelTaskFilter=v;render();return true;}
  if(a==='open-task-artifact'){const [id,k]=String(v).split('|');if(taskPageOpen(id)){s.taskTool='artifact';s.taskArtifact=Number(k)||0;render();}return true;}
  return false;
}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList?.contains('ca-book'))e.target.click();if(e.target.id==='artifactInput'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();document.querySelector('#demo [data-a="ca-ask"]')?.click();}});
// 示例：为各项目、各频道补充真实场景的关联任务（含已完成 / 待验收的带产物任务）。
(function seedChannelTasks(){
  try{
    if(s.channelTasksSeeded2||!Array.isArray(s.tasks))return;s.channelTasksSeeded2=true;
    const mk=(project,id,title,channel,status,kind,executor,owner,goal,rev=1)=>({id,title,scope:project,type:'temp',trigger:'manual',status,source:'频道 @'+executor+' / #'+channel,owner,triggeredBy:owner,rev,run:status==='pending'?0:1,kind,goal,executor,spaceIds:defaultTaskKnowledge(project),mentionOf:{project,channel}});
    const add=x=>{if(!s.tasks.some(y=>y.id===x.id))s.tasks.push(x);};
    [mk('AICS','T-3121','批量取消偶发失败：重试边界分析','development','done','performance','CodeAgent','李四','复现批量取消 50 个任务时的超时，确认幂等与重试边界，给出修复补丁。',2),
     mk('AICS','T-3122','任务日志大文件导出：方案评审','development','review','analysis','OfficeACE','王五','评估 100MB 以上日志的导出方案，整理异步导出、有效期与失败提示。'),
     mk('AICS','T-3123','发版门禁：灰度验证清单','qa','review','analysis','QA Agent','王五','按灰度观察窗口整理验证清单与回滚条件，标出尚未覆盖的风险。'),
     mk('AICS','T-3124','回滚阻塞项确认','qa','wait','analysis','QA Agent','王五','核对回滚路径上的数据兼容问题，等待负责人确认处理范围。'),
     mk('AICS','T-3125','跨项目任务筛选：权限与默认范围','requirement','done','spec','OfficeACE','张三','整理“我的任务”跨项目汇总的权限与默认范围，产出 Spec 与验收条件。',2)].forEach(add);
    let n=3130;
    (projectNames||[]).filter(pn=>pn!=='AICS').forEach(pn=>{
      const chans=projectChannels(pn).filter(c=>c.id!=='general');
      chans.forEach((c,i)=>{
        const owner=['张三','李四','王五'][i%3];
        add(mk(pn,'T-'+(n++),c.name+'：需求与验收条件梳理',c.id,'done','spec','OfficeACE',owner,'梳理 '+c.name+' 的目标、约束与验收条件，产出 Spec 与测试报告。',2));
        add(mk(pn,'T-'+(n++),c.name+'：回归验证与风险清单',c.id,i%2?'running':'review','analysis','QA Agent',owner,'按当前迭代范围做回归验证，列出未覆盖风险与责任人。'));
      });
    });
    save();
  }catch(e){}
})();
