
// ---- Settings (AS2): global preferences grouped by what they govern.
// Wired: theme (incl. system), density, reduced motion, unread badge, default project,
// shortcuts into Evolution / Extensions / Guide, local data reset. Others are marked as mock.
const SETTINGS_SECTIONS=[['general','通用','settings'],['appearance','外观','spark'],['notify','通知','bell'],['agent','Agent 与自主权','shield'],['memory','记忆与进化','evolution'],['extensions','扩展与权限','grid'],['shortcuts','快捷键','code'],['data','数据与隐私','file']];
const SETTINGS_ACTIONS=[['read','读取资料与检索','safe','查询项目空间、仓库、日志'],['write','修改工作台与草稿','risky','生成新版本、改写内容，可撤销'],['send','代我发送消息','risky','在频道、Thread 或飞书中发言'],['destructive','删除或对外发布','destructive','删除数据、发布 Workflow、合入代码']];
// Functions, not consts: settingsApply() runs during the first render, before this block executes.
// 流光皮肤配色：主色（冷，决定选中 / 运行 / 背景上部）+ 辅色（暖，决定等待 / 高亮 / 背景下部）。
function liquidPalettes(){return [['blue-orange','流光 · 蓝橙','#2B76F0','#F08A3C'],['teal-violet','极光 · 青紫','#0EA5B7','#8B5CF6'],['berry-amber','莓果 · 粉金','#E0457B','#F5A524'],
  ['mint-sky','薄荷 · 绿蓝','#12A170','#3B82F6'],['dusk','暮色 · 紫粉','#6D5DF5','#F472B6'],['graphite','石墨 · 灰银','#475569','#A3A3A3']];}
function autonomyPresets(){return {ask:{read:'ask',write:'ask',send:'ask'},risky:{read:'auto',write:'ask',send:'ask'},auto:{read:'auto',write:'auto',send:'ask'}};}
function settingsConfig(){
  const d={density:'comfortable',reduceMotion:false,unreadBadge:true,needYou:'inapp',digest:true,quietHours:false,defaultAgent:'CodeAgent',autonomy:'risky',actions:{...autonomyPresets().risky},approvalTtl:'once',learn:true,retention:'90',extApproval:true,liquidPreset:'blue-orange',liquidA:'#2B76F0',liquidB:'#F08A3C'};
  if(!s.settings||typeof s.settings!=='object')s.settings={};
  s.settings={...d,...s.settings,actions:{...d.actions,...(s.settings.actions||{})}};
  return s.settings;
}
function themeTone(style){const tone=APPEARANCE_STYLES[style]?.tone||'light';return tone==='auto'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):tone;}
function settingsApply(){const st=settingsConfig(),root=document.documentElement;root.dataset.density=st.density;root.dataset.motion=st.reduceMotion?'reduce':'full';root.dataset.unreadBadge=st.unreadBadge?'on':'off';root.style.setProperty('--lq-a',st.liquidA);root.style.setProperty('--lq-b',st.liquidB);pixelFontsEnsure();}
// 像素皮肤字体：仅在选用时按需加载（Silkscreen 像素标题 + JetBrains Mono 正文；离线回退系统等宽字体）。
function pixelFontsEnsure(){if(s?.appearance?.style!=='pixel'||document.getElementById('as2-pixel-fonts'))return;const l=document.createElement('link');l.id='as2-pixel-fonts';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Silkscreen:wght@400;700&display=swap';document.head.appendChild(l);}
function settingsSet(key,value){
  const st=settingsConfig();
  if(key.startsWith('actions.'))st.actions[key.slice(8)]=value;
  else if(key==='autonomy'){st.autonomy=value;st.actions={...st.actions,...autonomyPresets()[value]};}
  else if(key==='defaultProject'){s.project=value;}
  else if(key==='liquidPreset'){const p=liquidPalettes().find(x=>x[0]===value);st.liquidPreset=value;if(p){st.liquidA=p[2];st.liquidB=p[3];}}
  else if(key==='liquidA'||key==='liquidB'){st[key]=value;st.liquidPreset=liquidPalettes().find(x=>x[2].toLowerCase()===st.liquidA.toLowerCase()&&x[3].toLowerCase()===st.liquidB.toLowerCase())?.[0]||'custom';}
  else st[key]=value;
  if(key.startsWith('actions.'))st.autonomy=Object.entries(autonomyPresets()).find(([,p])=>Object.entries(p).every(([k,v])=>st.actions[k]===v))?.[0]||'custom';
  save();settingsApply();if(key==='defaultProject')render();openSettings();
}
function settingsRow(title,desc,control){return `<div class="settings-row"><div class="settings-row-copy"><b>${title}</b>${desc?`<small>${desc}</small>`:''}</div><div class="settings-row-control">${control}</div></div>`;}
function settingsGroup(title,rows,note=''){return `<div class="settings-group">${title?`<h4>${title}</h4>`:''}<div class="settings-card">${rows}</div>${note?`<p class="settings-note">${note}</p>`:''}</div>`;}
function settingsToggle(key,on,locked=false){return `<button class="as2-switch" role="switch" aria-checked="${on}" ${locked?'aria-disabled="true" title="由安全策略锁定"':`data-a="settings-toggle" data-v="${key}"`}><i></i></button>`;}
function settingsSeg(key,value,options){return `<div class="as-seg" role="radiogroup">${options.map(([v,l])=>`<button role="radio" aria-checked="${value===v}" data-a="settings-set" data-v="${key}|${v}">${l}</button>`).join('')}</div>`;}
function settingsSelect(key,value,options,label){return `<select class="settings-select" data-setting="${key}" aria-label="${label}">${options.map(([v,l])=>`<option value="${esc(v)}" ${value===v?'selected':''}>${esc(l)}</option>`).join('')}</select>`;}
const SETTINGS_MOCK='<span class="as-badge as-badge--mock">示例 · 未接入</span>';
function settingsPane(sec){
  const st=settingsConfig(),{style}=appearanceConfig();
  if(sec==='general')return settingsGroup('工作区',
      settingsRow('默认项目','进入「项目」时打开的项目，也是新建任务的默认归属',settingsSelect('defaultProject',s.project,joinedProjects().map(p=>[p,p]),'默认项目'))+
      settingsRow('语言','界面与 Agent 回复的默认语言','<span class="settings-value">简体中文</span>')+
      settingsRow('时区','任务时间、定时触发按此时区计算','<span class="settings-value">Asia/Shanghai · UTC+8</span>'))+
    settingsGroup('入门',settingsRow('产品指引','重新浏览四种工作方式：工作台、个人助理、Thread、固定流程',btn('逛一圈','settings-guide','','sm')));
  if(sec==='appearance')return settingsGroup('主题',`<div class="appearance-style-options settings-theme-options" role="group" aria-label="主题">${Object.entries(APPEARANCE_STYLES).map(([key,item])=>`<button class="appearance-style-option" data-a="appearance-style" data-v="${key}" aria-pressed="${style===key}"><span class="appearance-style-thumb" data-style="${key}" aria-hidden="true"><i></i><span><b></b><small></small><small></small></span></span><span class="appearance-style-copy"><b>${item.name}</b><small>${item.tagline}</small></span><span class="appearance-choice-check" aria-hidden="true">${ico('check')}</span></button>`).join('')}</div>`)+
    (style==='liquid'?settingsGroup('流光配色',`<div class="liquid-swatches" role="radiogroup" aria-label="流光配色">${liquidPalettes().map(([id,name,a,b])=>`<button class="liquid-swatch" role="radio" aria-checked="${st.liquidPreset===id}" data-a="settings-set" data-v="liquidPreset|${id}" style="--a:${a};--b:${b}"><i></i><span>${name.split(' · ')[1]}</span></button>`).join('')}<button class="liquid-swatch liquid-swatch--custom" role="radio" aria-checked="${st.liquidPreset==='custom'}" data-a="settings-set" data-v="liquidPreset|custom"><i></i><span>自定义</span></button></div>`+
      settingsRow('自定义颜色','主色用于选中、运行与背景上部；辅色用于等待、高亮与背景下部',`<span class="liquid-custom"><label class="liquid-color"><input type="color" value="${esc(st.liquidA)}" data-setting="liquidA" data-liquid-color="--lq-a" aria-label="主色">主色 <code>${esc(st.liquidA.toUpperCase())}</code></label><label class="liquid-color"><input type="color" value="${esc(st.liquidB)}" data-setting="liquidB" data-liquid-color="--lq-b" aria-label="辅色">辅色 <code>${esc(st.liquidB.toUpperCase())}</code></label></span>`),
      '其余颜色（背景渐变、选中底色、状态色）都由这两种颜色自动推导。'):settingsGroup('',settingsRow('流光配色','选择「流光」皮肤后，可在这里切换配色或自定义主色与辅色','<span class="settings-value">需先选择流光</span>')))+
    settingsGroup('显示',
      settingsRow('界面密度','紧凑模式收紧行高与间距，一屏显示更多任务与消息',settingsSeg('density',st.density,[['comfortable','舒适'],['compact','紧凑']]))+
      settingsRow('减少动效','关闭进入动画、脉冲与闪烁效果',settingsToggle('reduceMotion',st.reduceMotion)));
  if(sec==='notify')return settingsGroup('提醒',
      settingsRow('消息未读角标','在左侧导航「消息」上显示未读数',settingsToggle('unreadBadge',st.unreadBadge))+
      settingsRow('需要我处理','Agent 等待确认、任务待验收时如何提醒你；事项始终保留在任务列表中',settingsSeg('needYou',st.needYou,[['inapp','仅应用内'],['im','应用内 + 飞书'],['off','不额外提醒']]))+
      settingsRow('每日摘要','工作日 09:00 汇总待办、运行结果与失败项',settingsToggle('digest',st.digest))+
      settingsRow('免打扰时段','22:00–08:00 不推送提醒，待办照常进入列表',settingsToggle('quietHours',st.quietHours)),
    `${SETTINGS_MOCK} 飞书推送、每日摘要与免打扰为示例，当前只影响本页显示。`);
  if(sec==='agent'){
    const agents=DIRECTORY.filter(p=>p.type==='agent').map(p=>[p.name,`${p.name} · ${p.role}`]);
    const levels=[['ask','每步确认','所有动作先问我'],['risky','仅高风险确认','只读自动，改动先问'],['auto','自主执行','可撤销的改动直接做']];
    return settingsGroup('默认执行者',settingsRow('默认 Agent','个人助理新建临时任务时的执行者，可在输入框中 @ 其他 Agent',settingsSelect('defaultAgent',st.defaultAgent,agents,'默认 Agent')))+
      settingsGroup('自主权',`<div class="settings-autonomy"><div class="as-autonomy" role="radiogroup" aria-label="自主权">${levels.map(([v,b,d])=>`<button role="radio" aria-checked="${st.autonomy===v}" data-a="settings-set" data-v="autonomy|${v}"><b>${b}</b><span>${d}</span></button>`).join('')}</div>${st.autonomy==='custom'?'<p class="settings-note">已按动作单独调整（自定义）。</p>':''}<div class="settings-actions">${SETTINGS_ACTIONS.map(([k,label,risk,desc])=>`<div class="as-action-row"><span class="as-badge" data-risk="${risk}">${risk==='safe'?'低风险':risk==='risky'?'中风险':'不可撤销'}</span><div class="settings-row-copy"><b>${label}</b><small>${desc}</small></div><span class="as-action-row__where" ${(k==='destructive'||st.actions[k]==='ask')?'data-mode="ask"':''}>${k==='destructive'?`${ico('shield')} 始终询问`:settingsSeg('actions.'+k,st.actions[k],[['auto','直接执行'],['ask','先问我']])}</span></div>`).join('')}</div></div>`)+
      settingsGroup('批准',settingsRow('批准有效期','批准绑定当前计划版本；超时未处理视为拒绝',settingsSeg('approvalTtl',st.approvalTtl,[['once','仅本次'],['1h','1 小时'],['session','本次会话']])),
        `删除、对外发布等不可撤销动作始终逐次确认，不提供「始终允许」。${SETTINGS_MOCK}`);
  }
  if(sec==='memory'){
    normalizeEvolution();const e=s.evolutionCenter,confirmed=(e.assets||[]).length,pending=(e.proposals||[]).filter(p=>['pending','ready','blocked'].includes(p.status)).length;
    return settingsGroup('记忆',
        settingsRow('从个人会话中学习偏好','进化中心会基于你的会话与反馈提出改进建议',settingsToggle('learn',st.learn))+
        settingsRow('改进生效前需我确认','记忆、规则与模板的任何变更都需要你确认后才生效',settingsToggle('confirmMemory',true,true))+
        settingsRow('记忆保留期限','到期未再使用的记忆会进入待清理列表',settingsSeg('retention',st.retention,[['30','30 天'],['90','90 天'],['forever','长期']])))+
      settingsGroup('进化中心',settingsRow(`已确认 <span class="as-num">${confirmed}</span> 项 · 待处理改进 <span class="as-num">${pending}</span> 项`,'查看证据、评估结果与版本，决定是否采纳',btn('打开进化中心','settings-evolution','','sm')));
  }
  if(sec==='extensions'){
    const rows=(s.installations||[]).slice(0,6).map(i=>`<div class="as-action-row"><span class="settings-ext-icon">${ico('grid')}</span><div class="settings-row-copy"><b>${esc(asset(i.assetId)?.name||i.assetId)}</b><small>${esc(scopeLabel(i))}</small></div><span class="as-action-row__where">${esc(i.version?('v'+i.version):'已启用')}</span></div>`).join('')||'<p class="settings-note">尚未安装扩展。</p>';
    return settingsGroup(`已安装 <span class="as-num">${(s.installations||[]).length}</span>`,`<div class="settings-actions">${rows}</div>`)+
      settingsGroup('',settingsRow('管理扩展','安装范围、版本与依赖统一在「扩展」中管理',btn('打开扩展','settings-extensions','','sm'))+
        settingsRow('新扩展需管理员审批','项目范围的 MCP / CLI 安装需项目管理员批准后生效',settingsToggle('extApproval',st.extApproval)),`${SETTINGS_MOCK} 审批流为示例。`);
  }
  if(sec==='shortcuts')return settingsGroup('全局',[['⌘ / Ctrl','K','全局搜索'],['Esc','','关闭弹窗或浮层']].map(([a,b,l])=>settingsRow(l,'',`<span class="settings-keys"><kbd>${a}</kbd>${b?`<kbd>${b}</kbd>`:''}</span>`)).join(''))+
    settingsGroup('输入与决策',[['Enter','','发送消息'],['Shift','Enter','换行'],['@','','指定 Agent 或成员'],['⌘','↵','批准当前决策卡']].map(([a,b,l])=>settingsRow(l,'',`<span class="settings-keys"><kbd>${a}</kbd>${b?`<kbd>${b}</kbd>`:''}</span>`)).join(''),`「批准当前决策卡」为规范约定，原型中尚未接入。`);
  if(sec==='data'){let kb=0;try{kb=Math.round(JSON.stringify(s).length/1024);}catch(err){}
    return settingsGroup('本地数据',
        settingsRow('演示数据',`任务、工作台、对话与设置保存在本机浏览器，约 <span class="as-num">${kb}</span> KB`,'<span class="settings-value">仅本机</span>')+
        settingsRow('重置演示数据','清空本机保存的全部演示数据并恢复初始状态，无法撤销',btn('重置…','settings-reset','','sm danger')))+
      settingsGroup('关于',settingsRow('版本','','<span class="settings-value">AgentSpace 2.0 · AS2 设计系统</span>'));
  }
  return '';
}
function openSettings(section){
  settingsConfig();s.settingsSection=section||s.settingsSection||'general';const sec=s.settingsSection,label=SETTINGS_SECTIONS.find(x=>x[0]===sec)?.[1]||'';
  modal('设置',`<div class="settings-layout"><nav class="settings-nav" aria-label="设置分类">${SETTINGS_SECTIONS.map(([id,l,icon])=>`<button class="settings-nav-item ${sec===id?'active':''}" data-a="settings-section" data-v="${id}" ${sec===id?'aria-current="page"':''}>${ico(icon)}<span>${l}</span></button>`).join('')}</nav><section class="settings-pane" aria-label="${label}"><h3 class="settings-pane-title">${label}</h3>${settingsPane(sec)}</section></div>`,
    `<span class="settings-saved">${ico('check')}更改自动保存</span>${btn('完成','close-modal','','primary sm')}`);
  $('#modalHost .modal').classList.add('settings-modal');appearanceApply();
}
function settingsAction(a,v){
  if(a==='appearance-style'&&document.querySelector('#modalHost .settings-modal')){appearanceSelect('style',v);openSettings('appearance');return true;}
  switch(a){
    case 'settings-section':openSettings(v);return true;
    case 'settings-toggle':{const st=settingsConfig();st[v]=!st[v];save();settingsApply();openSettings();return true;}
    case 'settings-set':{const i=v.indexOf('|');settingsSet(v.slice(0,i),v.slice(i+1));return true;}
    case 'settings-guide':closeModal();showGuide();return true;
    case 'settings-evolution':closeModal();openEvolution('memory');return true;
    case 'settings-extensions':closeModal();openExtensions('installed');return true;
    case 'settings-reset':modal('重置演示数据',`<p>将清空本机保存的任务、工作台、对话与设置，恢复到初始演示状态。</p><div class="note" style="margin-top:14px">此操作无法撤销。</div>`,`${btn('返回设置','settings-section','data','sm')}${btn('重置并刷新','settings-reset-confirm','','sm danger')}`);return true;
    case 'settings-reset-confirm':try{Object.keys(localStorage).filter(k=>k.startsWith('agentspace-mvp')).forEach(k=>localStorage.removeItem(k));}catch(err){}location.reload();return true;
  }
  return false;
}
document.addEventListener('change',e=>{if(e.target.matches('#modalHost [data-setting]'))settingsSet(e.target.dataset.setting,e.target.value);});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(appearanceConfig().style==='system')appearanceApply();});

// ---- Input modality: focus rings are for keyboard users only (AS2 · 焦点).
// Programmatic focus after a click (dialogs, restored focus) must not draw a ring.
document.addEventListener('pointerdown',()=>{document.documentElement.dataset.input='pointer';},true);
document.addEventListener('keydown',e=>{if(['Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(e.key))document.documentElement.dataset.input='keyboard';},true);

// 流光自定义颜色：拖动取色时实时预览，松开（change）后保存。
document.addEventListener('input',e=>{const v=e.target.dataset?.liquidColor;if(!v)return;document.documentElement.style.setProperty(v,e.target.value);const code=e.target.parentElement.querySelector('code');if(code)code.textContent=e.target.value.toUpperCase();});
