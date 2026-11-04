
// ---- 「返回 / 全部…」这类层级返回操作放进面板头部（面包屑）：
// 详情页（工作台详情、个人知识库详情等）正文里的「← 全部工作台」不再占一行，改为面包屑上可点击的上一级，
// 面包屑末尾显示当前对象名：个人空间 › 我的工作台 › Runtime 每日合入。「返回…」类（如返回工作台构建）作为头部返回按钮。
const CRUMB_BACK=[/^全部工作台$/,/^个人知识库$/];
function crumbDecorate(){
  const crumb=document.querySelector('#demo .democrumb'),page=document.querySelector('#demo .demopage');
  if(!crumb||!page||crumb.dataset.crumbMoved)return;
  const back=[...page.querySelectorAll('.demohead button.btn.link, .demohead button.link')].find(b=>b.querySelector('svg')&&b.dataset.a);
  if(!back)return;
  const label=back.textContent.trim(),title=page.querySelector('.demohead h1')?.textContent.trim();
  const spans=[...crumb.children].filter(e=>e.tagName==='SPAN'&&!e.classList.contains('spacer'));
  const labelSpan=spans[0];
  if(CRUMB_BACK.some(r=>r.test(label))&&labelSpan&&title){
    const link=document.createElement('button');link.className='crumb-link';link.type='button';link.dataset.a=back.dataset.a;link.dataset.v=back.dataset.v||'';link.textContent=labelSpan.textContent.trim();link.setAttribute('aria-label','返回'+label);
    labelSpan.replaceWith(link);
    const chev=crumb.querySelector(':scope > svg.icon')?.cloneNode(true),cur=document.createElement('span');cur.className='crumb-cur';cur.textContent=title;
    const spacer=crumb.querySelector(':scope > .spacer');if(chev)crumb.insertBefore(chev,spacer);crumb.insertBefore(cur,spacer);
  }else{
    const pill=document.createElement('button');pill.className='crumb-back';pill.type='button';pill.dataset.a=back.dataset.a;pill.dataset.v=back.dataset.v||'';pill.innerHTML=back.innerHTML;pill.setAttribute('aria-label',label);
    const toggle=crumb.querySelector(':scope > .as2-side-toggle');toggle?toggle.after(pill):crumb.prepend(pill);
  }
  back.classList.add('crumb-moved');crumb.dataset.crumbMoved='1';
}
const crumbObs=new MutationObserver(()=>{crumbDecorate();crumbObs.takeRecords();});
crumbObs.observe(document.getElementById('demo'),{childList:true,subtree:true});
setTimeout(crumbDecorate,0);
