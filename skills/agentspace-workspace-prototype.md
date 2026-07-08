---
name: agentspace-workspace-prototype
description: "Reusable frontend system for a single-file, multi-module agentic-workspace product prototype. 用于单文件、多模块的「智能体工作台」产品原型的可复用前端体系。Use when building a self-contained HTML prototype of an AI agent product: a fixed black sidebar with workspace switching, JS page-routing (SPA-style), a three-column task-records surface (run list / chat-flow / overview), a reusable conversation-flow component library (tool calls, thinking, todo, confirm, error, files, done-footer), docked + floating side panels, an inline SVG icon system, and a black-and-white 'Codex' design system — all appended as prefix-isolated module patches and verified headless (node --check + jsdom). Extracted from the AgentSpace demo (aligned to an agentworkspace PRD)."
---

# AgentSpace Workspace Prototype / 智能体工作台原型

## Core Intent / 核心意图

Build a self-contained, production-feeling **agentic-workspace product prototype**: one HTML file, pure vanilla JS, no framework and no build step, that behaves like a real team-collaboration AI-agent SaaS. It must survive click-through demos — real page routing, real panel states, real conversation flows with tool calls and approvals — not a static mockup. Favor a calm black-and-white surface where typography (not color or shadow) carries the visual weight, and grow it by appending **prefix-isolated modules** so each PRD chapter lands without disturbing the base.

构建自包含、具备生产级质感的**智能体工作台产品原型**：单个 HTML 文件、纯原生 JS、无框架无构建，表现得像一个真实的团队协作 AI Agent SaaS。它要经得起点点点走查——真实的页面路由、真实的面板状态、带工具调用与授权的真实对话流——而不是静态稿。优先选择沉静的黑白表面，让**排版**（而非颜色或阴影）承担视觉重量，并通过追加**前缀隔离模块**来扩张，让每个 PRD 章节都能落地而不扰动底座。

Extracted from the AgentSpace demo, aligned to an agentworkspace PRD:

提取自 AgentSpace demo，对齐 agentworkspace 产品 PRD：

- `agentspace.html` (black sidebar SPA + config-center + Workflow editor + three-column task-records + conversation-flow component library + event/scheduled kanban).

## Workflow / 工作流

1. Read the PRD chapter first, then map it to ONE module with ONE prefix. Decide: is it a new `page-*` view, an enhancement of an existing page, or a new overlay? Never start styling before the module boundary is drawn.
   先读 PRD 章节，再把它映射为**一个模块、一个前缀**。判断：是新的 `page-*` 视图、对既有页的增强、还是新浮层？在画好模块边界前绝不开始写样式。

2. Append, don't edit the base. New CSS goes in an end-of-file `<style id="nx-xxx">`; new JS in a `<script id="nx-xxx-js">`. Do not touch the base `:root` tokens or existing functions — extend via new prefixed classes/functions only.
   追加，不改底座。新 CSS 放在文件末尾的 `<style id="nx-xxx">`，新 JS 放在 `<script id="nx-xxx-js">`。不动底座 `:root` token 和既有函数——只通过新的前缀类/函数扩展。

3. Build real controls and states: page switching, workspace switching, filter dropdowns, docked/floating panels, chat-flow rendering, empty/loading/done/fail states, cross-module jumps (a card in module A opens a detail in module B).
   构建真实可用的控件与状态：页面切换、工作区切换、筛选下拉、停靠/悬浮面板、对话流渲染、空/加载/完成/失败态、跨模块跳转（A 模块的卡片打开 B 模块的详情）。

4. Use the shared icon system for every glyph (`data-ic="name"` + Lucide path in `ICONS`); never paste raw `<svg>` inline.
   每个图标都走共享图标系统（`data-ic="name"` + `ICONS` 里的 Lucide 路径）；绝不内联裸 `<svg>`。

5. Verify headless before declaring done: extract each `<script>` block and `node --check` it, then jsdom-load the whole file and assert page-nesting + render functions run without throwing. The Chrome extension may not be connected — say so, and ask the user to hard-refresh for the visual pass.
   收工前先做无头验证：抽出每个 `<script>` 块 `node --check`，再用 jsdom 整文件加载，断言页面嵌套关系正确、渲染函数不抛错。Chrome 扩展可能未连接——如实说明，并请用户硬刷新做视觉走查。

## Signature Rules / 标志性规则

- **Prefix-isolate every module.** Each PRD chapter = one prefix (`cfgc` config-center, `afl`/`AFL_*` Workflow, `tskr` task-records, `nta`/`evt`/`cron` event/scheduled, `adx` asset-detail, `mkt` market-select). All classes, ids, functions, and mock-data consts carry it. This is what lets many modules coexist in one 36k-line file without collisions.
  **每个模块前缀隔离。** 每个 PRD 章节 = 一个前缀（`cfgc` 配置中心、`afl`/`AFL_*` Workflow、`tskr` 任务记录、`nta`/`evt`/`cron` 事件/定时、`adx` 资产详情、`mkt` 市场选择）。所有类、id、函数、mock 数据常量都带上它。这正是让众多模块在一个 3.6 万行文件里共存而不冲突的关键。

- **Sidebar is a router.** Nav items call `switchPage(pageId)` which toggles one `.page` block visible; workspaces call `switchWorkspace(wsId)` which keeps the current page kind but swaps context. The sidebar is black; it is the one dark surface in an otherwise white app.
  **侧栏是路由器。** 导航项调用 `switchPage(pageId)` 切换唯一可见的 `.page`；工作区调用 `switchWorkspace(wsId)` 保持当前页类型但切换上下文。侧栏是黑色的，是整个白色应用里唯一的深色表面。

- **Black is the only fill; type carries weight.** No colored brand accent, no gradients, no shadows (shadow tokens exist but are all `none`). Primary buttons are black, secondary white. Hierarchy comes from font weight, size, and hairline borders — not decoration.
  **黑色是唯一填充；排版承担重量。** 无彩色品牌强调、无渐变、无阴影（阴影 token 保留但全为 `none`）。主按钮黑、次按钮白。层级来自字重、字号和细线边框——而非装饰。

- **Color is reserved for information.** The only saturated colors live in a separate `--status-*` / `--color-agent|human|auto` scale used for status dots, tags, kanban columns, and role identity — never for chrome. Form controls use one violet `--color-control` to mark *selected state* (distinct from black *primary action*).
  **颜色只留给信息。** 唯一的饱和色在独立的 `--status-*` / `--color-agent|human|auto` 色阶里，用于状态点、tag、看板列、角色身份——绝不用于界面框架。表单控件用一个紫色 `--color-control` 标记*选中态*（区别于黑色*主操作*）。

- **The conversation flow is a component library, not free HTML.** Every message renders through `tskrMsgHtml(m, ctx)`, a typed dispatcher (`t: user|agent|sys|tool|plan|think|files|todo|confirm|error|done-footer|suggest`). To add a message kind, add a branch — never hand-write chat markup inline.
  **对话流是组件库，不是自由 HTML。** 每条消息都经 `tskrMsgHtml(m, ctx)`（按 `t` 分派的类型化渲染器）产出。要加一种消息，加一个分支——绝不手写内联聊天标记。

- **Reparent fixed overlays to `document.body`.** A `position:fixed` mask/panel nested inside `.main` (which has `overflow:hidden` / transforms) is clipped to that ancestor, not the viewport. On open, move the overlay node to `document.body`; on close, it can stay. This is the fix for "the mask doesn't cover the sidebar."
  **把 fixed 浮层挪到 `document.body`。** 嵌在 `.main`（带 `overflow:hidden`/transform）里的 `position:fixed` 蒙层/面板会被该祖先裁剪，而非相对视口。打开时把浮层节点挪到 `document.body`；关闭时可留着。这就是"蒙层盖不住侧栏"的解法。

- **Docked panel vs floating popover are two different affordances.** A detail/artifact panel *docks* (pushes the layout, `flex` column on the right). A secondary overview *floats* (`position:absolute` popover with click-outside dismiss). Opening the docked panel auto-collapses the floating one.
  **停靠面板与悬浮气泡是两种不同的可供性。** 详情/产物面板*停靠*（挤压布局，右侧 `flex` 列）。次级概览*悬浮*（`position:absolute` 气泡，点外部关闭）。打开停靠面板时自动收起悬浮的那个。

- **One glyph source.** All icons are Lucide paths in the `ICONS` dict, rendered by `data-ic="name"` → `makeSvg` → `window.__renderIcons(root)`, with a `MutationObserver` catching dynamically-inserted nodes. A missing key renders blank (silent) — so a blank icon means "add the path to `ICONS`."
  **单一图标来源。** 所有图标都是 `ICONS` 字典里的 Lucide 路径，经 `data-ic="name"` → `makeSvg` → `window.__renderIcons(root)` 渲染，用 `MutationObserver` 兜住动态插入的节点。缺键渲染为空白（静默）——所以图标空白 = "去 `ICONS` 补路径"。

- Avoid: colored chrome, gradients, drop shadows, per-module `:root` overrides, raw inline `<svg>`, hand-written chat bubbles, editing base functions, `calc(100vh - <magic>)` heights, trusting headless screenshots as visual sign-off.
  避免：彩色界面框架、渐变、投影、模块内 `:root` 覆盖、裸内联 `<svg>`、手写聊天气泡、改底座函数、`calc(100vh - <魔法数>)` 高度、把无头截图当视觉验收。

## Design Principles / 设计原则

- Product, not slide. It should feel like software you could ship: consistent chrome, real empty/loading/error states, reversible actions, keyboard-first focus rings.
  是产品，不是幻灯片。它该像能上线的软件：一致的界面框架、真实的空/加载/错误态、可回滚的操作、keyboard-first 焦点环。

- Restraint is the aesthetic. 1px borders, 6–16px radii + pill geometry, zero shadow, 4/8/12/16/24/32 spacing ladder. The confidence comes from whitespace and alignment, not effects.
  克制即美学。1px 边框、6–16px 圆角 + 胶囊几何、零阴影、4/8/12/16/24/32 间距阶梯。自信来自留白与对齐，而非特效。

- Fidelity to the PRD's state machine. If the PRD says task-records shows only 4 aggregate states, the filter shows 4 — not the 6 internal states. Mirror the spec's vocabulary and counts exactly; demo-invented states confuse review.
  忠于 PRD 的状态机。若 PRD 说任务记录只呈现 4 个聚合态，筛选就给 4 个——而非 6 个内部态。精确对齐规范的词汇与数量；demo 自造的状态会干扰评审。

- Real identity. Agents, humans, and automation each get a color role and real avatars (`window.__memojiUrl(seed, 'human'|'bot')`), so the conversation reads as a cast, not gray blocks.
  真实身份。Agent、人、自动化各有一个颜色角色与真实头像（`window.__memojiUrl(seed, 'human'|'bot')`），让对话读起来像一组角色，而非灰块。

- Cross-module navigability. A finding, a card, an artifact link should jump to the exact view that owns it (`switchPage` + a target-selecting open fn), closing the loop between surfaces.
  跨模块可导航。一条结论、一张卡片、一个产物链接，都应跳到真正拥有它的视图（`switchPage` + 目标定位的 open 函数），闭合各界面之间的回路。

## Tokens / 设计变量

Semantic "Codex" naming. Black is `--color-primary`; white is every surface; saturated color lives only in the status/role scale. Keep these in the base `:root` — modules consume them, never redefine them.

语义化「Codex」命名。黑是 `--color-primary`；白是所有表面；饱和色只活在状态/角色色阶里。这些放在底座 `:root`——模块消费它们，绝不重定义。

```css
:root {
  /* neutrals (subtle layering only) / 中性阶（仅用于微弱分层） */
  --neutral-0:#fff; --neutral-50:#fafafa; --neutral-100:#f4f4f5; --neutral-200:#e4e4e7;
  --neutral-300:#d4d4d8; --neutral-400:#a1a1aa; --neutral-500:#71717a; --neutral-600:#52525b;
  --neutral-700:#3f3f46; --neutral-800:#27272a; --neutral-900:#18181b;

  /* surfaces — white app, black sidebar / 表面——白应用、黑侧栏 */
  --bg-base:#fff; --bg-surface:#fff; --bg-subtle:var(--neutral-50); --bg-hover:var(--neutral-100);
  --bg-sidebar:#000; --bg-sidebar-hover:rgba(255,255,255,.06); --bg-sidebar-active:rgba(255,255,255,.10);

  /* text / 文字 */
  --color-text-primary:#111827; --color-text-secondary:var(--neutral-600);
  --color-text-tertiary:var(--neutral-500); --color-text-quaternary:var(--neutral-400);

  /* borders — thin, restrained / 边框——极薄克制 */
  --color-border:var(--neutral-200); --color-border-strong:var(--neutral-300);

  /* primary = black, secondary = white / 主=黑，次=白 */
  --color-primary:#000; --color-primary-hover:var(--neutral-800); --color-secondary:#fff;

  /* control accent = violet (selected state ≠ black primary action) / 控件强调=紫（选中态≠黑主操作） */
  --color-control:#8B5CF6; --color-control-soft:#f5f3ff; --color-control-hover:#7c3aed;

  /* information colors — dots, tags, kanban, charts / 信息色——状态点、tag、看板、图表 */
  --status-todo:#94a3b8; --status-doing:#3b82f6; --status-review:#8b5cf6;
  --status-done:#16a34a; --status-reject:#dc2626; --status-warn:#d97706; --status-info:#0891b2;

  /* role identity / 角色身份 */
  --color-agent:#8b5cf6; --color-human:#3b82f6; --color-auto:#d97706;

  /* type / 排版 */
  --font-display:'Inter',-apple-system,'PingFang SC','Microsoft YaHei',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;

  /* spacing 4/8/12/16/24/32 · radius 6/8/12/16/pill · NO shadow / 间距·圆角·无阴影 */
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:24px; --space-6:32px;
  --radius-sm:6px; --radius-md:8px; --radius-lg:12px; --radius-xl:16px; --radius-pill:999px;
  --shadow-sm:none; --shadow-md:none; --shadow-lg:none;

  /* layout / 布局 */
  --sidebar-w:256px; --sidebar-w-collapsed:52px;
  --ease:cubic-bezier(.4,0,.2,1); --ease-out:cubic-bezier(.16,1,.3,1);
}
```

## Typography / 排版

- Font stack: `Inter` + CJK (`PingFang SC` / `Microsoft YaHei`) for prose; `JetBrains Mono` for paths, code, diffs, IDs, raw values. Base body `13px` / line-height `1.55`.
  字体栈：正文用 `Inter` + 中文（`PingFang SC` / `Microsoft YaHei`）；路径、代码、diff、ID、原始值用 `JetBrains Mono`。正文基准 `13px` / 行高 `1.55`。

- Weight and size, not color, build hierarchy. Page title bold ~`18–20px`, card title semibold, body `13px`, meta/caption `11–12px` in `--color-text-tertiary`. Micro-labels (uppercase tags, badges, mono paths) may go smaller.
  用字重与字号（而非颜色）建立层级。页面标题 bold 约 `18–20px`，卡片标题 semibold，正文 `13px`，元信息/说明 `11–12px` 用 `--color-text-tertiary`。微标签（大写 tag、徽标、等宽路径）可更小。

- Keyboard-first focus ring is black (`--color-focus-ring: rgba(0,0,0,.55)`), 2px, 2px offset — consistent across every control.
  keyboard-first 焦点环是黑色（`--color-focus-ring: rgba(0,0,0,.55)`），2px、2px 偏移——所有控件一致。

## Component Map / 组件地图

- **Black sidebar (router + workspace switcher)**: fixed `--sidebar-w`, black surface, workspace selector at top, grouped nav below, collapsible to `--sidebar-w-collapsed` icon-only. Nav → `switchPage`; workspace → `switchWorkspace`.
  **黑色侧栏（路由 + 工作区切换）**：固定 `--sidebar-w`、黑色表面，顶部工作区选择器，下方分组导航，可收起为 `--sidebar-w-collapsed` 纯图标。导航 → `switchPage`；工作区 → `switchWorkspace`。

- **Page views**: `<div class="page" id="page-XXX">`, one visible at a time inside `.main`. Verify every page is a direct child of `.main` (see Verification) — a stray `</div>` that closes `.main` early ejects later pages to body level and breaks their layout.
  **页面视图**：`<div class="page" id="page-XXX">`，`.main` 内同一时刻只显示一个。验证每个页面都是 `.main` 的直接子级（见验证）——多出的 `</div>` 提前闭合 `.main`，会把后续页面挤到 body 层、破坏其布局。

- **Three-column task-records (`tskr`)**: left = run list (with a single filter-icon → dropdown of type/mode/status/time, AND-stacked; keyword highlight), middle = conversation flow (with a compact Workflow step-bar header + a bottom composer input), right = overview dock. A run's artifacts open as a docked file-content viewer.
  **三栏任务记录（`tskr`）**：左=运行列表（单筛选图标 → 类型/模式/状态/时间下拉，AND 叠加；关键字高亮），中=对话流（顶部紧凑 Workflow 步骤条 + 底部输入框），右=概览停靠。运行的产物以停靠式文件内容查看器打开。

- **Conversation-flow library (`tskrMsgHtml`)**: typed message renderer. Kinds: `user`/`agent` (avatar + name + time + text), `sys` (centered system line), `tool` (collapsible MCP/Skill/tool call with input/output + ok/err/run status), `plan`, `think` (collapsed "thinking process ›"), `files` (changed-files summary → opens artifact panel), `todo` (done/current/todo checklist), `confirm` (normal/danger authorization card), `error` (expanded reason + retry), `done-footer` (done/fail/abort completion bar), `suggest` (follow-up chips). Model your chat spec as this dispatcher.
  **对话流组件库（`tskrMsgHtml`）**：类型化消息渲染器。类型：`user`/`agent`（头像+名+时间+文本）、`sys`（居中系统行）、`tool`（可折叠 MCP/Skill/工具调用，含输入/输出 + 成功/失败/进行中状态）、`plan`、`think`（折叠「思考过程 ›」）、`files`（变更文件汇总 → 打开产物面板）、`todo`（完成/进行中/待办清单）、`confirm`（常规/高危授权卡）、`error`（展开原因 + 重试）、`done-footer`（完成/失败/中止收口条）、`suggest`（后续建议 chips）。把你的聊天规范建模成这个分派器。

- **Config-center / backend management (`cfgc`)**: management-domain + node-tree + template/plugin/member panels. The "backend" counterpart to the workspace "frontend".
  **配置中心 / 后端管理（`cfgc`）**：管理域 + 节点树 + 模板/插件/成员面板。工作区"前台"的"后台"对应物。

- **Workflow editor (`afl`)**: card-based flow list → click into a Flow→Stage→Step visual editor (overview band, stage swimlanes, step nodes + connectors + icons). Sequential-only, with artifact-list gate / retry (0–30, default 3) / manual-confirm / `@{Step}.{path}` references. (UI label is "Workflow"; internal prefix stays `afl`.)
  **Workflow 编辑器（`afl`）**：卡片式流程列表 → 点入 Flow→Stage→Step 可视化编辑器（概览带、Stage 泳道、Step 节点 + 连线 + 图标）。仅顺序执行，带产物清单门控 / 重试（0–30，默认 3）/ 人工确认 / `@{Step}.{path}` 引用。（UI 文案是"Workflow"；内部前缀仍 `afl`。）

- **Event / scheduled tasks (`evt`/`cron`)**: event kanban (multi-column status board) + scheduled-task records; status vocabulary mapped exactly to the PRD (e.g. records show 6 states, no TODO).
  **事件 / 定时任务（`evt`/`cron`）**：事件看板（多列状态板）+ 定时任务记录；状态词汇精确映射 PRD（如记录显示 6 态、无 TODO）。

- **Detail/artifact panels (`adx`, `tskr` dock)**: body-level overlay for asset detail (masked); docked file-content viewer for artifacts (filename + download/fullscreen/close + multi-file tabs + diff body with +/- line stats).
  **详情/产物面板（`adx`、`tskr` dock）**：body 级资产详情浮层（带蒙层）；停靠式产物文件查看器（文件名 + 下载/全屏/关闭 + 多文件 tab + 带 +/- 行统计的 diff 内容）。

- **Icon chip**: `<span data-ic="name" data-ic-sz="14">`; rendered to inline SVG. Add new glyphs by pasting the Lucide path into `ICONS`.
  **图标芯片**：`<span data-ic="name" data-ic-sz="14">`；渲染为内联 SVG。粘贴 Lucide 路径进 `ICONS` 即新增图标。

## Layout Recipes / 布局配方

### App Shell / 应用外壳

- `.sidebar`: `position:fixed; left:0; top:0; width:var(--sidebar-w); height:100vh; background:var(--bg-sidebar)` (black), collapsible via a `sidebar-collapsed` body class to `--sidebar-w-collapsed`.
  `.sidebar`：固定定位、`--sidebar-w` 宽、满高、黑底，通过 body 上的 `sidebar-collapsed` 类收起到 `--sidebar-w-collapsed`。
- `.main`: `margin-left:var(--sidebar-w); height:100vh; overflow:hidden`. Holds every `.page`. Because it clips overflow, **fixed overlays inside it must be reparented to `document.body`** to cover the full viewport (incl. sidebar).
  `.main`：`margin-left:var(--sidebar-w); 满高; overflow:hidden`。承载所有 `.page`。因为它裁剪溢出，**内部的 fixed 浮层必须挪到 `document.body`** 才能覆盖整个视口（含侧栏）。
- `switchPage(id)` hides all `.page`, shows the target; `switchWorkspace(wsId)` swaps context while keeping the current page kind (task-records/session stay on task-records; config pages stay put) — never silently revert to an old landing view.
  `switchPage(id)` 隐藏所有 `.page`、显示目标；`switchWorkspace(wsId)` 切换上下文但保持当前页类型（任务记录/会话停在任务记录；配置页保持原地）——绝不静默回退到旧落地页。

### Three-Column Task-Records / 三栏任务记录

- `.tskr-ws`: `display:flex`; `.tskr-left` (fixed-ish list) + `.tskr-mid` (`flex:1` conversation) + `.tskr-right` (overview dock). A `.tskr-ws.tskr-compose` state (new-temp-task) shows a blank immersive start page in the middle and hides the right dock.
  `.tskr-ws`：`display:flex`；`.tskr-left`（近固定列表）+ `.tskr-mid`（`flex:1` 对话）+ `.tskr-right`（概览停靠）。`.tskr-ws.tskr-compose` 态（新建临时任务）在中间显示空白沉浸式启动页并隐藏右侧停靠。
- Artifact panel docks by adding `artifact-open` to `.tskr-ws`, widening a right column to ~46% (`min 400 / max 680px`, white bg) — a real code/diff viewer, not a list. Opening it collapses both the docked and floating overview.
  产物面板通过给 `.tskr-ws` 加 `artifact-open` 停靠，把右列加宽到约 46%（`min 400 / max 680px`，白底）——真正的代码/diff 查看器，不是列表。打开它会收起停靠和悬浮两种概览。
- Overview can also float: a `position:absolute` popover toggled by a header icon, with a one-shot document click-outside listener (guard a global flag so it binds once).
  概览也可悬浮：由头部图标切换的 `position:absolute` 气泡，带一次性的 document 点外部监听（用全局标志位守卫，只绑定一次）。

### Docked Panel vs Floating Popover / 停靠面板 vs 悬浮气泡

- Dock = part of the layout (`flex` sibling, pushes content, persists). Float = transient overlay (`position:absolute`, dismiss on outside-click, does not reflow siblings). Never mix: a thing that should persist while you read shouldn't vanish on outside-click.
  停靠 = 布局的一部分（`flex` 同级、挤压内容、常驻）。悬浮 = 瞬态浮层（`position:absolute`、点外部关闭、不重排同级）。绝不混淆：需要边看边留存的东西不该点外部就消失。

### Overlays & Masks / 浮层与蒙层

- Unify masks: `rgba(17,17,27,.46)` + `blur(4px)`, high z-index (dialogs ~`10050`, toast above at ~`10200`). On open, `document.body.appendChild(overlay)`; the mask then covers the full viewport including the black sidebar.
  统一蒙层：`rgba(17,17,27,.46)` + `blur(4px)`，高 z-index（弹窗约 `10050`，toast 更高约 `10200`）。打开时 `document.body.appendChild(overlay)`；蒙层即覆盖整个视口，含黑色侧栏。

## Module Isolation Convention / 模块隔离约定

This is the load-bearing practice — read it before adding anything.

这是承重实践——加任何东西前先读它。

- One PRD chapter → one prefix. Existing: `cfgc` (config-center) · `afl`/`AFL_*` (Workflow) · `tskr` (task-records) · `nta`/`evt`/`cron` (event/scheduled) · `adx` (asset-detail) · `mkt` (market-select).
  一个 PRD 章节 → 一个前缀。已用：`cfgc`（配置中心）· `afl`/`AFL_*`（Workflow）· `tskr`（任务记录）· `nta`/`evt`/`cron`（事件/定时）· `adx`（资产详情）· `mkt`（市场选择）。
- New styles/scripts append as standalone end-of-file blocks: `<style id="nx-xxx">` / `<script id="nx-xxx-js">`. Do not modify the base `:root`, base CSS, or existing functions — extend only.
  新样式/脚本作为文件末尾的独立块追加：`<style id="nx-xxx">` / `<script id="nx-xxx-js">`。不改底座 `:root`、底座 CSS、既有函数——只扩展。
- Mock data lives in prefixed consts (`AFL_FLOWS`, `TSKR_*`, `evtTasks`). Keep a single "today" anchor (e.g. `TSKR_TODAY='2026-07-05'`) so relative-time filters are deterministic.
  Mock 数据放在带前缀的常量里（`AFL_FLOWS`、`TSKR_*`、`evtTasks`）。保留单一"今天"锚点（如 `TSKR_TODAY='2026-07-05'`），让相对时间筛选可确定。
- Keep the base landing page correct: `DOMContentLoaded` should open the *current* task-records view, not an old immersive/session page.
  保持底座落地页正确：`DOMContentLoaded` 应打开*当前*任务记录视图，而非旧的沉浸/会话页。

## Verification / 验证

No framework, so verification is mechanical and must run before every "done".

无框架，所以验证是机械化的，且必须在每次"完成"前运行。

- Syntax: extract each `<script>` block and `node --check` it. (Note: a giant embedded template string like `__MOBILE_HTML__` is data, not a real script tag — don't `--check` it.)
  语法：抽出每个 `<script>` 块 `node --check`。（注意：像 `__MOBILE_HTML__` 这样的巨型内嵌模板字符串是数据、不是真脚本标签——别 `--check` 它。）
- Structure (the highest-value check): jsdom-load the file and assert no `.page` escaped `.main`:
  结构（最高价值的检查）：jsdom 加载文件，断言没有 `.page` 逃出 `.main`：
  ```js
  [...document.querySelectorAll('.page')].filter(p => p.parentElement !== document.querySelector('.main'))
  // non-empty ⇒ a stray </div> closed .main early / 非空 ⇒ 多余 </div> 提前闭合了 .main
  ```
- Behavior: jsdom-call render functions (`tskrRenderDetail`, `aflRenderPipe`, `tskrRenderArtifacts`, `switchPage` across all pages) and assert 0 thrown errors + expected DOM. Block-scoped `const`s (`workspaces`, `evtTasks`) aren't on `window` — reference known keys directly in tests rather than treating their absence as a bug.
  行为：jsdom 调用渲染函数（`tskrRenderDetail`、`aflRenderPipe`、`tskrRenderArtifacts`、遍历所有页的 `switchPage`），断言 0 抛错 + 期望 DOM。块级 `const`（`workspaces`、`evtTasks`）不在 `window` 上——测试里直接引用已知键，别把它们的缺失当 bug。
- Visual: the Chrome extension is often not connected — do NOT claim visual verification you didn't do. Report what jsdom proved, and ask the user to hard-refresh (Cmd+Shift+R) for the real look.
  视觉：Chrome 扩展常未连接——不要声称你没做的视觉验证。报告 jsdom 证明了什么，并请用户硬刷新（Cmd+Shift+R）看真实效果。
- Back up before each round: `agentspace_backup_<date>_rN.html`.
  每轮前备份：`agentspace_backup_<date>_rN.html`。

## Quality Checks / 质量检查

- Every `.page` is a direct child of `.main`; no orphaned pages at body level.
  每个 `.page` 都是 `.main` 的直接子级；body 层没有游离页面。
- No colored chrome, no gradients, no shadows; saturated color only on status/role/tags.
  无彩色界面框架、无渐变、无阴影；饱和色只在状态/角色/tag 上。
- Every icon comes from `ICONS` via `data-ic` (no blank glyphs, no raw inline `<svg>`).
  每个图标都经 `data-ic` 来自 `ICONS`（无空白图标、无裸内联 `<svg>`）。
- Every chat message renders through `tskrMsgHtml` (no hand-written bubbles); empty/loading/done/fail states all exist.
  每条聊天消息都经 `tskrMsgHtml` 渲染（无手写气泡）；空/加载/完成/失败态齐全。
- Fixed overlays reparented to body so masks cover the sidebar; docked vs floating panels behave per their contract.
  fixed 浮层挪到 body，蒙层覆盖侧栏；停靠 vs 悬浮面板各按其约定行事。
- Status vocabulary/counts match the PRD, not demo-invented variants; workspace switching keeps the current page kind.
  状态词汇/数量匹配 PRD，而非 demo 自造变体；工作区切换保持当前页类型。
- `node --check` passes on every script block; jsdom load throws 0 errors.
  每个脚本块 `node --check` 通过；jsdom 加载 0 抛错。

## Implementation Notes / 实现说明

This is a **single-file** prototype contract: one inline base `<style>` + `:root` token block, a black-sidebar SPA shell, per-module patch blocks appended at end-of-file, a Lucide `ICONS` dict + `makeSvg`/`__renderIcons`/`MutationObserver` icon engine, `window.__memojiUrl(seed, kind)` for real avatars, mock-data consts per prefix, and typed vanilla-JS renderers (`tskrMsgHtml`, `aflRenderPipe`, `cfgc*`, …). No framework, no build, only Google Fonts as an external dependency.

这是**单文件**原型契约：一个内联底座 `<style>` + `:root` token 块、一个黑侧栏 SPA 外壳、文件末尾追加的分模块补丁块、一个 Lucide `ICONS` 字典 + `makeSvg`/`__renderIcons`/`MutationObserver` 图标引擎、`window.__memojiUrl(seed, kind)` 真实头像、按前缀分的 mock 数据常量，以及类型化的原生 JS 渲染器（`tskrMsgHtml`、`aflRenderPipe`、`cfgc*`……）。无框架、无构建，唯一外部依赖是 Google Fonts。

When porting into a real React/Vue app: translate the `:root` tokens to your theme, rebuild each prefixed module as a feature folder, and keep the load-bearing rules — prefix isolation, typed conversation-flow dispatcher, one icon source, reparent-fixed-overlays, dock-vs-float, and exact PRD state vocabulary. The chat-flow message schema (`{t, name, time, text, items, st, level, ...}`) ports directly to component props.

移植到真实 React/Vue 应用时：把 `:root` token 翻译成你的主题，把每个前缀模块重建为一个功能目录，并保留承重规则——前缀隔离、类型化对话流分派器、单一图标来源、fixed 浮层挪到 body、停靠 vs 悬浮、以及精确的 PRD 状态词汇。对话流消息 schema（`{t, name, time, text, items, st, level, ...}`）可直接映射为组件 props。
