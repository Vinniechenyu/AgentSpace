# -*- coding: utf-8 -*-
"""
DevUI 多主题 · 唯一数据源 (single source of truth)

一行 = 一个 DevUI 变量在 5 个主题下的取值。改值只改这里，然后运行:
    python3 build.py
会重新生成 DESIGN.md 中的映射表 / 对比度表、dist/ 下的 CSS/SCSS/LESS/TS/JSON，以及 preview.html。

列顺序固定为 THEMES 的顺序；任何一格缺失，build 会直接报错——这就是"变量 ↔ 色值可映射"的保证。
"""

# 主题分两类：
#   official  —— DevUI 官方三套主题，取值由 build.py 从 source/devui-official-design.md 解析，这里不重复录入；
#   extension —— AgentSpace 扩展主题，取值来自下方 TOKENS / EXT_TOKENS 表；表中写 None 表示继承 parent 主题。
# 选择器沿用官方约定：data-theme 选主题族，data-mode="dark" 选深色。
THEMES = [
    # id,              名称,                    isDark, 来源,        parent,              选择器,                                              一句话气质
    ("newInfinity",    "新无限",                 False, "official",  None,                ':root,\n[data-theme="newInfinity-theme"]',          "官方默认浅色。品牌蓝 #0a59f7，蓝色主按钮。"),
    ("infinity",       "无限",                   False, "official",  "newInfinity",       '[data-theme="default"]',                            "官方备选浅色。品牌淡蓝 #5e7ce0。"),
    ("galaxy",         "追光",                   True,  "official",  "infinity",          '[data-theme="default"][data-mode="dark"]',          "官方深色。品牌亮蓝 #317af7。"),
    ("as-ink",         "简约 · 浅（墨）",         False, "extension", "newInfinity",       '[data-theme="as-ink"]',                             "AgentSpace 现网风格：墨色主按钮、灰阶分层，蓝色只做链接 / 信息 / 选中。"),
    ("as-ink-dark",    "简约 · 深（墨）",         True,  "extension", "as-ink",            '[data-theme="as-ink"][data-mode="dark"]',           "与简约浅逐变量镜像的中性深灰阶；主按钮反转为浅墨。"),
    ("as-glass",       "流光 · 液态玻璃 · 浅",    False, "extension", "newInfinity",       '[data-theme="as-glass"]',                           "极光渐变底 + 半透明白玻璃面 + 高光描边；焦点 / 运行态用蓝色流光。"),
    ("as-glass-dark",  "流光 · 液态玻璃 · 深",    True,  "extension", "as-glass",          '[data-theme="as-glass"][data-mode="dark"]',         "深夜极光底 + 烟熏玻璃面；面与面靠亮边与模糊区分。"),
    ("as-pixel",       "像素风",                 False, "extension", "newInfinity",       '[data-theme="as-pixel"]',                           "米色纸底、2px 实线墨边、0 圆角、硬投影；位移代替模糊，阶跃动效。"),
]
THEME_IDS = [t[0] for t in THEMES]
EXT_THEME_IDS = [t[0] for t in THEMES if t[3] == "extension"]   # TOKENS 表的 5 列按此顺序

# 分类: (key, 标题, 说明)。官方变量若未在 TOKENS 中出现，build 会按前缀自动归类。
CATEGORIES = [
    ("font",    "字号与字重",   "字号不随主题变化，保证布局稳定；像素风通过扩展字体族改变气质而非改字号。"),
    ("shadow-length", "阴影几何", "用法为 `box-shadow: var(--devui-shadow-length-xxx) var(--devui-xxx-shadow)`。像素风把几何改为零模糊硬位移，玻璃风改为大半径柔光。"),
    ("radius",  "圆角",        ""),
    ("bg",      "背景色",      "玻璃主题中大多数面为半透明色值，必须配合扩展层的 `material-blur` 才成立（见 §8）。"),
    ("status",  "品牌与状态色", ""),
    ("text",    "文字 / 图标色", ""),
    ("line",    "边框色",      ""),
    ("shadow",  "阴影色",      "像素风全部为实色墨，配合零模糊几何形成硬投影。"),
    ("button",  "按钮",        "官方按钮专属变量。"),
    ("motion",  "动效",        "像素风把所有缓动曲线改为 `steps(3, end)`，玻璃风放慢并改为弹性减速曲线。"),
    ("zindex",  "层级",        "所有主题一致。"),
    ("compat",  "兼容变量（非官方）", "官方 design.md 未列出，但 AgentSpace 现网变量表或开源 ng-devui 组件在用。只在扩展主题中输出；官方主题下为 —（组件使用自身回退值）。"),
]

# (变量名, 分类, as-ink, as-ink-dark, as-glass, as-glass-dark, as-pixel, 描述)。None = 继承 parent。
TOKENS = [
    # ───────── 字号 ─────────
    ("devui-font-size",               "font", "14px", "14px", "14px", "14px", "14px", "正文，帮助信息，补充信息"),
    ("devui-font-size-card-title",    "font", "16px", "16px", "16px", "16px", "16px", "卡片标题"),
    ("devui-font-size-page-title",    "font", "16px", "16px", "16px", "16px", "16px", "页面标题"),
    ("devui-font-size-modal-title",   "font", "18px", "18px", "18px", "18px", "18px", "弹窗标题、数字"),
    ("devui-font-size-price",         "font", "20px", "20px", "20px", "20px", "20px", "购买价格"),
    ("devui-font-size-data-overview", "font", "24px", "24px", "24px", "24px", "24px", "数据总览"),
    ("devui-font-size-icon",          "font", "16px", "16px", "16px", "16px", "16px", "图标大小"),
    ("devui-font-size-sm",            "font", "12px", "12px", "12px", "12px", "12px", "小控件文字大小"),
    ("devui-font-size-md",            "font", "14px", "14px", "14px", "14px", "14px", "中控件文字大小"),
    ("devui-font-size-lg",            "font", "14px", "14px", "14px", "14px", "14px", "大控件文字大小"),
    ("devui-font-content-weight",     "font", "normal", "normal", "normal", "normal", "normal", "内容文字粗细"),
    ("devui-line-height-base",        "font", "1.5", "1.5", "1.5", "1.5", "1.5", "规范行高"),
    ("devui-font-size-h1-title",      "compat", "28px", "28px", "28px", "28px", "28px", "一级标题"),
    ("devui-font-size-h2-title",      "compat", "24px", "24px", "24px", "24px", "24px", "二级标题"),
    ("devui-font-size-h3-title",      "compat", "20px", "20px", "20px", "20px", "20px", "三级标题"),
    ("devui-font-size-h4-title",      "compat", "18px", "18px", "18px", "18px", "18px", "四级标题"),
    ("devui-font-size-h5-title",      "compat", "16px", "16px", "16px", "16px", "16px", "五级标题"),
    ("devui-font-title-weight",       "font", "bold", "bold", "600", "600", "normal", "标题文字粗细（像素字体无粗体）"),

    # ───────── 阴影几何 ─────────
    ("devui-shadow-length-base",               "shadow-length", "0 2px 6px 0",   "0 2px 6px 0",   "0 8px 24px 0",   "0 8px 24px 0",   "4px 4px 0 0",  "直接铺陈在页面上方的元素 (Card 等)"),
    ("devui-shadow-length-slide-left",         "shadow-length", "-2px 0 8px 0",  "-2px 0 8px 0",  "-4px 0 16px 0",  "-4px 0 16px 0",  "-3px 0 0 0",   "向左滑动时右侧边缘阴影 (表格固定右列)"),
    ("devui-shadow-length-slide-right",        "shadow-length", "2px 0 8px 0",   "2px 0 8px 0",   "4px 0 16px 0",   "4px 0 16px 0",   "3px 0 0 0",    "向右滑动时左侧边缘阴影 (表格固定左列)"),
    ("devui-shadow-length-connected-overlay",  "shadow-length", "0 2px 12px 0",  "0 2px 12px 0",  "0 12px 32px 0",  "0 12px 32px 0",  "4px 4px 0 0",  "有连接点的弹出层 (Select/DatePicker 下拉等)"),
    ("devui-shadow-length-hover",              "shadow-length", "0 4px 16px 0",  "0 4px 16px 0",  "0 16px 40px 0",  "0 16px 40px 0",  "6px 6px 0 0",  "涉及 hover 的地方"),
    ("devui-shadow-length-feedback-overlay",   "shadow-length", "0 4px 16px 0",  "0 4px 16px 0",  "0 16px 40px 0",  "0 16px 40px 0",  "4px 4px 0 0",  "信息反馈类 (Popover/Tooltip/Toast) 及大卡片"),
    ("devui-shadow-length-fullscreen-overlay", "shadow-length", "0 10px 24px 0", "0 10px 24px 0", "0 24px 64px 0",  "0 24px 64px 0",  "8px 8px 0 0",  "无连接点的弹出层 (Drawer/Modal 等)"),

    # ───────── 圆角 ─────────
    ("devui-border-radius",          "radius", "6px", "6px", "12px", "12px", "0px", "一般圆角"),
    ("devui-border-radius-feedback", "radius", "6px", "6px", "14px", "14px", "0px", "反馈类圆角"),
    ("devui-border-radius-card",     "radius", "8px", "8px", "20px", "20px", "0px", "卡片圆角"),
    ("devui-border-radius-full",     "radius", "100px", "100px", "100px", "100px", "0px", "开关、进度条等全圆角"),

    # ───────── 背景色 ─────────
    ("devui-global-bg",                 "bg", "#f5f5f5", "#141415", "#eef1f8", "#0b0d14", "#f4efe1", "全局带底色背景（玻璃主题为纯色兜底，实际底图见 ext-backdrop）"),
    ("devui-glass-morphism-bg",         "bg", "rgba(245, 245, 245, 0.9)", "rgba(20, 20, 21, 0.9)", "rgba(255, 255, 255, 0.55)", "rgba(20, 23, 34, 0.6)", "#f4efe1", "毛玻璃样式背景色（像素风取消透明）"),
    ("devui-glass-morphism-overlay-bg", "bg", "rgba(255, 255, 255, 0.9)", "rgba(36, 36, 38, 0.9)", "rgba(255, 255, 255, 0.72)", "rgba(30, 34, 48, 0.72)", "#fffdf6", "毛玻璃浮层背景"),
    ("devui-glass-morphism-floating-container-bg", "bg", "rgba(255, 255, 255, 0.9)", "rgba(36, 36, 38, 0.9)", "rgba(255, 255, 255, 0.72)", "rgba(30, 34, 48, 0.72)", "#fffdf6", "毛玻璃悬浮容器背景"),
    ("devui-global-bg-normal",          "bg", "#ffffff", "#1c1c1e", "rgba(255, 255, 255, 0.62)", "rgba(28, 32, 46, 0.55)", "#fffdf6", "全局白色背景"),
    ("devui-base-bg",                   "bg", "#ffffff", "#1c1c1e", "rgba(255, 255, 255, 0.62)", "rgba(28, 32, 46, 0.55)", "#fffdf6", "基础区块背景"),
    ("devui-base-bg-dark",              "bg", "#252b3a", "#0d0d0e", "#1b1f2e", "#05060a", "#1d1b26", "基础区块背景深色（固定）"),
    ("devui-icon-hover-bg",             "bg", "#f5f5f5", "#2a2a2d", "rgba(15, 23, 42, 0.06)", "rgba(255, 255, 255, 0.08)", "#ece4cf", "图标按钮悬停底"),
    ("devui-icon-active-bg",            "bg", "#f5f5f5", "#2f2f33", "rgba(15, 23, 42, 0.1)", "rgba(255, 255, 255, 0.12)", "#e2d7bb", "图标按钮激活底"),
    ("devui-block",                     "compat", "#ffffff", "#1c1c1e", "rgba(255, 255, 255, 0.55)", "rgba(24, 28, 40, 0.55)", "#fffdf6", "大面积不可折叠区块（顶部导航等）"),
    ("devui-area",                      "bg", "#f5f5f5", "#232326", "rgba(255, 255, 255, 0.38)", "rgba(255, 255, 255, 0.04)", "#f4efe1", "可折叠区块（展开区域）"),
    ("devui-icon-bg",                   "bg", "#ffffff", "#1c1c1e", "rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.06)", "#fffdf6", "svg 图标背景色"),
    ("devui-form-control-bg",           "bg", "#ffffff", "#1f1f22", "rgba(255, 255, 255, 0.72)", "rgba(255, 255, 255, 0.06)", "#ffffff", "表单控件背景色"),
    ("devui-list-item-active-bg",       "bg", "#e6e6e6", "#303034", "rgba(15, 23, 42, 0.08)", "rgba(255, 255, 255, 0.12)", "#ffd84d", "列表单选选中背景"),
    ("devui-list-item-active-hover-bg", "bg", "#d5d5db", "#3a3a3f", "rgba(15, 23, 42, 0.12)", "rgba(255, 255, 255, 0.16)", "#ffcc1a", "列表单选选中悬停（分页等）"),
    ("devui-list-item-hover-bg",        "bg", "#f5f5f5", "#2a2a2d", "rgba(15, 23, 42, 0.05)", "rgba(255, 255, 255, 0.07)", "#ece4cf", "列表普通选项悬停背景"),
    ("devui-list-item-selected-bg",     "bg", "#d5d5db", "#34343a", "rgba(10, 89, 247, 0.1)", "rgba(77, 140, 255, 0.18)", "#c9e4ff", "列表多选被选中行（表格）"),
    ("devui-list-item-strip-bg",        "bg", "#f2f5fc", "#202024", "rgba(255, 255, 255, 0.35)", "rgba(255, 255, 255, 0.03)", "#f8f3e6", "表格斑马纹"),
    ("devui-disabled-bg",               "bg", "#ebebeb", "#2a2a2c", "rgba(15, 23, 42, 0.05)", "rgba(255, 255, 255, 0.05)", "#e6e0d0", "禁用背景"),
    ("devui-disabled-fill-bg",          "bg", "#f0f0f0", "#262628", "rgba(15, 23, 42, 0.04)", "rgba(255, 255, 255, 0.04)", "#ece6d6", "禁用填充背景"),
    ("devui-primary-disabled",          "bg", "#f0f0f0", "#2a2a2c", "rgba(15, 23, 42, 0.06)", "rgba(255, 255, 255, 0.06)", "#e6e0d0", "主要按钮禁用背景"),
    ("devui-label-bg",                  "bg", "#f0f0f0", "#2c2c2f", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.08)", "#ece4cf", "默认标签背景"),
    ("devui-connected-overlay-bg",      "bg", "#ffffff", "#26262a", "rgba(255, 255, 255, 0.78)", "rgba(32, 36, 52, 0.78)", "#fffdf6", "有连接点的弹出菜单背景"),
    ("devui-fullscreen-overlay-bg",     "bg", "#ffffff", "#232326", "rgba(255, 255, 255, 0.82)", "rgba(28, 32, 46, 0.82)", "#fffdf6", "全屏弹出内容层（模态弹窗）"),
    ("devui-feedback-overlay-bg",       "bg", "#2a2a2a", "#3a3a3e", "rgba(28, 32, 46, 0.78)", "rgba(240, 244, 255, 0.9)", "#1d1b26", "反馈浮层背景（toast/popover）"),
    ("devui-feedback-overlay-backdrop", "bg", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.6)", "rgba(15, 23, 42, 0.18)", "rgba(0, 0, 0, 0.5)", "rgba(29, 27, 38, 0.5)", "弹窗 / 抽屉遮罩层"),
    ("devui-feedback-overlay-light-backdrop", "compat", "rgba(255, 255, 255, 0.6)", "rgba(20, 20, 21, 0.6)", "rgba(255, 255, 255, 0.5)", "rgba(11, 13, 20, 0.6)", "rgba(244, 239, 225, 0.8)", "加载遮罩层"),
    ("devui-embed-search-bg",           "bg", "#f2f2f3", "#26262a", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.06)", "#f4efe1", "嵌套无边框搜索框"),
    ("devui-embed-search-bg-hover",     "bg", "#eef0f5", "#2c2c30", "rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.1)", "#ece4cf", "嵌套无边框搜索框悬停"),
    ("devui-highlight-overlay",         "bg", "rgba(255, 255, 255, 0.8)", "rgba(20, 20, 21, 0.8)", "rgba(255, 255, 255, 0.6)", "rgba(11, 13, 20, 0.6)", "rgba(244, 239, 225, 0.9)", "局部半透明全局浮层（底部等）"),
    ("devui-range-item-hover-bg",       "bg", "#f5f5f5", "#2a2a2d", "rgba(15, 23, 42, 0.05)", "rgba(255, 255, 255, 0.07)", "#ece4cf", "范围内 hover（日期范围）"),
    ("devui-gray-form-control-bg",      "bg", "rgba(223, 223, 223, 0.5)", "rgba(255, 255, 255, 0.06)", "rgba(255, 255, 255, 0.45)", "rgba(255, 255, 255, 0.06)", "#ece4cf", "灰底表单控件"),
    ("devui-gray-form-control-hover-bg","bg", "#c9c9c9", "rgba(255, 255, 255, 0.12)", "rgba(255, 255, 255, 0.65)", "rgba(255, 255, 255, 0.1)", "#e2d7bb", "灰底表单控件悬停"),
    ("devui-nav-expand-bg",             "bg", "#fafafa", "#18181a", "rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0.03)", "#f8f3e6", "导航展开区背景"),
    ("devui-danger-bg",                 "bg", "#fce2e0", "#3d1d1d", "rgba(242, 48, 48, 0.12)", "rgba(255, 90, 95, 0.16)", "#ffd6d1", "失败底色"),
    ("devui-warning-bg",                "bg", "#ffebd1", "#3d2a12", "rgba(255, 136, 0, 0.14)", "rgba(255, 165, 61, 0.16)", "#ffe7b8", "警告底色"),
    ("devui-info-bg",                   "bg", "#cedefd", "#14254a", "rgba(10, 89, 247, 0.12)", "rgba(77, 140, 255, 0.18)", "#cfe0ff", "通知底色"),
    ("devui-success-bg",                "bg", "#d5f2dc", "#10331d", "rgba(0, 179, 54, 0.12)", "rgba(52, 211, 113, 0.16)", "#cdf2c8", "成功底色"),
    ("devui-primary-bg",                "bg", "#e6eeff", "#172440", "rgba(10, 89, 247, 0.08)", "rgba(77, 140, 255, 0.12)", "#dfe8ff", "主要底色"),
    ("devui-default-bg",                "bg", "#f7f8fa", "#222225", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.05)", "#f4efe1", "默认底色"),
    ("devui-btn-common-bg",             "button", "#ffffff", "#1f1f22", "rgba(255, 255, 255, 0.66)", "rgba(255, 255, 255, 0.08)", "#fffdf6", "次要按钮背景"),
    ("devui-btn-common-bg-disabled",    "button", "#f0f0f0", "#2a2a2c", "rgba(15, 23, 42, 0.05)", "rgba(255, 255, 255, 0.04)", "#e6e0d0", "次要按钮禁用背景"),
    ("devui-btn-common-bg-hover",       "button", "#ffffff", "#26262a", "rgba(255, 255, 255, 0.85)", "rgba(255, 255, 255, 0.12)", "#fff6d6", "次要按钮悬停背景"),
    ("devui-btn-common-bg-active",      "button", "#ffffff", "#2c2c30", "rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.16)", "#ffe9a8", "次要按钮激活背景"),
    ("devui-btn-primary-bg-disabled",   "compat", "#f0f0f0", "#2a2a2c", "rgba(15, 23, 42, 0.06)", "rgba(255, 255, 255, 0.06)", "#e6e0d0", "主要按钮禁用背景"),

    # ───────── 状态色 ─────────
    ("devui-brand",               "status", "#0a59f7", "#3d7bff", "#0a59f7", "#4d8cff", "#0a59f7", "品牌色：Tabs 选中、复选/单选/开关选中、下拉选中等（简约主题按 AgentSpace 规则取蓝）"),
    ("devui-brand-foil",          "status", "#f2f2f3", "#2a2a2d", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.08)", "#ece4cf", "品牌色辅助色 / 正衬色"),
    ("devui-brand-hover",         "status", "#3a7bff", "#5c93ff", "#3a7bff", "#7aa7ff", "#3a7bff", "品牌色悬停（加亮）"),
    ("devui-brand-active",        "status", "#0950de", "#2f6af0", "#0950de", "#3a78f0", "#0640b3", "品牌色激活（加深）"),
    ("devui-brand-active-focus",  "status", "#073fae", "#1e4fc2", "#073fae", "#2a5cc7", "#04308a", "品牌色焦点（重度加深）"),
    ("devui-contrast",        "status", "#c7000b", "#ff4d55", "#c7000b", "#ff4d55", "#e4002b", "品牌撞色 / 第二品牌色"),
    ("devui-danger",          "status", "#f23030", "#f5484d", "#f23030", "#ff5a5f", "#e43b44", "失败、错误、告警"),
    ("devui-warning",         "status", "#ff8800", "#ff9a2e", "#ff8800", "#ffa53d", "#f77622", "警告、需注意"),
    ("devui-waiting",         "status", "#6b9bfa", "#4f7fd9", "#6b9bfa", "#6b9bfa", "#5b8cff", "等待中"),
    ("devui-success",         "status", "#00b336", "#1fbf55", "#00b336", "#34d371", "#3e8948", "成功、正确"),
    ("devui-info",            "status", "#0a59f7", "#3d7bff", "#0a59f7", "#4d8cff", "#0a59f7", "通知、一般提示、执行中"),
    ("devui-initial",         "status", "#cedefd", "#1e3466", "rgba(10, 89, 247, 0.18)", "rgba(77, 140, 255, 0.24)", "#cfe0ff", "初始化、未执行"),
    ("devui-unavailable",     "status", "#f5f5f5", "#2a2a2c", "rgba(15, 23, 42, 0.05)", "rgba(255, 255, 255, 0.06)", "#e6e0d0", "不可用、禁用"),
    ("devui-primary",         "status", "#191919", "#ededed", "#0f172a", "#f1f5ff", "#1d1b26", "主要按钮（同品牌色）"),
    ("devui-primary-hover",   "status", "#595959", "#d4d4d4", "#334155", "#ffffff", "#3a3646", "主要按钮悬停"),
    ("devui-primary-active",  "status", "#595959", "#bdbdbd", "#1e293b", "#d6deef", "#000000", "主要按钮激活"),
    ("devui-contrast-hover",  "status", "#cc272a", "#ff6b71", "#cc272a", "#ff7076", "#ff2a4a", "突出按钮悬停"),
    ("devui-contrast-active", "status", "#78080e", "#b3000a", "#78080e", "#b3000a", "#9e001e", "突出按钮激活"),

    # ───────── 文字 / 图标 ─────────
    ("devui-text",                   "text", "#191919", "#ededed", "#0f172a", "#eef2ff", "#1d1b26", "正文文本"),
    ("devui-text-weak",              "text", "#575d6c", "#b4b4b8", "#475569", "#b6bdd1", "#4a4658", "弱化正文（手风琴子项、表头）"),
    ("devui-aide-text",              "text", "#595959", "#9a9a9f", "#5b6478", "#9aa3ba", "#5f5a6e", "辅助文本、帮助信息（面包屑）"),
    ("devui-aide-text-hover",        "text", "#252b3a", "#ededed", "#0f172a", "#ffffff", "#1d1b26", "辅助文本悬浮色"),
    ("devui-aide-text-stress",       "text", "#575d6c", "#c4c4c8", "#475569", "#c3cadc", "#4a4658", "辅助文本强调色"),
    ("devui-placeholder",            "text", "#babbc0", "#5f5f64", "#94a3b8", "#5f6782", "#9c96a8", "占位符"),
    ("devui-light-text",             "text", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#fffdf6", "有色深色背景上的文字（固定）"),
    ("devui-dark-text",              "text", "#252b3a", "#252b3a", "#252b3a", "#252b3a", "#1d1b26", "有色浅色背景上的文字（固定）"),
    ("devui-link",                   "text", "#0a59f7", "#5c93ff", "#0a59f7", "#7aa7ff", "#0a59f7", "链接文本"),
    ("devui-link-active",            "text", "#0950de", "#85adff", "#0950de", "#a8c5ff", "#0640b3", "链接悬停 / 激活"),
    ("devui-link-light",             "text", "#6b9bfa", "#6b9bfa", "#6b9bfa", "#6b9bfa", "#7fb0ff", "深色背景下链接（固定）"),
    ("devui-link-light-active",      "text", "#beccfa", "#beccfa", "#beccfa", "#beccfa", "#c9e4ff", "深色背景下链接悬停（固定）"),
    ("devui-link-disabled",          "text", "#777777", "#6a6a6e", "#94a3b8", "#5f6782", "#9c96a8", "链接禁用"),
    ("devui-danger-text",            "text", "#f23030", "#ff6b6f", "#cc1f24", "#ff7a7f", "#c42430", "失败文字"),
    ("devui-warning-text",           "text", "#ff8800", "#ffa64d", "#d97000", "#ffb366", "#b85a00", "警告文字"),
    ("devui-success-text",           "text", "#029931", "#3fd06f", "#027a2a", "#4ade80", "#2e6b36", "成功文字"),
    ("devui-icon-text",              "text", "#808080", "#8a8a8f", "#64748b", "#9aa3ba", "#5f5a6e", "文字图标颜色"),
    ("devui-icon-fill",              "text", "#191919", "#ededed", "#0f172a", "#eef2ff", "#1d1b26", "svg 图标填充色"),
    ("devui-icon-fill-weak",         "text", "#777777", "#8a8a8f", "#64748b", "#8790a8", "#5f5a6e", "弱化图标填充色"),
    ("devui-icon-fill-hover",        "text", "#191919", "#ffffff", "#0f172a", "#ffffff", "#1d1b26", "图标悬停"),
    ("devui-icon-fill-active",       "text", "#191919", "#ffffff", "#0f172a", "#ffffff", "#1d1b26", "图标激活"),
    ("devui-icon-fill-active-hover", "text", "#252b3a", "#d4d4d4", "#334155", "#d6deef", "#3a3646", "图标激活悬停"),
    ("devui-shape-icon-fill",        "text", "#939393", "#7a7a7f", "#94a3b8", "#7c859d", "#8b8598", "面型图标填充"),
    ("devui-shape-icon-fill-hover",  "text", "#777777", "#9a9a9f", "#64748b", "#9aa3ba", "#5f5a6e", "面型图标悬停"),
    ("devui-shape-icon-fill-active", "text", "#777777", "#9a9a9f", "#64748b", "#9aa3ba", "#5f5a6e", "面型图标激活"),
    ("devui-shape-icon-fill-disabled","text","#dfdfdf", "#3a3a3e", "rgba(15, 23, 42, 0.15)", "rgba(255, 255, 255, 0.14)", "#d4cdbb", "面型图标禁用"),
    ("devui-list-item-active-text",  "text", "#191919", "#ededed", "#0f172a", "#eef2ff", "#1d1b26", "列表单选选中文字"),
    ("devui-list-item-hover-text",   "text", "#191919", "#ededed", "#0f172a", "#eef2ff", "#1d1b26", "列表悬停文字"),
    ("devui-disabled-text",          "text", "#c2c2c2", "#5a5a5e", "rgba(15, 23, 42, 0.32)", "rgba(238, 242, 255, 0.3)", "#a8a294", "禁用文字"),
    ("devui-icon-fill-active-disabled","text","#595959","#6a6a6e", "#64748b", "#5f6782", "#8b8598", "图标激活态禁用"),
    ("devui-feedback-overlay-text",  "text", "#dfe1e6", "#ededed", "#f1f5f9", "#0f172a", "#fffdf6", "反馈浮层文字"),
    ("devui-btn-common-text-disabled","compat","#c2c2c2", "#5a5a5e", "rgba(15, 23, 42, 0.32)", "rgba(238, 242, 255, 0.3)", "#a8a294", "次要按钮禁用文字"),
    ("devui-btn-primary-text-disabled","compat","#c2c2c2","#5a5a5e", "rgba(15, 23, 42, 0.32)", "rgba(238, 242, 255, 0.3)", "#a8a294", "主要按钮禁用文字"),

    # ───────── 边框 ─────────
    ("devui-line",                          "line", "#c2c2c2", "#3a3a3f", "rgba(15, 23, 42, 0.14)", "rgba(255, 255, 255, 0.12)", "#1d1b26", "边框分割线（仅边框）"),
    ("devui-dividing-line",                 "line", "#d5d5db", "#2c2c30", "rgba(15, 23, 42, 0.08)", "rgba(255, 255, 255, 0.07)", "#d4c9ac", "内容分割线"),
    ("devui-form-control-line",             "line", "#c2c2c2", "#3f3f44", "rgba(15, 23, 42, 0.24)", "rgba(255, 255, 255, 0.14)", "#1d1b26", "表单控件边框"),
    ("devui-form-control-line-hover",       "line", "#191919", "#8a8a8f", "rgba(15, 23, 42, 0.4)", "rgba(255, 255, 255, 0.32)", "#1d1b26", "表单控件边框悬停"),
    ("devui-form-control-line-active",      "line", "#191919", "#ededed", "#0a59f7", "#4d8cff", "#0a59f7", "表单控件聚焦边框"),
    ("devui-form-control-interactive-outline","line","rgba(25, 25, 25, 0.08)", "rgba(237, 237, 237, 0.1)", "rgba(10, 89, 247, 0.16)", "rgba(77, 140, 255, 0.2)", "#9cc0ff", "表单控件聚焦外环"),
    ("devui-form-control-line-active-hover","line", "#595959", "#c4c4c8", "#3a7bff", "#7aa7ff", "#0640b3", "聚焦且悬停边框"),
    ("devui-disabled-line",                 "line", "#c9c9c9", "#333337", "rgba(15, 23, 42, 0.1)", "rgba(255, 255, 255, 0.08)", "#b8b09c", "禁用边框"),
    ("devui-connected-overlay-line",        "line", "#191919", "#5a5a5f", "rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.18)", "#1d1b26", "有连接点弹出菜单边框"),
    ("devui-danger-line",                   "line", "#f66f6a", "#b8423f", "#f66f6a", "#d9534f", "#c42430", "失败边框"),
    ("devui-warning-line",                  "line", "#fa9841", "#b86b25", "#fa9841", "#e08a2e", "#d86a00", "警告边框"),
    ("devui-info-line",                     "line", "#0a59f7", "#3d7bff", "#0a59f7", "#4d8cff", "#0a59f7", "通知边框"),
    ("devui-success-line",                  "line", "#50d4ab", "#2a9a5c", "#50d4ab", "#2fae63", "#3e8948", "成功边框"),
    ("devui-primary-line",                  "line", "#0a59f7", "#3d7bff", "#0a59f7", "#4d8cff", "#0a59f7", "主要边框"),
    ("devui-default-line",                  "line", "#5e7ce0", "#6b85e6", "#5e7ce0", "#7b93ea", "#1d1b26", "默认边框"),
    ("devui-form-control-line-rippling",    "line", "rgba(25, 25, 25, 0.05)", "rgba(237, 237, 237, 0.06)", "rgba(10, 89, 247, 0.08)", "rgba(77, 140, 255, 0.1)", "rgba(10, 89, 247, 0.15)", "表单控件涟漪"),

    # ───────── 阴影色 ─────────
    ("devui-shadow",                     "shadow", "rgba(37, 43, 58, 0.24)", "rgba(0, 0, 0, 0.5)",  "rgba(15, 23, 42, 0.16)", "rgba(0, 0, 0, 0.45)", "#1d1b26", "阴影色"),
    ("devui-light-shadow",               "shadow", "rgba(37, 43, 58, 0.12)", "rgba(0, 0, 0, 0.32)", "rgba(15, 23, 42, 0.08)", "rgba(0, 0, 0, 0.28)", "#1d1b26", "弱化阴影色"),
    ("devui-connected-overlay-shadow",   "shadow", "rgba(37, 43, 58, 0.16)", "rgba(0, 0, 0, 0.48)", "rgba(15, 23, 42, 0.14)", "rgba(0, 0, 0, 0.4)",  "#1d1b26", "有连接点弹出层阴影色"),
    ("devui-feedback-overlay-shadow",    "shadow", "rgba(37, 43, 58, 0.2)",  "rgba(0, 0, 0, 0.5)",  "rgba(15, 23, 42, 0.18)", "rgba(0, 0, 0, 0.45)", "#1d1b26", "信息反馈类阴影色"),
    ("devui-hover-shadow",               "shadow", "rgba(37, 43, 58, 0.2)",  "rgba(0, 0, 0, 0.5)",  "rgba(15, 23, 42, 0.16)", "rgba(0, 0, 0, 0.45)", "#1d1b26", "悬浮阴影色"),
    ("devui-float-block-shadow",         "shadow", "rgba(10, 89, 247, 0.24)","rgba(61, 123, 255, 0.32)", "rgba(10, 89, 247, 0.24)", "rgba(77, 140, 255, 0.32)", "#1d1b26", "特殊浮层（原表在背景与阴影两处重复列出，此处合并）"),
    ("devui-table-column-shadow-color",  "shadow", "rgba(0, 0, 0, 0.08)",    "rgba(0, 0, 0, 0.4)",  "rgba(15, 23, 42, 0.06)", "rgba(0, 0, 0, 0.32)", "#1d1b26", "表格固定列阴影色"),
    # ───────── 官方新增变量（扩展主题取值；None = 继承 parent） ─────────
    ("devui-logo",                 "status", "#c7000b", None, None, None, "#e4002b", "Logo 颜色"),
    ("devui-place",                "text",   "#aeaeae", "#5f5f64", "#94a3b8", "#5f6782", "#9c96a8", "占位色"),
    ("devui-light-line",           "line",   "#f0f0f0", "#262628", "rgba(15, 23, 42, 0.05)", "rgba(255, 255, 255, 0.05)", "#e6dcc2", "浅色分割线"),
    ("devui-link-light-disabled",  "text",   "#777777", "#4a4a4f", "#94a3b8", "#4a5068", "#9c96a8", "深色背景下链接禁用色"),
    ("devui-table-expand-area-bg", "bg",     "#ebebeb", "#232326", "rgba(255, 255, 255, 0.38)", "rgba(255, 255, 255, 0.04)", "#ece4cf", "表格展开区域背景"),
    ("devui-border-radius-card-xl","radius", "16px", None, "28px", None, "0px", "大卡片圆角"),
    ("devui-icon-active-color",    "text",   "#191919", "#ffffff", "#0a59f7", "#ffffff", "#1d1b26", "图标激活颜色"),
    ("devui-btn-sm-padding",       "button", None, None, None, None, None, "小按钮内边距"),
    ("devui-btn-padding",          "button", None, None, None, None, None, "默认按钮内边距"),
    ("devui-btn-lg-padding",       "button", None, None, None, None, None, "大按钮内边距"),
    ("devui-btn-common-border-color",        "button", "#c2c2c2", "#3f3f44", "rgba(15, 23, 42, 0.14)", "rgba(255, 255, 255, 0.14)", "#1d1b26", "通用按钮边框色"),
    ("devui-btn-common-color-hover",         "button", "#191919", "#ededed", "#0f172a", "#ffffff", "#1d1b26", "通用按钮悬停文字色"),
    ("devui-btn-common-border-color-hover",  "button", "#191919", "#8a8a8f", "rgba(15, 23, 42, 0.32)", "rgba(255, 255, 255, 0.3)", "#1d1b26", "通用按钮悬停边框色"),
    ("devui-btn-common-color-active",        "button", "#191919", "#ededed", "#0f172a", "#ffffff", "#1d1b26", "通用按钮激活文字色"),
    ("devui-btn-common-border-color-active", "button", "#191919", "#ededed", "#0a59f7", "#4d8cff", "#1d1b26", "通用按钮激活边框色"),
    ("devui-btn-common-border-disabled",     "button", "#c9c9c9", "#333337", "rgba(15, 23, 42, 0.1)", "rgba(255, 255, 255, 0.08)", "#b8b09c", "通用按钮禁用边框色"),
    ("devui-constant-blue",          "status", None, "#3d7bff", None, "#4d8cff", None, "常亮蓝色"),
    ("devui-constant-blue-hover",    "status", None, "#5c93ff", None, "#7aa7ff", None, "常亮蓝色悬停色"),
    ("devui-constant-blue-active",   "status", None, "#2f6af0", None, "#3a78f0", None, "常亮蓝色激活色"),
    ("devui-constant-blue-disabled", "status", None, "#1e3466", None, "rgba(77, 140, 255, 0.3)", None, "常亮蓝色禁用色"),
    ("devui-constant-blue-rippling", "status", None, "rgba(61, 123, 255, 0.1)", None, "rgba(77, 140, 255, 0.1)", None, "常亮蓝色波纹色"),
    ("devui-animation-duration-slow",      "motion", None, None, "420ms", None, "240ms", "慢速动画时长"),
    ("devui-animation-duration-base",      "motion", None, None, "300ms", None, "160ms", "基础动画时长"),
    ("devui-animation-duration-fast",      "motion", None, None, "160ms", None, "80ms",  "快速动画时长"),
    ("devui-animation-ease-in",            "motion", None, None, None, None, "steps(3, end)", "缓入动画曲线"),
    ("devui-animation-ease-out",           "motion", None, None, "cubic-bezier(0.32, 0.72, 0, 1)", None, "steps(3, end)", "缓出动画曲线"),
    ("devui-animation-ease-in-out",        "motion", None, None, None, None, "steps(3, end)", "缓入缓出动画曲线"),
    ("devui-animation-ease-in-smooth",     "motion", None, None, "cubic-bezier(0.32, 0.72, 0, 1)", None, "steps(3, end)", "平滑缓入动画"),
    ("devui-animation-ease-in-out-smooth", "motion", None, None, "cubic-bezier(0.32, 0.72, 0, 1)", None, "steps(3, end)", "平滑缓入缓出曲线"),
    ("devui-animation-linear",             "motion", None, None, None, None, None, "线性动画曲线"),
    ("devui-z-index-full-page-overlay",    "zindex", None, None, None, None, None, "全屏覆盖类元素层级"),
    ("devui-z-index-pop-up",               "zindex", None, None, None, None, None, "提示类信息层级"),
    ("devui-z-index-dropdown",             "zindex", None, None, None, None, None, "下拉菜单层级"),
    ("devui-z-index-modal",                "zindex", None, None, None, None, None, "弹窗层级"),
    ("devui-z-index-drawer",               "zindex", None, None, None, None, None, "抽屉板层级"),
    ("devui-z-index-framework",            "zindex", None, None, None, None, None, "框架类元素层级"),
]

# 扩展层：DevUI 官方变量表达不了的"材质 / 几何 / 字体"维度，命名统一为 devui-ext-*。
# 8 列按 THEMES 顺序（3 官方 + 5 扩展）。官方主题下全部取"无效果"值，接入扩展层不改变官方主题外观。
# 动效、全圆角、标题字重已有官方变量（animation-* / border-radius-full / font-title-weight），不在扩展层重复定义。
EXT_CATEGORIES = [
    ("ext-type",     "字体族",      ""),
    ("ext-shape",    "几何",        ""),
    ("ext-material", "材质",        "只有玻璃主题非 0。组件需显式使用（见 §8 工具类）。"),
    ("ext-color",    "补充语义色",   "补齐官方变量缺失的'主色上的文字'等，解决深色墨主题主按钮反转问题。"),
    ("ext-motion",   "交互",        ""),
]

DEVUI_FONT = '"Helvetica", "Arial", "PingFangSC-Regular", "Hiragino Sans GB", "Microsoft YaHei", "HarmonyOS Sans SC", sans-serif'
SANS = '"HarmonyOS Sans SC", "PingFang SC", "Microsoft YaHei", -apple-system, "Segoe UI", sans-serif'
PIXEL = '"Fusion Pixel 12px Proportional SC", "Zpix", "Press Start 2P", monospace'
MONO = '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace'
F3 = (DEVUI_FONT,) * 3  # 官方三主题沿用 ng-devui 的 $font-family

GLASS_BG = "radial-gradient(60% 50% at 12% 8%, #c9dcff 0%, transparent 60%), radial-gradient(50% 45% at 88% 12%, #f3d2ff 0%, transparent 60%), radial-gradient(55% 50% at 70% 92%, #c8f4ec 0%, transparent 60%), #eef1f8"
GLASS_DARK_BG = "radial-gradient(55% 45% at 10% 0%, rgba(77, 140, 255, 0.35) 0%, transparent 60%), radial-gradient(45% 40% at 92% 10%, rgba(176, 102, 255, 0.28) 0%, transparent 60%), radial-gradient(50% 45% at 65% 100%, rgba(32, 201, 180, 0.22) 0%, transparent 60%), #0b0d14"

# (变量名, 分类, newInfinity, infinity, galaxy, as-ink, as-ink-dark, as-glass, as-glass-dark, as-pixel, 描述)
EXT_TOKENS = [
    ("devui-ext-font-family",         "ext-type", *F3, SANS, SANS, SANS, SANS, SANS, "正文字体族（像素风正文仍用无衬线保可读性）"),
    ("devui-ext-font-family-display", "ext-type", *F3, SANS, SANS, SANS, SANS, PIXEL, "标题 / 数字 / 按钮字体族"),
    ("devui-ext-font-family-mono",    "ext-type", MONO, MONO, MONO, MONO, MONO, MONO, MONO, PIXEL, "代码 / 日志字体族"),

    ("devui-ext-border-width",        "ext-shape", "1px", "1px", "1px", "1px", "1px", "1px", "1px", "2px", "通用描边宽度"),
    ("devui-ext-border-style",        "ext-shape", "solid", "solid", "solid", "solid", "solid", "solid", "solid", "solid", "通用描边样式"),
    ("devui-ext-image-rendering",     "ext-shape", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "pixelated", "图标 / 头像位图渲染"),

    ("devui-ext-backdrop",            "ext-material", "#f3f3f3", "#f3f3f3", "#16181a", "#f5f5f5", "#141415", GLASS_BG, GLASS_DARK_BG, "#f4efe1", "页面底图（body / 应用根容器 background）"),
    ("devui-ext-material-blur",       "ext-material", "0px", "0px", "0px", "0px", "0px", "24px", "28px", "0px", "玻璃面模糊半径"),
    ("devui-ext-material-saturate",   "ext-material", "100%", "100%", "100%", "100%", "100%", "180%", "160%", "100%", "玻璃面饱和度增强"),
    ("devui-ext-material-edge",       "ext-material", "transparent", "transparent", "transparent", "transparent", "transparent", "rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.14)", "transparent", "玻璃面亮边（1px 描边色）"),
    ("devui-ext-material-highlight",  "ext-material", "none", "none", "none", "none", "none",
        "inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(255, 255, 255, 0.25)",
        "inset 0 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1px 0 rgba(255, 255, 255, 0.04)",
        "none", "玻璃面内高光（叠加在 box-shadow 首位）"),

    ("devui-ext-on-primary",          "ext-color", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#121213", "#ffffff", "#0b0d14", "#fffdf6", "主色（devui-primary）上的文字 / 图标"),
    ("devui-ext-accent",              "ext-color", "#0a59f7", "#5e7ce0", "#317af7", "#0a59f7", "#3d7bff", "#0a59f7", "#4d8cff", "#0a59f7", "选中 / 聚焦 / 运行态强调色（官方主题 = 品牌色）"),
    ("devui-ext-accent-glow",         "ext-color", "none", "none", "none", "none", "none",
        "linear-gradient(110deg, #0a59f7 0%, #7b5cff 45%, #22c3e6 100%)",
        "linear-gradient(110deg, #4d8cff 0%, #a77bff 45%, #2fd6c3 100%)",
        "repeating-linear-gradient(90deg, #0a59f7 0 8px, #5b8cff 8px 16px)", "流光：运行态描边 / 进度条 / Agent 思考中"),

    ("devui-ext-press-offset",        "ext-motion", "0px", "0px", "0px", "0px", "0px", "0px", "0px", "2px", "按下位移（像素风按钮按下时下沉并缩短投影）"),
]
