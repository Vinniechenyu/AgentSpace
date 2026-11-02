
// ---- Avatars: people get photos, Agents get the AgentSpace mascots (AS2_AVATARS is injected by the build).
// Avatars are rendered as initials across many templates; this maps the initial / name to an image after each render.
function avatarFor(el){
  const t=el.textContent.trim(),A=window.AS2_AVATARS||{};
  if(el.matches('.wb-agent-face'))return ['agent',A.IdeaAgent,'AgentSpace'];
  const people={'张':['zhang','张三'],'张三':['zhang','张三'],'李':['li','李四'],'李四':['li','李四'],'王':['wang','王五'],'王五':['wang','王五'],
    '陈':['chen','陈工'],'陈工':['chen','陈工'],'周':['zhou','周工'],'周工':['zhou','周工'],'我':['me','我'],'梁':['me','我'],'L':['me','我']};
  const agents={'C':['CodeAgent','CodeAgent'],'CodeAgent':['CodeAgent','CodeAgent'],'Q':['TestAgent','QA Agent'],'QA Agent':['TestAgent','QA Agent'],
    'O':['DocAgent','OfficeACE'],'OfficeACE':['DocAgent','OfficeACE'],'A':['IdeaAgent','AgentSpace']};
  if(people[t])return ['person',A[people[t][0]],people[t][1]];
  if(agents[t]&&(t.length>1||el.matches('.agent, [data-kind="agent"], .co-avatar.agent, .ms-avatar.agent, .as-avatar')||/^[CQO]$/.test(t)))return ['agent',A[agents[t][0]],agents[t][1]];
  return null;
}
const AVATAR_SEL='#demo :is(.co-avatar, .ms-avatar, .avatar, .wb-agent-face, .evo-hero-face, .ms-avatar-group > i, .as-avatar), #modalHost :is(.co-avatar, .ms-avatar, .avatar, .as-avatar), .appbar .userface';
function avatarsDecorate(){
  document.querySelectorAll(AVATAR_SEL).forEach(el=>{
    if(el.closest('.projectswitch, .as2-switcher, .projecticon')||el.classList.contains('hub-channel-avatar'))return;
    const key=el.textContent.trim();if(el.dataset.avatarKey===key)return;
    const hit=avatarFor(el);el.dataset.avatarKey=key;
    if(!hit||!hit[1]){el.classList.remove('as2-photo','as2-photo--agent','as2-photo--person');el.style.removeProperty('--as2-photo');return;}
    el.classList.add('as2-photo','as2-photo--'+hit[0]);el.classList.toggle('as2-photo--agent',hit[0]==='agent');
    el.style.setProperty('--as2-photo',`url("${hit[1]}")`);
    if(!el.getAttribute('aria-label'))el.setAttribute('aria-label',hit[2]);
    el.setAttribute('role','img');
  });
}
let avatarsQueued=false;
new MutationObserver(()=>{if(avatarsQueued)return;avatarsQueued=true;requestAnimationFrame(()=>{avatarsQueued=false;avatarsDecorate();});}).observe(document.body,{childList:true,subtree:true});
avatarsDecorate();
