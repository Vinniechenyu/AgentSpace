
// ---- Run view (AS2 · 执行可见性): Thinking Loader → Task List → Tool Call Group, plus 停止.
// Simulated: steps advance by elapsed time from startTask; the last step waits for “推进演示”.
// Density ladder: compact (inside task cards) = one line + progress; full (task detail / Thread) = steps + tool calls.
// Functions, not consts: runView() can run during the first render, before this block executes.
function runStepMs(){return 7000;}
function runUIState(){return window.__asRunUI||(window.__asRunUI={closed:{},open:{}});}
function runPlan(t){
  if(t.kind==='spec')return [
    ['读取需求与讨论','thread.read','需求 #206 · 12 条讨论',{thread:'requirement',limit:50},{messages:12,attachments:2}],
    ['生成 Spec 与设计','specx.generate','resource-priority-spec.md',{template:'SpecX v1.4',target:'V'+t.rev},{file:'resource-priority-spec.md',sections:7}],
    ['等待 Owner 确认','owner.review','需求 Owner 审阅',{reviewer:t.owner},{status:'pending'}],
    ['开发与测试','codehub.mr','MR !412 · 测试报告',{branch:'feat/resource-priority'},{mr:'!412',tests:'32/32'}]];
  if(t.kind==='performance')return [
    ['定位重复资源查询','logs.search','检索近 3 天任务列表日志',{service:'task-list',range:'3d',query:'duplicate resource query'},{hits:128,suspect:'ResourceRepo.findAll'}],
    ['复现翻页性能问题','sandbox.run','P95 2.4s · 已复现',{script:'bench/page.ts',pages:20},{p95:'2.4s',reproduced:true}],
    ['修复并生成补丁','repo.patch','performance-fix.diff · 3 个文件',{files:['ResourceRepo.ts','TaskList.tsx','cache.ts']},{diff:'performance-fix.diff',added:42,removed:17}],
    ['运行回归测试','ci.test','32 / 32 通过 · P95 640ms',{suite:'task-list',cases:32},{passed:32,failed:0,p95:'640ms'}]];
  return [
    ['读取授权资料','space.search','项目空间 · 6 条资料',{space:t.scope,query:t.title},{documents:6}],
    ['抽取关键信息','doc.extract','MR 12 条 · CI 4 次',{sources:6},{mr:12,ci:4}],
    ['交叉核对证据','ci.query','关联 4 次构建',{builds:4},{matched:4,missing:0}],
    ['撰写结论','report.write','分析报告 V'+t.rev,{format:'report'},{file:'analysis-report.md'}]];
}
function runIndex(t){const n=runPlan(t).length;if(!t.runStartedAt)t.runStartedAt=Date.now()-2.5*runStepMs();return Math.min(n-1,Math.floor((Date.now()-t.runStartedAt)/runStepMs()));}
function runClock(ms){const sec=Math.max(0,Math.round(ms/1000));return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');}
function runDuration(ms){const sec=Math.max(1,Math.round(ms/1000));return sec<60?sec+' 秒':Math.floor(sec/60)+' 分 '+(sec%60)+' 秒';}
function runJSON(o){return esc(JSON.stringify(o,null,2)).replace(/&quot;([^&]*?)&quot;(\s*:)/g,'<span class="tk-key">"$1"</span>$2').replace(/: &quot;([^&]*?)&quot;/g,': <span class="tk-str">"$1"</span>').replace(/: (\d+(\.\d+)?)/g,': <span class="tk-num">$1</span>');}
function runStates(t){
  const plan=runPlan(t),n=plan.length;
  if(t.status==='running'){const i=runIndex(t),frac=Math.min(.9,((Date.now()-t.runStartedAt)-i*runStepMs())/runStepMs());return plan.map((_,k)=>k<i?['done',1]:k===i?['running',(i===n-1?Math.min(frac,.9):frac)]:['pending',0]);}
  if(['review','done'].includes(t.status))return plan.map(()=>['done',1]);
  if(t.status==='wait')return plan.map((_,k)=>k<2?['done',1]:k===2?['waiting',0]:['pending',0]);
  if(t.status==='cancelled'){const i=t.runStopIndex??1;return plan.map((_,k)=>k<i?['done',1]:k===i?['stopped',0]:['pending',0]);}
  return plan.map(()=>['pending',0]);
}
function runView(t,mode='full'){
  if(!t||!t.run&&t.status==='pending')return mode==='compact'?'':`<section class="as2-run" data-run-task="${t?.id||''}" data-mode="${mode}"><div class="as-empty as2-run-empty"><b>确认后开始执行</b>执行步骤、工具调用与产物会实时显示在这里。</div></section>`;
  const plan=runPlan(t),states=runStates(t),n=plan.length,done=states.filter(x=>x[0]==='done').length,cur=states.findIndex(x=>['running','waiting','stopped'].includes(x[0]));
  const pct=Math.round(states.reduce((a,[st,p])=>a+(st==='done'?1:st==='running'?p:0),0)/n*100);
  const running=t.status==='running',started=t.runStartedAt||Date.now(),runId='R-'+t.id.slice(2)+'-'+(t.run||1);
  const elapsed=running?runClock(Date.now()-started):t.runFinishedAt?runDuration(t.runFinishedAt-started):'';
  const head=running?`<span class="as-thinking" role="status" aria-live="polite"><span class="as-spinner"></span><span class="as-shimmer">正在${esc(plan[cur]?.[0]||'执行')}</span></span>`
    :t.status==='wait'?`<span class="as-status" data-status="waiting">需要你 · ${esc(plan[cur]?.[0]||'确认')}</span>`
    :t.status==='review'?`<span class="as-status" data-status="review">步骤完成 · 待你验收</span>`
    :t.status==='done'?`<span class="as-status" data-status="done">已验收</span>`
    :t.status==='cancelled'?`<span class="as-status" data-status="stopped">已停止 · 停在第 ${cur+1} 步</span>`:'';
  const meta=`<span class="as2-run-meta as-num">${runId}${elapsed?' · '+(running?elapsed:'用时 '+elapsed):''}</span>`;
  const stop=running?btn(ico('pause')+'停止','cancel-task',t.id,'sm danger'):'';
  if(mode==='compact')return `<section class="as2-run" data-run-task="${t.id}" data-mode="compact"><div class="as2-run-head">${head}<span class="spacer"></span><span class="as-tasklist__count as-num">${done} / ${n}</span></div><div class="as-progress" ${running?'data-tone="brand"':''}><i style="width:${pct}%"></i></div></section>`;
  const listOpen=!runUIState().closed[t.id];
  const steps=plan.map(([label],k)=>{const [st,p]=states[k];return `<li class="as-tstep" data-state="${st}"><span class="as-tstep__icon" ${st==='running'?`style="--p:${Math.round(p*100)}%"`:''}></span><span class="as-tstep__label">${esc(label)}</span><span class="as-tstep__pct as-num">${st==='running'?Math.round(p*100)+'%':st==='waiting'?'需要你':st==='stopped'?'已停止':''}</span></li>`;}).join('');
  const calls=plan.map((step,k)=>[step,k]).filter(([,k])=>['done','running'].includes(states[k][0])&&plan[k][1]!=='owner.review');
  const times=['1.4s','6.2s','3.8s','12.5s'];
  const tools=calls.map(([[label,tool,summary,input,output],k])=>{const st=states[k][0],key=t.id+'|'+k,open=!!runUIState().open[key];return `<div class="as-tool" data-status="${st==='running'?'running':'success'}" data-open="${open}"><button class="as-tool__head" data-a="run-tool" data-v="${key}" aria-expanded="${open}"><span class="as-tool__tile">${st==='running'?'<span class="as-spinner"></span>':ico('code')}</span><span class="as-tool__name">${esc(tool)}</span><span class="as-tool__summary">${st==='running'?'进行中…':esc(summary)}</span><span class="as-tool__time">${st==='running'?'':times[k]||'2.0s'}</span><span class="as-tool__chev">${ico('chevron')}</span></button><div class="as-tool__body"><div class="as-tool__inner"><div class="as-tool__section"><div class="as-tool__label">输入</div><pre>${runJSON(input)}</pre></div>${st==='running'?'':`<div class="as-tool__section"><div class="as-tool__label">输出</div><pre>${runJSON(output)}</pre></div>`}</div></div></div>`;}).join('');
  return `<section class="as2-run" data-run-task="${t.id}" data-mode="full">
    <div class="as2-run-head">${head}${meta}<span class="spacer"></span><span class="as-badge as-badge--mock">示例数据</span>${stop}</div>
    <div class="as-tasklist" data-open="${listOpen}"><button class="as-tasklist__head" data-a="run-steps" data-v="${t.id}" aria-expanded="${listOpen}"><span class="as-tasklist__title">${esc(t.executor||'CodeAgent')} · 执行步骤</span><span class="as-tasklist__count as-num">${done} / ${n} 完成</span><span class="as-tool__chev">${ico('chevron')}</span></button><div class="as-progress" ${running?'data-tone="brand"':''}><i style="width:${pct}%"></i></div>${listOpen?`<ol class="as-tasklist__steps">${steps}</ol>`:''}</div>
    ${tools?`<div class="as-tool-group"><div class="as-tool-group__head">${ico('code')}<span>工具调用 · <span class="as-num">${calls.length}</span> 次</span></div>${tools}</div>`:''}
  </section>`;
}
function runRefresh(){document.querySelectorAll('[data-run-task]').forEach(el=>{const t=s.tasks.find(x=>x.id===el.dataset.runTask);if(t)el.outerHTML=runView(t,el.dataset.mode);});}
function runAction(a,v){
  if(a==='run-tool'){runUIState().open[v]=!runUIState().open[v];runRefresh();return true;}
  if(a==='run-steps'){runUIState().closed[v]=!runUIState().closed[v];runRefresh();return true;}
  return false;
}
setInterval(()=>{if(document.hidden)return;document.querySelectorAll('[data-run-task]').forEach(el=>{const t=s.tasks.find(x=>x.id===el.dataset.runTask);if(t&&t.status==='running')el.outerHTML=runView(t,el.dataset.mode);});},1000);
