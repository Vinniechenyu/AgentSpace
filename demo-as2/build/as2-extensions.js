
// ---- Extension rows: the ··· button opens an anchored menu (details · enable/disable · remove).
function closeExtMenu(){const m=document.querySelector('.as2-menu');if(!m)return;document.querySelector(`[data-a="ext-menu"][data-v="${m.dataset.for}"]`)?.setAttribute('aria-expanded','false');m.remove();}
function openExtMenu(id){
  const open=document.querySelector('.as2-menu'),same=open?.dataset.for===id;closeExtMenu();if(same)return;
  const btn=document.querySelector(`[data-a="ext-menu"][data-v="${id}"]`),i=s.installations.find(x=>x.id===id);if(!btn||!i)return;
  const r=btn.getBoundingClientRect();
  document.body.insertAdjacentHTML('beforeend',`<div class="as2-menu" role="menu" data-for="${esc(id)}" aria-label="${esc(asset(i.assetId).name)} 操作">
    <button role="menuitem" data-a="ext-detail" data-v="${esc(id)}">${ico('settings')}<span>详情与配置</span></button>
    <button role="menuitem" data-a="ext-toggle" data-v="${esc(id)}">${ico(i.enabled?'pause':'play')}<span>${i.enabled?'停用':'启用'}</span></button>
    <div class="as2-menu-sep"></div>
    <button role="menuitem" class="is-danger" data-a="ext-remove" data-v="${esc(id)}">${ico('close')}<span>移除</span></button>
  </div>`);
  const m=document.querySelector('.as2-menu'),w=m.offsetWidth,h=m.offsetHeight;
  m.style.left=Math.max(8,Math.round(r.right-w))+'px';
  m.style.top=Math.round(r.bottom+h+8>innerHeight?r.top-h-4:r.bottom+4)+'px';
  btn.setAttribute('aria-expanded','true');
  requestAnimationFrame(()=>m.querySelector('[role="menuitem"]')?.focus({preventScroll:true}));
}
function extensionAction(a,v){if(a!=='ext-menu')return false;openExtMenu(v);return true;}
// Picking an item runs its action through the normal dispatcher, then the menu closes.
document.addEventListener('click',e=>{if(e.target.closest('.as2-menu [data-a]'))setTimeout(closeExtMenu);});
document.addEventListener('pointerdown',e=>{if(document.querySelector('.as2-menu')&&!e.target.closest('.as2-menu, [data-a="ext-menu"], [data-a="composer-model"], [data-a="composer-add"]'))closeExtMenu();},true);
document.addEventListener('keydown',e=>{
  const m=document.querySelector('.as2-menu');if(!m)return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();const id=m.dataset.for;closeExtMenu();document.querySelector(`[data-a="ext-menu"][data-v="${id}"]`)?.focus();return;}
  if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();const items=[...m.querySelectorAll('[role="menuitem"]')],k=items.indexOf(document.activeElement);items[(k+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();}
},true);
window.addEventListener('resize',closeExtMenu);
document.addEventListener('scroll',closeExtMenu,true);

// ---- Hint: explanatory copy stays behind an ⓘ icon and shows on hover / keyboard focus.
function as2Hint(text,label='说明'){return `<span class="as2-hint"><button type="button" class="as2-hint-btn" aria-label="${esc(label)}">${ico('info')}</button><span class="as2-hint-pop" role="tooltip">${text}</span></span>`;}

// ---- Command palette (global search): ↑↓ move the highlight, Enter opens it, the count follows the results.
function paletteRows(){return [...document.querySelectorAll('#globalResults .palette-row')];}
function paletteSync(i=0){const rows=paletteRows();rows.forEach((r,k)=>r.classList.toggle('is-active',k===i));const c=document.getElementById('paletteCount');if(c)c.textContent=rows.length+' 个';}
document.addEventListener('keydown',e=>{
  if(!document.getElementById('globalQuery')||!['ArrowDown','ArrowUp','Enter'].includes(e.key))return;
  const rows=paletteRows();if(!rows.length)return;const i=rows.findIndex(r=>r.classList.contains('is-active'));
  if(e.key==='Enter'){e.preventDefault();(rows[i]||rows[0]).click();return;}
  e.preventDefault();const next=(i+(e.key==='ArrowDown'?1:-1)+rows.length)%rows.length;paletteSync(next);rows[next].scrollIntoView({block:'nearest'});
});
document.addEventListener('pointermove',e=>{const r=e.target.closest?.('#globalResults .palette-row');if(r&&!r.classList.contains('is-active'))paletteSync(paletteRows().indexOf(r));});
// Clicking anywhere outside the palette (the backdrop) closes it.
document.addEventListener('pointerdown',e=>{if(e.target.classList?.contains('modalback')&&e.target.querySelector('.as2-palette'))closeModal();});
