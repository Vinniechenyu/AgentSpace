#!/usr/bin/env python3
"""Build the DevUI multi-theme copy of the AS2 demo.

Input : ../agentspace2.0_mvp.as2.html   (run ../refactor-as2.py first)
Output: ../agentspace2.0_mvp.devui.html (the AS2 build stays untouched)

1. Inline vendor/devui-themes.css (8 themes, --devui-* variables; see vendor/DESIGN.md).
2. Re-declare every derived :root custom property on <body>, so that --ap-* / derived --as-* tokens
   resolve against the DevUI values set on <body data-theme> instead of the AS2 defaults on :root.
3. Append devui-bridge.css (--as-* ← --devui-* mapping + glass / pixel / DevUI-geometry overrides).
4. Patch the demo JS: the 8 DevUI themes replace the appearance styles, <body data-theme/data-mode>
   follows the chosen theme, and the copy keeps its own localStorage keys.
"""
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent / 'agentspace2.0_mvp.as2.html'
OUT = HERE.parent / 'agentspace2.0_mvp.devui.html'

html = SRC.read_text()
head, rest = html.split('<style>', 1)
css, rest = rest.split('</style>', 1)
body, js = rest.split('<script>', 1)

# ---- 2. derived :root custom properties → body
def derived(selector_ok):
    out = []
    for sel, block in re.findall(r'(?:^|\})\s*([^{}@]+)\{([^{}]*)\}', css):
        if selector_ok(sel.strip()):
            out += [f'{k}: {v.strip()};' for k, v in re.findall(r'(--[\w-]+)\s*:\s*([^;{}]*var\([^;{}]*)', block)]
    return out
light = derived(lambda s: s == ':root')
dark = derived(lambda s: re.fullmatch(r':root\.dark|:root\[data-theme="dark"\]|:root\.dark,\s*:root\[data-theme="dark"\]', s) is not None)
rebind = ('\n/* ---- DevUI copy: derived tokens re-resolved on <body data-theme> ---- */\n'
          'body[data-theme] {\n  ' + '\n  '.join(light) + '\n}\n'
          'html.dark body[data-theme] {\n  ' + '\n  '.join(dark) + '\n}\n')

css = (css + '\n/* ==== DevUI themes (vendor/devui-themes.css) ==== */\n' + (HERE / 'vendor/devui-themes.css').read_text()
       + rebind + (HERE / 'devui-bridge.css').read_text())

# ---- 4. JS patches
def rep(old, new, count=1):
    global js
    assert old in js, 'Missing JS anchor: ' + old[:80]
    js = js.replace(old, new, count)

js, n = re.subn(r'const APPEARANCE_STYLES=\{.*?\n\};', lambda m: """const APPEARANCE_STYLES={
  'dv-ink':{name:'简约 · 浅',tone:'light',tagline:'AgentSpace · 墨色主按钮',description:'AgentSpace 现网风格：墨色主按钮、灰阶分层，蓝色只做链接 / 信息 / 选中。',devui:['as-ink']},
  'dv-ink-dark':{name:'简约 · 深',tone:'dark',tagline:'AgentSpace · 浅墨主按钮',description:'与简约浅逐变量镜像的中性深灰阶；层级越高颜色越亮，主按钮反转为浅墨。',devui:['as-ink','dark']},
  'dv-glass':{name:'流光 · 浅',tone:'light',tagline:'液态玻璃 · 极光',description:'极光渐变底 + 半透明白玻璃面 + 高光描边；运行态用蓝色流光。',devui:['as-glass']},
  'dv-glass-dark':{name:'流光 · 深',tone:'dark',tagline:'烟熏玻璃 · 深夜极光',description:'深夜极光底 + 烟熏玻璃面；面与面靠亮边与模糊区分。',devui:['as-glass','dark']},
  'dv-pixel':{name:'像素',tone:'light',tagline:'米色纸 · 硬投影',description:'米色纸底、2px 实线墨边、0 圆角、硬投影；位移代替模糊，阶跃动效。',devui:['as-pixel']},
  'dv-newinfinity':{name:'新无限',tone:'light',tagline:'DevUI 官方 · 蓝色主按钮',description:'DevUI 官方默认浅色：品牌蓝 #0a59f7 用于主按钮、链接与表单聚焦。',devui:['newInfinity-theme']},
  'dv-infinity':{name:'无限',tone:'light',tagline:'DevUI 官方 · 淡蓝',description:'DevUI 官方备选浅色：品牌淡蓝 #5e7ce0，辅助文本偏蓝灰。',devui:['default']},
  'dv-galaxy':{name:'追光',tone:'dark',tagline:'DevUI 官方 · 深色',description:'DevUI 官方深色：深底 #16181a → 区块 #2a2a2a，品牌亮蓝 #317af7。',devui:['default','dark']}
};""", js, count=1, flags=re.S)
assert n == 1, 'APPEARANCE_STYLES anchor'
# Saved AS2 styles map onto their DevUI counterparts; anything else falls back to 简约 · 浅 (DESIGN.md §2.4).
rep("if(!Object.hasOwn(APPEARANCE_STYLES,s.appearance.style))s.appearance.style='liquid';",
    "s.appearance.style={classic:'dv-ink',dark:'dv-ink-dark',liquid:'dv-glass',pixel:'dv-pixel'}[s.appearance.style]||s.appearance.style;if(!Object.hasOwn(APPEARANCE_STYLES,s.appearance.style))s.appearance.style='dv-ink';")
rep("root.style.colorScheme=themeTone(style);", "root.style.colorScheme=themeTone(style);devuiApply(style);")
# Theme cards preview their own tokens: each thumb carries the theme's data-theme / data-mode.
rep('<span class="appearance-style-thumb" data-style="${key}" aria-hidden="true">',
    '<span class="appearance-style-thumb" data-style="${key}" data-theme="${item.devui[0]}" ${item.devui[1]?\'data-mode="\'+item.devui[1]+\'"\':\'\'} aria-hidden="true">', count=-1)
# Separate saved state from the AS2 demo (same origin on GitHub Pages / localhost).
js = js.replace("agentspace-mvp", "agentspace-devui-mvp").replace("'as2-side-w'", "'devui-side-w'").replace("'as2-side-collapsed'", "'devui-side-collapsed'")
js = js.rstrip()
assert js.endswith('</script></body></html>')
js = js[:-len('</script></body></html>')] + (HERE / 'devui-theme.js').read_text() + '\n</script></body></html>'

head = head.replace('<title>', '<title>DevUI · ', 1) if '<title>' in head else head
out = head + '<style>' + css + '</style>' + body + '<script>' + js
OUT.write_text(out)
print(f'wrote {OUT.name}: {len(out)/1024:.0f} KB · {len(light)} light + {len(dark)} dark derived tokens rebound')
