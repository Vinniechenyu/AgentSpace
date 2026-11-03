# -*- coding: utf-8 -*-
"""从 source/devui-official-design.md（官方三主题）+ tokens.py（扩展主题）生成全部产物。用法: python3 build.py"""
import json
import re
import sys
from pathlib import Path

from tokens import (CATEGORIES, EXT_CATEGORIES, EXT_THEME_IDS, EXT_TOKENS,
                    THEME_IDS, THEMES, TOKENS)

ROOT = Path(__file__).parent
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)
META = {t[0]: dict(zip(("id", "name", "dark", "source", "parent", "selector", "summary"), t)) for t in THEMES}
OFFICIAL_IDS = [t for t in THEME_IDS if META[t]["source"] == "official"]
PALETTE = re.compile(r"^devui-(blue|slate|gray|zinc|green|yellow|orange|red|sky|lime|magenta|purple)-\d+$")


# ───────────────────────── 解析官方 design.md ─────────────────────────
def parse_official():
    src = (ROOT / "source" / "devui-official-design.md").read_text(encoding="utf-8")
    parts = re.split(r"^### 主题[一二三]：", src, flags=re.M)[1:]
    if len(parts) != len(OFFICIAL_IDS):
        sys.exit(f"官方文档应有 {len(OFFICIAL_IDS)} 套主题，解析到 {len(parts)} 套")
    raw, desc = {}, {}
    for tid, part in zip(OFFICIAL_IDS, parts):
        part = part.split("\n## ")[0]
        d = {}
        for m in re.finditer(r"^\| `--([\w-]+)` \| ([^|]+?) \|(?: ([^|]*?) \|)?", part, re.M):
            d[m.group(1)] = m.group(2).strip()
            if m.group(3) and m.group(3).strip() and m.group(1) not in desc:
                desc[m.group(1)] = m.group(3).strip()
        raw[tid] = d
    return raw, desc


RAW, OFFICIAL_DESC = parse_official()
OFFICIAL_VARS = sorted({k for d in RAW.values() for k in d if not PALETTE.match(k)})


# ───────────────────────── 解析 / 继承 / 校验 ─────────────────────────
ROW = {r[0]: r for r in TOKENS}
COMPAT = [r[0] for r in TOKENS if r[1] == "compat"]
missing = [v for v in OFFICIAL_VARS if v not in ROW]
if missing:
    sys.exit(f"官方变量未在 tokens.py 中登记分类/扩展取值: {missing}")
for r in TOKENS:
    if len(r) != len(EXT_THEME_IDS) + 3:
        sys.exit(f"[TOKENS] {r[0]}: 需要 {len(EXT_THEME_IDS)} 个扩展主题值")
for r in EXT_TOKENS:
    if len(r) != len(THEME_IDS) + 3:
        sys.exit(f"[EXT_TOKENS] {r[0]}: 需要 {len(THEME_IDS)} 个主题值")

RES = {}  # 每个主题解析后的完整语义变量（不含色阶）
for tid in THEME_IDS:
    m = META[tid]
    base = dict(RES[m["parent"]]) if m["parent"] else {}
    if m["source"] == "official":
        base.update({k: v for k, v in RAW[tid].items() if not PALETTE.match(k)})
        for c in COMPAT:
            base.pop(c, None)
    else:
        i = EXT_THEME_IDS.index(tid)
        for r in TOKENS:
            v = r[2 + i]
            if v is None:
                if r[0] not in base:
                    sys.exit(f"[{tid}] {r[0]} 写了 None（继承），但 parent 链上没有该变量")
            else:
                base[r[0]] = v
    for r in EXT_TOKENS:
        base[r[0]] = r[2 + THEME_IDS.index(tid)]
    RES[tid] = base

ALL_VARS = [r[0] for r in TOKENS] + [r[0] for r in EXT_TOKENS]
for tid in EXT_THEME_IDS:
    gap = [v for v in ALL_VARS if v not in RES[tid]]
    if gap:
        sys.exit(f"[{tid}] 缺少变量: {gap}")


def desc_of(name):
    return OFFICIAL_DESC.get(name) or next((r[-1] for r in TOKENS + EXT_TOKENS if r[0] == name), "")


def attrs(tid):
    sel = META[tid]["selector"]
    theme = re.search(r'data-theme="([^"]+)"', sel).group(1)
    return {"theme": theme, "mode": "dark" if 'data-mode="dark"' in sel else None}


# ───────────────────────── 对比度 ─────────────────────────
def parse(c):
    c = c.strip().lower()
    m = re.fullmatch(r"#([0-9a-f]{6})", c)
    if m:
        h = m.group(1)
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 1.0)
    m = re.fullmatch(r"rgba?\(([^)]+)\)", c)
    if m:
        p = [float(x) for x in m.group(1).split(",")]
        return (p[0], p[1], p[2], p[3] if len(p) > 3 else 1.0)
    return None


def over(fg, bg):
    a = fg[3]
    return tuple(fg[k] * a + bg[k] * (1 - a) for k in range(3)) + (1.0,)


def lum(c):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


PAIRS = [
    ("devui-text", "devui-base-bg", 4.5, "正文 / 卡片"),
    ("devui-text-weak", "devui-base-bg", 4.5, "弱化正文"),
    ("devui-aide-text", "devui-base-bg", 4.5, "辅助文本"),
    ("devui-link", "devui-base-bg", 4.5, "链接"),
    ("devui-danger-text", "devui-base-bg", 4.5, "失败文字"),
    ("devui-warning-text", "devui-base-bg", 3.0, "警告文字（多为图标旁短词，按 3:1）"),
    ("devui-success-text", "devui-base-bg", 4.5, "成功文字"),
    ("devui-ext-on-primary", "devui-primary", 4.5, "主按钮文字"),
    ("devui-light-text", "devui-brand", 3.0, "品牌色实底上的白字（复选框 / 标签）"),
    ("devui-feedback-overlay-text", "devui-feedback-overlay-bg", 4.5, "Toast / Tooltip"),
    ("devui-text", "devui-connected-overlay-bg", 4.5, "下拉菜单文字"),
    ("devui-list-item-active-text", "devui-list-item-active-bg", 4.5, "列表选中项（叠加于 base-bg）"),
    ("devui-form-control-line", "devui-form-control-bg", 1.5, "输入框边界（非文本，参考值）"),
    ("devui-placeholder", "devui-form-control-bg", 2.0, "占位符（参考值）"),
]
STACK = {"devui-list-item-active-bg": "devui-base-bg"}


def solid(tid, name):
    m = RES[tid]
    page = parse(m["devui-global-bg"])
    if name in STACK:
        page = over(parse(m[STACK[name]]), page)
    return over(parse(m[name]), page)


def contrast_rows():
    out = []
    for fg, bg, need, note in PAIRS:
        cells = []
        for t in THEME_IDS:
            if fg not in RES[t] or bg not in RES[t]:
                cells.append("—")
                continue
            b = solid(t, bg)
            r = ratio(over(parse(RES[t][fg]), b), b)
            cells.append(f"{r:.2f}" + (" ✅" if r >= need else " ⚠️"))
        out.append((f"`{fg}` / `{bg}`", f"≥{need}", note, cells))
    return out


# ───────────────────────── CSS / SCSS / LESS / TS / JSON ─────────────────────────
def block(sel, items, comment):
    return f"/* {comment} */\n{sel} {{\n" + "".join(f"  {k}: {v};\n" for k, v in items) + "}\n"


def css():
    out = ["/* AUTO-GENERATED by build.py — 不要手改。官方主题取自 source/devui-official-design.md，扩展主题取自 tokens.py */",
           "/* 切换: <html data-theme=\"…\" data-mode=\"dark\">，取值见 DESIGN.md §1 */", ""]
    out.append("/* ════════ 官方主题（原样收录，含色阶） ════════ */")
    for tid in OFFICIAL_IDS:
        out.append(block(META[tid]["selector"], [(f"--{k}", v) for k, v in RAW[tid].items()], f"{META[tid]['name']}主题"))
    out.append("/* ════════ 扩展层 · 官方主题的 devui-ext-* 取值 ════════ */")
    for tid in OFFICIAL_IDS:
        items = [("color-scheme", "dark" if META[tid]["dark"] else "light")]
        items += [(f"--{r[0]}", RES[tid][r[0]]) for r in EXT_TOKENS]
        out.append(block(META[tid]["selector"], items, f"{META[tid]['name']} · 扩展层"))
    out.append("/* ════════ AgentSpace 扩展主题（完整输出，不依赖 :root 继承） ════════ */")
    for tid in EXT_THEME_IDS:
        items = [("color-scheme", "dark" if META[tid]["dark"] else "light")]
        items += [(f"--{v}", RES[tid][v]) for v in ALL_VARS]
        out.append(block(META[tid]["selector"], items, META[tid]["name"]))
    return "\n".join(out)


def scss(prefix):
    head = "// AUTO-GENERATED by build.py — 扩展层变量（devui-ext-*）。官方 devui-* 变量继续从 devui-var 引入。\n"
    return head + "\n".join(f"{prefix}{r[0]}: var(--{r[0]}, {RES[OFFICIAL_IDS[0]][r[0]]});" for r in EXT_TOKENS) + "\n"


def ts():
    out = ["// AUTO-GENERATED by build.py — 解析后的完整主题数据，供 ng-devui ThemeService 注册",
           "import { Theme } from 'ng-devui/theme';", ""]
    names = []
    for tid in THEME_IDS:
        var = re.sub(r"-(\w)", lambda m: m.group(1).upper(), tid) + "Theme"
        names.append(var)
        data = json.dumps(RES[tid], ensure_ascii=False, indent=4)
        dark = META[tid]["dark"]
        out.append(f"export const {var}: Theme = new Theme({{\n  id: '{tid}',\n  name: '{META[tid]['name']}',\n"
                   f"  data: {data},\n  extends: '{'devui-dark-theme' if dark else 'devui-light-theme'}',\n"
                   f"  isDark: {'true' if dark else 'false'},\n}});\n")
    out.append(f"export const devuiThemes = {{ {', '.join(names)} }};\n")
    return "\n".join(out)


def tokens_json():
    return json.dumps({
        "themes": [{**{k: META[t][k] for k in ("id", "name", "dark", "source", "parent", "summary")}, **attrs(t)} for t in THEME_IDS],
        "tokens": [{"name": v, "category": (ROW.get(v) or next(r for r in EXT_TOKENS if r[0] == v))[1],
                    "description": desc_of(v), "values": {t: RES[t].get(v) for t in THEME_IDS}} for v in ALL_VARS],
        "palette": {t: {k: v for k, v in RAW[t].items() if PALETTE.match(k)} for t in OFFICIAL_IDS if any(PALETTE.match(k) for k in RAW[t])},
    }, ensure_ascii=False, indent=2)


# ───────────────────────── DESIGN.md 生成段 ─────────────────────────
def short(t):
    return META[t]["name"]


def md_table(names, cats, cat_of):
    head = "| 变量 | " + " | ".join(short(t) for t in THEME_IDS) + " | 描述 |\n"
    head += "| :--- | " + " | ".join(":---" for _ in THEME_IDS) + " | :--- |\n"
    out = []
    for key, title, note in cats:
        sub = [n for n in names if cat_of(n) == key]
        if not sub:
            continue
        out.append(f"#### {title}\n")
        if note:
            out.append(f"> {note}\n")
        body = ""
        for n in sub:
            vals, prev = [], object()
            for t in THEME_IDS:
                v = RES[t].get(n)
                vals.append("—" if v is None else ("〃" if v == prev else f"`{v}`"))
                prev = v
            body += f"| `--{n}` | " + " | ".join(vals) + f" | {desc_of(n)} |\n"
        out.append(head + body)
    return "\n".join(out)


def md_themes():
    head = "| 主题 | 来源 | `data-theme` | `data-mode` | 品牌色 | 主按钮 | 气质 |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
    rows = ""
    for t in THEME_IDS:
        a = attrs(t)
        src = "DevUI 官方" if META[t]["source"] == "official" else "AgentSpace 扩展"
        rows += (f"| **{META[t]['name']}** | {src} | `{a['theme']}` | {'`dark`' if a['mode'] else '—'} | "
                 f"`{RES[t]['devui-brand']}` | `{RES[t]['devui-primary']}` | {META[t]['summary']} |\n")
    return head + rows


def md_contrast():
    head = "| 前景 / 背景 | 要求 | 场景 | " + " | ".join(short(t) for t in THEME_IDS) + " |\n"
    head += "| :--- | :--- | :--- | " + " | ".join("---:" for _ in THEME_IDS) + " |\n"
    return head + "".join(f"| {a} | {b} | {c} | " + " | ".join(cells) + " |\n" for a, b, c, cells in contrast_rows())


def inject(text, key, content):
    pat = re.compile(rf"(<!-- GEN:{key} -->)(.*?)(<!-- /GEN:{key} -->)", re.S)
    if not pat.search(text):
        sys.exit(f"DESIGN.md 缺少标记 GEN:{key}")
    return pat.sub(lambda m: f"{m.group(1)}\n{content}\n{m.group(3)}", text)


# ───────────────────────── 写出 ─────────────────────────
theme_css = css()
(DIST / "devui-themes.css").write_text(theme_css, encoding="utf-8")
(DIST / "devui-theme-ext.scss").write_text(scss("$"), encoding="utf-8")
(DIST / "devui-theme-ext.less").write_text(scss("@"), encoding="utf-8")
(DIST / "devui-themes.ts").write_text(ts(), encoding="utf-8")
(DIST / "tokens.json").write_text(tokens_json(), encoding="utf-8")

design = ROOT / "DESIGN.md"
text = design.read_text(encoding="utf-8")
text = inject(text, "themes", md_themes())
text = inject(text, "mapping", md_table([r[0] for r in TOKENS], CATEGORIES, lambda n: ROW[n][1]))
text = inject(text, "ext", md_table([r[0] for r in EXT_TOKENS], EXT_CATEGORIES, lambda n: next(r[1] for r in EXT_TOKENS if r[0] == n)))
text = inject(text, "contrast", md_contrast())
design.write_text(text, encoding="utf-8")

tpl = (ROOT / "preview.template.html").read_text(encoding="utf-8")
overrides = (DIST / "devui-theme-overrides.css").read_text(encoding="utf-8")
cat_of = {r[0]: r[1] for r in TOKENS + EXT_TOKENS}
cat_rank = {c[0]: i for i, c in enumerate(CATEGORIES + EXT_CATEGORIES)}
ALL_VARS_SORTED = sorted(ALL_VARS, key=lambda v: cat_rank[cat_of[v]])
data = {"themes": [{"id": t, "name": META[t]["name"], "dark": META[t]["dark"], "source": META[t]["source"], **attrs(t)} for t in THEME_IDS],
        "rows": [[v, cat_of[v], desc_of(v)] + [RES[t].get(v) for t in THEME_IDS] for v in ALL_VARS_SORTED]}
html = (tpl.replace("/*__THEME_CSS__*/", theme_css)
           .replace("/*__OVERRIDES_CSS__*/", overrides)
           .replace("__TOKEN_DATA__", json.dumps(data, ensure_ascii=False)))
(ROOT / "preview.html").write_text(html, encoding="utf-8")

warn = sum(c.count("⚠️") for *_, cells in contrast_rows() for c in cells)
print(f"OK · 官方语义变量 {len(OFFICIAL_VARS)} + 兼容 {len(COMPAT)} + 扩展 {len(EXT_TOKENS)} · "
      f"{len(OFFICIAL_IDS)} 官方 + {len(EXT_THEME_IDS)} 扩展主题 · 对比度告警 {warn} 项")
