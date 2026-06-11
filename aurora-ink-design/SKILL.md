---
name: aurora-ink-design
description: 生成符合「Aurora Ink」设计规范的前端 HTML/CSS demo —— 瓷白画布、墨色胶囊主按钮、紫→青棱镜强调线、柔和层级卡片、语义状态色、Inter 字体。当需要做任何 Web demo / 原型 / 内部工具 / SaaS 管理后台 / Agent 平台界面，且要求视觉统一、复合团队设计规范时使用。Use when building any web demo, prototype, dashboard, or internal tool UI that must match the team's unified visual spec.
---

# Aurora Ink 设计系统

一套用于团队 demo 的统一前端视觉规范。目标：任何人产出的 demo 都长得像同一个产品。
**一句话气质**：瓷白画布 · 墨色是主角 · 紫→青「棱镜」只作为贯穿全局的一缕光。

## 何时使用

构建任何需要符合本团队设计规范的网页：管理后台、SaaS 仪表盘、Agent / 协作平台、内部工具、产品原型、概念 demo。无论用户是否明确说"用 Aurora Ink"，只要是在本团队语境下做前端 demo，默认套用本规范。

## 上手（必须先做）

1. **始终引入 token 样式表**，不要自己另写一套颜色/阴影/圆角：
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="aurora-ink.css">
   ```
   `references/aurora-ink.css` 是单文件 drop-in：包含全部 design token + 基线 + 常用组件类。
   做单文件 demo 时，把它整段内联进 `<style>` 即可。
2. **从模板起步**：复制 `references/template.html`，它已搭好「浅色侧栏 + 圆角半包围白容器」外壳和组件示例。
3. 所有视觉决策都从 CSS 变量取值（`var(--…)`）。**禁止写魔数颜色、阴影、圆角。**

## 七条铁律（最容易翻车的地方）

1. **主按钮 = 墨色胶囊**。`.btn-primary` 是墨色渐变 `--ink-grad`、`border-radius:999px`、白字。绝不要蓝色/紫色实心主按钮。
2. **彩色是信息，不是装饰**。紫/蓝/绿/橙/红只用于「状态、标签、图表、身份」等信息识别（见 `--status-*` / `data-kind`）。不要给区块、卡片、背景大面积上彩色。
3. **紫→青棱镜是「一缕光」**。`--aurora-prism` / `--aurora-violet` 只出现在三处：品牌 logo、焦点态（输入框/按钮 focus ring）、运行态（呼吸动画）。不要拿它当填充色铺满。
4. **表单控件用紫色强调**（`--color-control` = `#6E5BFF`）：checkbox / radio / switch / 选中态。与按钮黑色形成层级（黑 = primary action，紫 = selected state）。
5. **发丝级描边 + 柔和层级阴影**。边框用 `--hairline`（rgba(17,24,39,.08)），阴影用 `--shadow-*` / `--shadow-card`。不要用粗黑边、不要用重的方向性投影。
6. **胶囊优先的几何**。按钮、搜索框、tag、chip、分段控件一律 `--radius-pill`；卡片/弹窗用 12–22px 大圆角。
7. **字体只用 Inter（正文/显示）+ JetBrains Mono（代码/数字密集）**。显示层标题收紧字距（负 letter-spacing），数字用 `tabular-nums`。中文回退 PingFang SC / Microsoft YaHei。

## 设计 token 速查

| 类别 | Token | 值 |
|---|---|---|
| 画布底 | `--page-bg` | `#F2F3F7`（瓷白，配极淡紫/青径向光晕，见 `body`）|
| 表面 | `--bg-surface` | `#ffffff` |
| 主文本 | `--color-text-primary` | `#111827` |
| 次/三/四级文本 | `--color-text-secondary/tertiary/quaternary` | 灰阶 600/500/400 |
| 发丝描边 | `--hairline` | `rgba(17,24,39,.08)` |
| 主色（墨）| `--ink-grad` | `linear-gradient(180deg,#1F1D2E,#0D0C16)` |
| 棱镜 | `--aurora-prism` | `linear-gradient(90deg,#6E5BFF,#8B5CF6,#2DD4BF)` |
| 控件紫 | `--color-control` | `#6E5BFF` |
| 焦点环 | `--color-focus-ring` | `rgba(110,91,255,.55)` |
| 状态色 | `--status-todo/doing/review/done/reject/warn/info` | 灰/蓝/紫/绿/红/橙/青 |
| 身份色 | `--color-agent/human/auto` | 紫 `#8B6CFF` / 蓝 `#3b82f6` / 橙 `#D97706` |
| 圆角 | `--radius-sm/md/lg/xl/pill` | 6 / 8 / 12 / 16 / 999 |
| 间距 | `--space-1..6` | 4 / 8 / 12 / 16 / 24 / 32 |
| 阴影 | `--shadow-xs/sm/md/lg/popup` + `--shadow-card` | 见 css |

## 布局外壳

固定的「半包围」结构（模板里已搭好）：

```
.app                    flex 容器
├─ .sidebar             fixed 浅色侧栏（256px，可 .collapsed 至 52px），右侧发丝描边
│  ├─ .sb-brand-row     48px 品牌行：.brand-logo（墨色渐变方块）+ .brand-name
│  └─ .sb-section       .sb-section-title 分组标题 + .sb-item（.active 左侧 3px 墨条指示）
└─ .main                圆角 22px 白容器，瓷白底从四周透出，柔和层级阴影
   └─ .page             .page-header（.page-title + .page-subtitle + .page-actions）
```

## 组件清单（类名 → 用途）

- **按钮**：`.btn` + `.btn-primary`（墨色）/ `.btn-ghost`（描边）/ `.btn-sm` / `.btn-lg`
- **卡片**：`.card` > `.card-header`（`.card-title` + `.marker` 墨色装饰条）+ `.card-body`
- **KPI**：`.kpi-grid` > `.kpi-card`（`.kpi-label` / `.kpi-value` + `.unit` / `.kpi-trend.up|.down`）
- **表单**：`.input` / `textarea.input` / `select.input`（focus 棱镜环）；`.field-label`；`.search`（胶囊）；`.switch`（开=紫，`.off`）；`.seg`（分段控件）
- **标签**：`.tag` / `.chip` / `.badge` + `data-kind="req|arch|dev|test|deploy|ops|review|doc|data|security|priority-high|priority-mid|priority-low|auto|manual|lead|ai"`
- **状态点**：`.status-dot.todo|.doing|.review|.done|.reject`（`.doing` 自带蓝色呼吸动画）
- **头像**：`.avatar.agent|.human` + `.online|.busy` 状态角标
- **弹窗**：`.modal-mask`（玻璃模糊）> `.modal` > `.modal-header` / `.modal-body` / `.modal-footer`
- **表格**：`table.tbl`（大写小标题表头、行 hover）
- **空状态**：`.empty-state`（`.icon` / `.title`）
- **Toast**：`.toast.success|.warning|.error`
- **棱镜工具类**：`.prism-text`（渐变标题字）/ `.prism-bar`（渐变细条）/ `.mono`（等宽）

> 业务里没有的组件，按上面 token + 铁律自行扩展，保持同一语言即可。完整可参考的实现见 `references/aurora-ink.css`。

## 交付前自检清单

- [ ] 引入了 Inter + JetBrains Mono，没有出现系统默认字体
- [ ] 主按钮是墨色胶囊，全局没有彩色实心主按钮
- [ ] 背景是瓷白 `#F2F3F7` + 极淡光晕，不是纯白、不是大面积彩色
- [ ] 紫→青只出现在品牌/焦点/运行态，没被当填充色滥用
- [ ] checkbox/radio/switch 是紫色强调
- [ ] 边框是发丝级、阴影是柔和层级（没有粗黑边/重投影）
- [ ] 按钮/搜索/tag/分段控件是胶囊，卡片是大圆角
- [ ] 状态/标签颜色取自 `--status-*` 或 `data-kind`，没有手写魔数色
- [ ] 数字用 tabular-nums，标题字距收紧

## 参考文件

- `references/aurora-ink.css` —— drop-in token + 组件样式表（唯一真相来源）
- `references/template.html` —— 可直接复制的起步页（外壳 + 组件演示）
