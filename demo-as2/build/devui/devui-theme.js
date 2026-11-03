
// ---- DevUI 多主题（devui/DESIGN.md §1）：主题挂在 <body data-theme data-mode> 上。
// <html data-theme="light|dark"> 仍由 appearanceApply 写入，作为 demo 自身的明暗开关。
function devuiApply(style){
  const dv=APPEARANCE_STYLES[style]?.devui||['as-ink'],b=document.body;
  b.dataset.theme=dv[0];dv[1]?b.dataset.mode=dv[1]:delete b.dataset.mode;
  // 像素字体：Fusion Pixel / Zpix 需随应用打包；演示时按需加载含中文的 DotGothic16 作为回退
  if(dv[0]==='as-pixel'&&!document.getElementById('devui-pixel-font'))document.head.insertAdjacentHTML('beforeend','<link id="devui-pixel-font" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap">');
}
