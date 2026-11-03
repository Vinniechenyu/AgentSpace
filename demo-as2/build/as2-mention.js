
// ---- 频道里主动 @Agent：用户消息中的 @ 高亮；Agent 直接在频道回复任务卡（谁的任务 · 引用原话 · 回复 + 查看），
// 同一频道里对同一 Agent 的补充会合并进已有任务。输入框内键入 @ 弹出可提及的 Agent 与成员。
function channelAgents(){return ['CodeAgent','QA Agent','OfficeACE'];}
function channelMentionAgent(text){return channelAgents().find(n=>new RegExp('@'+n.replace(' ','\\s'),'i').test(text||''))||null;}
function coMentionHtml(text){
  const names=[...channelAgents(),...DIRECTORY.filter(p=>p.type==='person').map(p=>p.name)].sort((a,b)=>b.length-a.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  return esc(text||'').replace(new RegExp('@('+names.join('|')+')','g'),'<span class="co-mention-tag">@$1</span>');
}
function channelAgentTask(project,channel,agent){return s.tasks.find(t=>t.mentionOf&&t.mentionOf.project===project&&t.mentionOf.channel===channel&&t.executor===agent&&['pending','running','wait'].includes(t.status));}
function channelAgentReply(m){
  const agent=m.mention,who=m.name||msSender(m.by),plain=String(m.text).replace(new RegExp('@'+agent.replace(' ','\\s'),'ig'),'').trim();
  let t=channelAgentTask(m.project,m.channel,agent),reply;
  if(t){t.chat=[...(t.chat||[]),{who:'me',text:plain}];reply='收到，这条补充与当前判断一致，我会合并到「'+t.title+'」里一起处理，结论同步到这里。';}
  else{t={id:nextTaskId(),title:(plain.split(/[。！？\n]/)[0]||plain).slice(0,30),scope:m.project,type:'temp',trigger:'manual',status:'running',source:'频道 @'+agent+' / #'+m.channel,owner:who,triggeredBy:who,rev:1,run:1,kind:'analysis',goal:plain,executor:agent,spaceIds:defaultTaskKnowledge(m.project),mentionOf:{project:m.project,channel:m.channel}};s.tasks.push(t);reply='收到，我已创建任务，完成时会通知你。';}
  const card={id:hubMessageId(),project:m.project,channel:m.channel,by:hubSenderId(agent),name:agent,time:m.time,day:'今天',sentAt:Date.now(),text:reply,agentCard:{taskId:t.id,owner:who,quote:{by:who,text:m.text},text:reply}};
  setTimeout(()=>{s.channelMessages.push(card);save();if(s.page==='channel'&&s.channel===m.channel){coBottom='channel';render();}},600);
}
function channelAgentCard(m){
  const c=m.agentCard,t=s.tasks.find(x=>x.id===c.taskId),agent=m.name||msSender(m.by);
  return `<article class="co-message co-agent-reply"><div>${coAvatar(agent)}</div><div class="co-message-body"><div class="co-message-meta"><b>${esc(agent)}</b><span class="co-role co-role--agent">Agent</span><time>${esc(m.time||'刚刚')}</time></div>
    <div class="co-agent-card"><div class="co-agent-card-head">${coAvatar(c.owner)}<span>${esc(c.owner)}的任务</span><span class="spacer"></span>${t?taskChip(t):''}</div>
    <div class="co-agent-card-quote">回复 ${esc(c.quote.by)}：${esc(c.quote.text)}</div>
    <div class="co-agent-card-text">${esc(c.text)}${t?` <button class="co-agent-card-link" data-a="open-task" data-v="${t.id}">查看</button>`:''}</div></div></div></article>`;
}
// 示例：AICS · development 里两次 @CodeAgent（新建任务 → 补充合并）。
(function seedChannelMentions(){
  try{
    if(s.mentionSeeded||!Array.isArray(s.channelMessages)||!Array.isArray(s.tasks))return;
    s.mentionSeeded=true;
    if(!s.tasks.some(t=>t.id==='T-3120'))s.tasks.push({id:'T-3120',title:'线上白屏问题修复',scope:'AICS',type:'temp',trigger:'manual',status:'running',source:'频道 @CodeAgent / #development',owner:'李四',triggeredBy:'李四',rev:1,run:1,kind:'analysis',goal:'打开部分历史任务的详情页会直接白屏，新创建的任务暂时正常；定位原因并修复。',executor:'CodeAgent',spaceIds:defaultTaskKnowledge('AICS'),mentionOf:{project:'AICS',channel:'development'}});
    const q1='@CodeAgent 线上有用户反馈，打开部分历史任务的详情页会直接白屏，新创建的任务暂时正常。帮忙排查一下。',q2='@CodeAgent 我补充一下，出问题的基本都是上个月数据迁移之前创建的任务。有些任务不只是执行记录为空，附件字段可能也是 null。';
    const r2='收到，这个信息与当前判断一致。我会把排查范围扩展到历史任务的可选数组字段，避免只修复第一个报错后，页面又在附件模块崩溃。修复会集中放在接口数据转换层，把缺失或为 null 的数组字段统一转换为空数组。';
    const base={project:'AICS',channel:'development',day:'今天'};
    s.channelMessages.push({...base,id:hubMessageId(),by:'person-li',name:'李四',time:'11:40',text:q1},
      {...base,id:hubMessageId(),by:'agent-code',name:'CodeAgent',time:'11:41',text:'收到，我已创建任务，完成时会通知你。',agentCard:{taskId:'T-3120',owner:'李四',quote:{by:'李四',text:q1},text:'收到，我已创建任务，完成时会通知你。'}},
      {...base,id:hubMessageId(),by:'person-wang',name:'王五',time:'11:44',text:q2},
      {...base,id:hubMessageId(),by:'agent-code',name:'CodeAgent',time:'11:45',text:r2,agentCard:{taskId:'T-3120',owner:'李四',quote:{by:'王五',text:q2},text:r2}});
    save();render();
  }catch(e){}
})();
// 输入框内键入 @：弹出 Agent 与项目成员，选中后补全为「@名称 」。
function mentionMenu(input){
  closeExtMenu();const r=input.getBoundingClientRect();
  const people=DIRECTORY.filter(p=>p.type==='person'&&(p.projects||[]).includes(s.project)).map(p=>p.name);
  const item=(n,role,isAgent)=>`<button role="menuitem" data-a="mention-pick" data-v="${esc(n)}">${coAvatar(n)}<span>${esc(n)}</span><small>${esc(role)}</small></button>`;
  document.body.insertAdjacentHTML('beforeend',`<div class="as2-menu co-mention-menu" role="menu" data-for="mention" data-input="${input.id}"><div class="as2-menu-label">Agent · 交给它处理并创建任务</div>${channelAgents().map(n=>item(n,DIRECTORY.find(p=>p.name===n)?.role||'Agent',true)).join('')}<div class="as2-menu-sep"></div><div class="as2-menu-label">成员</div>${people.map(n=>item(n,DIRECTORY.find(p=>p.name===n)?.role||'',false)).join('')}</div>`);
  const m=document.querySelector('.as2-menu[data-for="mention"]');m.style.left=Math.round(r.left+12)+'px';m.style.top=Math.round(r.top-m.offsetHeight-6)+'px';
}
document.addEventListener('input',e=>{
  const el=e.target;if(!el||!['channelInput','threadInput'].includes(el.id))return;
  const before=el.value.slice(0,el.selectionStart);
  if(e.data==='@'||/(^|\s)@$/.test(before))mentionMenu(el);
  else if(document.querySelector('.as2-menu[data-for="mention"]')&&!/@[^\s@]*$/.test(before))closeExtMenu();
});
function mentionAction(a,v){
  if(a!=='mention-pick')return false;
  const menu=document.querySelector('.as2-menu[data-for="mention"]'),el=document.getElementById(menu?.dataset.input||'channelInput');
  if(el){const pos=el.selectionStart,before=el.value.slice(0,pos).replace(/@[^\s@]*$/,''),after=el.value.slice(pos);el.value=before+'@'+v+' '+after;const p=(before+'@'+v+' ').length;el.focus();el.setSelectionRange(p,p);el.dispatchEvent(new Event('input',{bubbles:true}));}
  closeExtMenu();return true;
}
