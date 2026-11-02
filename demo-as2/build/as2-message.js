
// ---- Message hover toolbar: copy a message's text (the toolbar itself is rendered with each message).
let messageActionEl=null;
document.addEventListener('click',e=>{messageActionEl=e.target.closest?.('[data-a]')||null;},true);
function messageAction(a){
  if(a!=='message-copy')return false;
  const msg=messageActionEl?.closest('.co-message, .ms-message');
  const text=msg?.querySelector('.co-message-text, .ms-message-content > p, .ms-message-body > p, p')?.innerText.trim()||'';
  if(!text){notify('这条消息没有可复制的文字。');return true;}
  (navigator.clipboard?.writeText(text)||Promise.reject()).then(()=>notify('已复制消息内容'),()=>{const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');notify('已复制消息内容');}catch(e){notify('复制失败，请手动选择文字。');}t.remove();});
  return true;
}
