# DevUI 设计规范 · 多主题扩展版（AgentSpace）

DevUI 是一套源自华为云实战的企业级前端解决方案，其设计风格以简单、沉浸、灵活为核心，通过高度组件化和 Token 驱动的主题系统，致力于解决中后台开发中的一致性与效率难题。

本文档在 **DevUI 官方三套主题（新无限 / 无限 / 追光）原样不变**的基础上，扩展了 AgentSpace 的 5 套主题：简约浅 / 简约深（墨色）、流光 · 液态玻璃（浅 / 深）、像素风。所有主题共用**同一套 `--devui-*` 变量名**，切换主题只改变取值。

> - 版本 v2.0 · 2026-11-02 · 官方部分来源：[source/devui-official-design.md](source/devui-official-design.md)（DevUI 最新 design.md 原文）
> - 文中所有 `<!-- GEN:* -->` 标记之间的表格均由 `build.py` 生成：官方主题值从上面的原文解析，扩展主题值来自 `tokens.py`。**不要手改表格。**

---

## 1. 主题体系

共 8 套主题，通过根元素上的 `data-theme`（主题族）和 `data-mode`（深色）两个属性切换。

<!-- GEN:themes -->
| 主题 | 来源 | `data-theme` | `data-mode` | 品牌色 | 主按钮 | 气质 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **新无限** | DevUI 官方 | `newInfinity-theme` | — | `#0a59f7` | `#0a59f7` | 官方默认浅色。品牌蓝 #0a59f7，蓝色主按钮。 |
| **无限** | DevUI 官方 | `default` | — | `#5e7ce0` | `#5e7ce0` | 官方备选浅色。品牌淡蓝 #5e7ce0。 |
| **追光** | DevUI 官方 | `default` | `dark` | `#317af7` | `#317af7` | 官方深色。品牌亮蓝 #317af7。 |
| **简约 · 浅（墨）** | AgentSpace 扩展 | `as-ink` | — | `#0a59f7` | `#191919` | AgentSpace 现网风格：墨色主按钮、灰阶分层，蓝色只做链接 / 信息 / 选中。 |
| **简约 · 深（墨）** | AgentSpace 扩展 | `as-ink` | `dark` | `#3d7bff` | `#ededed` | 与简约浅逐变量镜像的中性深灰阶；主按钮反转为浅墨。 |
| **流光 · 液态玻璃 · 浅** | AgentSpace 扩展 | `as-glass` | — | `#0a59f7` | `#0f172a` | 极光渐变底 + 半透明白玻璃面 + 高光描边；焦点 / 运行态用蓝色流光。 |
| **流光 · 液态玻璃 · 深** | AgentSpace 扩展 | `as-glass` | `dark` | `#4d8cff` | `#f1f5ff` | 深夜极光底 + 烟熏玻璃面；面与面靠亮边与模糊区分。 |
| **像素风** | AgentSpace 扩展 | `as-pixel` | — | `#0a59f7` | `#1d1b26` | 米色纸底、2px 实线墨边、0 圆角、硬投影；位移代替模糊，阶跃动效。 |

<!-- /GEN:themes -->

### 1.1 主题识别规则

生成页面时，根据用户提示词中的关键字自动匹配主题：

| 用户提示词关键字 | 匹配主题 | `data-theme` | `data-mode` |
| :--- | :--- | :--- | :--- |
| `"新无限"`、`"新无限主题"` | **新无限**（官方） | `newInfinity-theme` | — |
| `"无限"`、`"无限主题"` | **无限**（官方） | `default` | — |
| `"追光"`、`"追光主题"`；或**只有** `"深色"`、`"暗色"`、`"dark"` | **追光**（官方） | `default` | `dark` |
| `"简约"`、`"墨色"`、`"AgentSpace"`、`"现网风格"` | **简约 · 浅（墨）** | `as-ink` | — |
| 上一行关键字 + `"深色"` / `"暗色"` / `"dark"` | **简约 · 深（墨）** | `as-ink` | `dark` |
| `"流光"`、`"液态玻璃"`、`"玻璃"`、`"毛玻璃"`、`"glass"` | **流光 · 液态玻璃 · 浅** | `as-glass` | — |
| 上一行关键字 + `"深色"` / `"暗色"` / `"dark"` | **流光 · 液态玻璃 · 深** | `as-glass` | `dark` |
| `"像素"`、`"像素风"`、`"pixel"`、`"8-bit"`、`"复古游戏"` | **像素风** | `as-pixel` | — |

**规则**：

1. 先看**风格关键字**决定主题族，再看**明暗关键字**决定是否加 `data-mode="dark"`。
2. 提示词中没有任何主题关键字时，默认使用**新无限主题**（与官方一致）。
3. 只出现 `"深色"` / `"暗色"` / `"dark"`、没有风格关键字时，按官方规则匹配**追光**。
4. `"新无限"` 包含 `"无限"`，匹配时先匹配更长的关键字。
5. 像素风没有深色版本。用户要求"深色像素风"时使用 `as-pixel`，并说明原因。
6. 必须在根元素（如 `<html>`）上同时设置正确的 `data-theme` / `data-mode`，不可遗漏，**不得自创主题名**。

---

## 2. 代码使用方法

### 2.1 CSS（推荐，无需 DevUI 组件库）

```html
<!-- 新无限（默认）: <html data-theme="newInfinity-theme"> -->
<!-- 追光:          <html data-theme="default" data-mode="dark"> -->
<!-- 液态玻璃深色:   <html data-theme="as-glass" data-mode="dark"> -->
<link rel="stylesheet" href="dist/devui-themes.css">
<link rel="stylesheet" href="dist/devui-theme-overrides.css"> <!-- 只有用到扩展主题时才需要 -->
```

```css
.card {
  background: var(--devui-base-bg);
  color: var(--devui-text);
  border-radius: var(--devui-border-radius-card);
  box-shadow: var(--devui-shadow-length-base) var(--devui-light-shadow);
}
```

生成单文件 HTML 时，把 `dist/devui-themes.css` 中目标主题的变量块内联到 `<head>`。如果使用了扩展主题，还要内联 `dist/devui-theme-overrides.css`。

### 2.2 SCSS / LESS（已安装 DevUI 组件库时）

```scss
@import '@devui/theme/styles-var/devui-var.scss';      // 官方变量，$devui-xxx = var(--devui-xxx)
@import 'devui-multitheme/dist/devui-theme-ext.scss';  // 扩展层 $devui-ext-*（按需引入）
.my-component {
  background-color: $devui-brand;
  color: $devui-text;
}
```

LESS 项目改用 `devui-theme-ext.less`，变量前缀 `$` 改为 `@`。

### 2.3 运行时切换

```ts
function setTheme(theme: string, dark = false) {
  const el = document.documentElement;
  el.dataset.theme = theme;               // newInfinity-theme | default | as-ink | as-glass | as-pixel
  dark ? (el.dataset.mode = 'dark') : delete el.dataset.mode;
}
```

如果项目使用 ng-devui 的 `ThemeService`，可以注册 `dist/devui-themes.ts` 中解析好的 8 个 `Theme` 对象。注意：扩展主题的覆盖层（玻璃模糊、像素描边）通过 `data-theme` 属性生效，所以使用 ThemeService 切换时也要同步设置 `data-theme` / `data-mode`。

### 2.4 AgentSpace 现网接入须知

官方约定 `:root` 等同于**新无限**（蓝色主按钮）。AgentSpace 现网是墨色主按钮风格，引入 `devui-themes.css` 后，**根元素必须设置 `data-theme="as-ink"`**，否则页面会回落到新无限的蓝色。`as-ink` 的取值来自 AgentSpace 现网变量表；表中没有的变量按 AgentSpace 规则推断，见 §4.1。

---

## 3. 架构与原则

```
┌──────────────────────────────────────────────────────────────────────────┐
│ L3  组件覆盖层   dist/devui-theme-overrides.css（手写）                      │
│     只作用于 [data-theme^="as-"]：backdrop-filter / 描边宽度 / 按下位移 / 字体 │
├──────────────────────────────────────────────────────────────────────────┤
│ L2  语义变量    --devui-*      官方 174 个，名字与官方完全一致                 │
│                --devui-ext-*  扩展 15 个：材质 / 几何 / 字体 / 主色上文字      │
├──────────────────────────────────────────────────────────────────────────┤
│ L1  主题取值    官方 3 套：原样收录（含色阶）                                  │
│                扩展 5 套：tokens.py 中逐变量给值，未给值的继承 parent 主题       │
└──────────────────────────────────────────────────────────────────────────┘
```

1. **官方主题原样不动。** 新无限 / 无限 / 追光的变量名、取值、选择器、继承关系（追光叠加在无限之上，无限叠加在 `:root` 新无限之上）与官方文档逐字一致，由 `build.py` 直接从原文解析。
2. **扩展主题必须覆盖全部官方变量。** 5 套扩展主题会为全部 174 个官方语义变量输出完整取值，不依赖 `:root` 回落，所以任何变量都不会意外显示新无限的蓝色。缺任何一个，build 都会报错。
3. **语义不漂移。** 同一个变量在所有主题中承担同一个职责。例如 `--devui-primary` 永远是主按钮底色，`--devui-light-text` 永远是"有色深底上的文字"。
4. **颜色以外的差异放扩展层。** 玻璃模糊、像素 2px 描边、像素字体，统一放进 `--devui-ext-*` 和 L3 覆盖层。扩展变量在官方主题下都取"无效果"值（`0px`、`none`、`transparent`）。动效、全圆角、标题字重已经有官方变量，扩展主题直接改这些官方变量的取值，不另造变量。
5. **不自创变量。** 扩展层之外，只有 10 个"兼容变量"不在官方清单里（见 §5），它们是 AgentSpace 现网或开源 ng-devui 组件实际在用的变量，只在扩展主题中输出。

---

## 4. 主题风格说明

### 官方主题（摘要，详见官方原文）

| 主题 | 要点 |
| :--- | :--- |
| 新无限 | 品牌蓝 `#0a59f7` 用于主按钮、链接、表单聚焦；灰阶底 `#f3f3f3` + 白色区块；圆角 4 / 8 / 16 |
| 无限 | 品牌淡蓝 `#5e7ce0`；辅助文本偏蓝灰（`#575d6c`）；阴影色带蓝调 `rgba(37,43,58,…)` |
| 追光 | 深底 `#16181a` → 区块 `#2a2a2a` → 浮层 `#2e2f33`；品牌亮蓝 `#317af7`；阴影浓度高达 `.3–.72` |

### 4.1 简约 · 浅（墨）`as-ink`

- 取值来自 AgentSpace 现网变量表。主按钮为墨色 `#191919`，表单聚焦也用墨色描边加 8% 外环。
- 现网表中没有的官方变量按 AgentSpace 规则补齐：`--devui-brand*` 取蓝（`#0a59f7`，用于选中态：Tabs、复选框、开关等），动效 / 层级 / 按钮内边距继承新无限，通用按钮的边框和文字色跟随墨色体系。
- ⚠️ **推断值**：`--devui-brand*` 是按"蓝色只用于选中 / 聚焦 / 运行中"的规则推断的。现网变量表里 `--devui-primary` 的注释是"同品牌色"，所以现网 brand 也可能是墨色 `#191919`，需要对照现网组件库核对（§15）。

### 4.2 简约 · 深（墨）`as-ink` + `dark`

- 灰阶分 5 级：页面 `#141415` → 区块 `#1c1c1e` → 浮层 `#232326 / #26262a` → 悬停 `#2a2a2d` → 选中 `#303034`。层级越高颜色越亮，以此代替阴影来表达层级。
- 主按钮反转为浅墨 `#ededed`。按钮文字**必须**改用 `--devui-ext-on-primary`（`#121213`），覆盖层已经统一处理（§10 第 1 条）。
- `--devui-brand` 和常亮蓝提亮为 `#3d7bff`，保证白色对勾在品牌色实底上依然可读。状态底色改为低明度的深色。

### 4.3 流光 · 液态玻璃 `as-glass`（浅 / 深）

- **底图**：`--devui-ext-backdrop` 是三团径向渐变叠出的极光效果（蓝 / 粉紫 / 青）。`--devui-global-bg` 保留一个纯色作为兜底。
- **面**：`--devui-base-bg` 等区块变量为半透明值（浅色约白 62%，深色约烟熏蓝 55%），配合 `blur(24–28px) saturate(160–180%)` 形成玻璃效果。**只有半透明色、没有模糊是不成立的**，由覆盖层统一加上模糊。
- **边**：1px 亮边 `--devui-ext-material-edge` 加顶部内高光 `--devui-ext-material-highlight`。面与面之间靠"亮边 + 模糊"区分，不靠灰阶差。
- **流光**：`--devui-ext-accent-glow` 是蓝 → 紫 → 青的线性渐变，**只**用于运行中、Agent 思考中、进度条（`.as-glow-border`）。
- **几何与动效**：圆角放大到 12 / 14 / 20 / 28（card-xl）；阴影为大半径低浓度；`--devui-animation-duration-*` 放慢到 160 / 300 / 420ms，缓出曲线改为弹性减速 `cubic-bezier(0.32, 0.72, 0, 1)`。
- 深色玻璃的 Toast / Tooltip 反转为浅色玻璃（`rgba(240,244,255,.9)` 配深字），让反馈层在深色场景里足够醒目。

### 4.4 像素风 `as-pixel`

- **色板**：米色纸底 `#f4efe1` + 近黑墨 `#1d1b26`，配一组 8-bit 风格的状态色（红 `#e43b44`、橙 `#f77622`、绿 `#3e8948`）。品牌色仍为 `#0a59f7`。
- **几何**：所有圆角为 `0`（包括 `--devui-border-radius-full`，开关和进度条也是方的）；描边 2px 实线墨色；阴影零模糊硬位移（`4px 4px 0` / 浮层 `8px 8px 0`），阴影色全部为实色墨。官方的 `shadow-length + shadow` 组合语法可以直接得到硬投影。
- **选中**：列表选中用黄色高亮 `#ffd84d` 配墨字，类似老游戏菜单里的光标效果。
- **字体**：标题、按钮、数字使用像素字体 `--devui-ext-font-family-display`（Fusion Pixel / Zpix，支持中文，需要随应用一起打包），正文保持无衬线字体。`--devui-font-title-weight` 设为 `normal`，因为像素字体没有粗体。
- **动效**：所有 `--devui-animation-ease-*` 改为 `steps(3, end)` 阶跃，时长缩短到 80 / 160 / 240ms。按钮按下时位移 2px，投影从 4px 缩短到 2px。
- 毛玻璃变量（`--devui-glass-morphism-*`）取消透明，因为像素风不允许出现模糊。

---

## 5. 全量变量映射

> - 第一列为 CSS 变量名；对应的 SCSS 变量为 `$devui-xxx`，LESS 为 `@devui-xxx`。
> - **〃** 表示与左侧一列取值相同；**—** 表示该主题未定义此变量（组件使用自身回退值）。
> - 新无限官方未定义 `--devui-danger`，这是官方原文如此，没有补值。
> - 间距（4 / 8 / 12 / 16 / 20 / 24 / 32 / 40）不随主题变化；像素风同样对齐 4px 网格。

<!-- GEN:mapping -->
#### 字号与字重

> 字号不随主题变化，保证布局稳定；像素风通过扩展字体族改变气质而非改字号。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-font-size` | `14px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 正文、帮助信息字号 |
| `--devui-font-size-card-title` | `16px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 卡片标题字号 |
| `--devui-font-size-page-title` | `16px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 页面标题字号 |
| `--devui-font-size-modal-title` | `18px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 弹窗标题字号 |
| `--devui-font-size-price` | `20px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 价格字号 |
| `--devui-font-size-data-overview` | `24px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 数据总览字号 |
| `--devui-font-size-icon` | `16px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 图标大小 |
| `--devui-font-size-sm` | `12px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 小控件文字大小 |
| `--devui-font-size-md` | `14px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 中控件文字大小 |
| `--devui-font-size-lg` | `14px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 大控件文字大小 |
| `--devui-font-content-weight` | `normal` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 内容文字粗细 |
| `--devui-line-height-base` | `1.5` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 规范行高 |
| `--devui-font-title-weight` | `bold` | 〃 | 〃 | 〃 | 〃 | `600` | 〃 | `normal` | 标题文字粗细 |

#### 阴影几何

> 用法为 `box-shadow: var(--devui-shadow-length-xxx) var(--devui-xxx-shadow)`。像素风把几何改为零模糊硬位移，玻璃风改为大半径柔光。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-shadow-length-base` | `0 1px 6px 0` | `0 2px 6px 0` | `0 1px 6px 0` | `0 2px 6px 0` | 〃 | `0 8px 24px 0` | 〃 | `4px 4px 0 0` | 基础阴影长度（Card 等） |
| `--devui-shadow-length-slide-left` | `-2px 0 8px 0` | 〃 | 〃 | 〃 | 〃 | `-4px 0 16px 0` | 〃 | `-3px 0 0 0` | 向左滑动阴影长度 |
| `--devui-shadow-length-slide-right` | `2px 0 8px 0` | 〃 | 〃 | 〃 | 〃 | `4px 0 16px 0` | 〃 | `3px 0 0 0` | 向右滑动阴影长度 |
| `--devui-shadow-length-connected-overlay` | `0 4px 12px 0` | `0 2px 12px 0` | `0 4px 12px 0` | `0 2px 12px 0` | 〃 | `0 12px 32px 0` | 〃 | `4px 4px 0 0` | 弹出层阴影长度 |
| `--devui-shadow-length-hover` | `0 8px 24px 0` | `0 4px 16px 0` | `0 8px 24px 0` | `0 4px 16px 0` | 〃 | `0 16px 40px 0` | 〃 | `6px 6px 0 0` | 悬浮阴影长度 |
| `--devui-shadow-length-feedback-overlay` | `0 8px 24px 0` | `0 4px 16px 0` | `0 8px 16px 0` | `0 4px 16px 0` | 〃 | `0 16px 40px 0` | 〃 | `4px 4px 0 0` | 反馈层阴影长度 |
| `--devui-shadow-length-fullscreen-overlay` | `0 16px 48px 0` | `0 10px 24px 0` | `0 0 6px 0` | `0 10px 24px 0` | 〃 | `0 24px 64px 0` | 〃 | `8px 8px 0 0` | 全屏弹出层阴影长度 |

#### 圆角

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-border-radius` | `4px` | 〃 | 〃 | `6px` | 〃 | `12px` | 〃 | `0px` | 一般圆角 |
| `--devui-border-radius-feedback` | `4px` | 〃 | 〃 | `6px` | 〃 | `14px` | 〃 | `0px` | 反馈类圆角 |
| `--devui-border-radius-card` | `8px` | 〃 | 〃 | 〃 | 〃 | `20px` | 〃 | `0px` | 卡片圆角 |
| `--devui-border-radius-full` | `100px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | `0px` | 全圆角（胶囊形） |
| `--devui-border-radius-card-xl` | `16px` | 〃 | 〃 | 〃 | 〃 | `28px` | 〃 | `0px` | 大卡片圆角 |

#### 背景色

> 玻璃主题中大多数面为半透明色值，必须配合扩展层的 `material-blur` 才成立（见 §8）。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-global-bg` | `#f3f3f3` | 〃 | `#16181a` | `#f5f5f5` | `#141415` | `#eef1f8` | `#0b0d14` | `#f4efe1` | 全局带底色背景 |
| `--devui-glass-morphism-bg` | `rgba(243, 243, 243, 0.9)` | `rgba(245, 245, 245, 0.9)` | `rgba(26, 26, 28, 0.9)` | `rgba(245, 245, 245, 0.9)` | `rgba(20, 20, 21, 0.9)` | `rgba(255, 255, 255, 0.55)` | `rgba(20, 23, 34, 0.6)` | `#f4efe1` | 毛玻璃样式背景色 |
| `--devui-glass-morphism-overlay-bg` | `rgba(255, 255, 255, 0.9)` | 〃 | 〃 | 〃 | `rgba(36, 36, 38, 0.9)` | `rgba(255, 255, 255, 0.72)` | `rgba(30, 34, 48, 0.72)` | `#fffdf6` | 毛玻璃覆盖层背景 |
| `--devui-glass-morphism-floating-container-bg` | `rgba(255, 255, 255, 0.9)` | 〃 | `rgba(0, 0, 0, 0.9)` | `rgba(255, 255, 255, 0.9)` | `rgba(36, 36, 38, 0.9)` | `rgba(255, 255, 255, 0.72)` | `rgba(30, 34, 48, 0.72)` | `#fffdf6` | 毛玻璃浮动容器背景 |
| `--devui-global-bg-normal` | `#ffffff` | 〃 | `#202124` | `#ffffff` | `#1c1c1e` | `rgba(255, 255, 255, 0.62)` | `rgba(28, 32, 46, 0.55)` | `#fffdf6` | 全局白色背景 |
| `--devui-base-bg` | `#ffffff` | 〃 | `#2a2a2a` | `#ffffff` | `#1c1c1e` | `rgba(255, 255, 255, 0.62)` | `rgba(28, 32, 46, 0.55)` | `#fffdf6` | 基础区块背景白色，大面积不可折叠区块背景 |
| `--devui-base-bg-dark` | `#000000` | `#252b3a` | `#2e2f31` | `#252b3a` | `#0d0d0e` | `#1b1f2e` | `#05060a` | `#1d1b26` | 基础区块背景深色（固定） |
| `--devui-icon-hover-bg` | `#dfdfdf` | `#EBEBEB` | `#393939` | `#f5f5f5` | `#2a2a2d` | `rgba(15, 23, 42, 0.06)` | `rgba(255, 255, 255, 0.08)` | `#ece4cf` | 图标悬停背景色 |
| `--devui-icon-active-bg` | `#aeaeae` | 〃 | `#4e5057` | `#f5f5f5` | `#2f2f33` | `rgba(15, 23, 42, 0.1)` | `rgba(255, 255, 255, 0.12)` | `#e2d7bb` | 图标激活背景色 |
| `--devui-area` | `#f5f5f5` | 〃 | `#34363A` | `#f5f5f5` | `#232326` | `rgba(255, 255, 255, 0.38)` | `rgba(255, 255, 255, 0.04)` | `#f4efe1` | 可折叠区块背景 |
| `--devui-icon-bg` | `#ffffff` | 〃 | `#2E2F31` | `#ffffff` | `#1c1c1e` | `rgba(255, 255, 255, 0.7)` | `rgba(255, 255, 255, 0.06)` | `#fffdf6` | SVG 图标背景色 |
| `--devui-form-control-bg` | `#ffffff` | 〃 | `#292a2e` | `#ffffff` | `#1f1f22` | `rgba(255, 255, 255, 0.72)` | `rgba(255, 255, 255, 0.06)` | `#ffffff` | 表单控件背景色 |
| `--devui-list-item-active-bg` | `#e6eeff` | `#e1e8fd` | `#393939` | `#e6e6e6` | `#303034` | `rgba(15, 23, 42, 0.08)` | `rgba(255, 255, 255, 0.12)` | `#ffd84d` | 列表单选选中背景 |
| `--devui-list-item-active-hover-bg` | `#e9edfa` | `#e1e8fd` | `#33384b` | `#d5d5db` | `#3a3a3f` | `rgba(15, 23, 42, 0.12)` | `rgba(255, 255, 255, 0.16)` | `#ffcc1a` | 列表单选选中悬停背景 |
| `--devui-list-item-hover-bg` | `rgba(25, 25, 25, 0.05)` | 〃 | `rgba(206, 209, 219, 0.05)` | `#f5f5f5` | `#2a2a2d` | `rgba(15, 23, 42, 0.05)` | `rgba(255, 255, 255, 0.07)` | `#ece4cf` | 列表普通选项悬停背景 |
| `--devui-list-item-selected-bg` | `#cedefd` | `#e1e8fd` | `#33384b` | `#d5d5db` | `#34343a` | `rgba(10, 89, 247, 0.1)` | `rgba(77, 140, 255, 0.18)` | `#c9e4ff` | 列表多选选中行色 |
| `--devui-list-item-strip-bg` | `#f2f5fc` | 〃 | `#383838` | `#f2f5fc` | `#202024` | `rgba(255, 255, 255, 0.35)` | `rgba(255, 255, 255, 0.03)` | `#f8f3e6` | 列表斑马纹色 |
| `--devui-disabled-bg` | `#f5f5f5` | 〃 | `#2d2e32` | `#ebebeb` | `#2a2a2c` | `rgba(15, 23, 42, 0.05)` | `rgba(255, 255, 255, 0.05)` | `#e6e0d0` | 禁用背景色 |
| `--devui-disabled-fill-bg` | `#f3f3f3` | 〃 | `#2e2f33` | `#f0f0f0` | `#262628` | `rgba(15, 23, 42, 0.04)` | `rgba(255, 255, 255, 0.04)` | `#ece6d6` | 禁用填充背景色 |
| `--devui-primary-disabled` | `#9dbdfc` | `#beccfa` | `#003d83` | `#f0f0f0` | `#2a2a2c` | `rgba(15, 23, 42, 0.06)` | `rgba(255, 255, 255, 0.06)` | `#e6e0d0` | 主要按钮禁用文字色 |
| `--devui-label-bg` | `#f0f0f0` | 〃 | `#353537` | `#f0f0f0` | `#2c2c2f` | `rgba(255, 255, 255, 0.6)` | `rgba(255, 255, 255, 0.08)` | `#ece4cf` | 标签化选项背景色 |
| `--devui-connected-overlay-bg` | `#ffffff` | 〃 | `#2e2f33` | `#ffffff` | `#26262a` | `rgba(255, 255, 255, 0.78)` | `rgba(32, 36, 52, 0.78)` | `#fffdf6` | 有连接点的弹出菜单背景色 |
| `--devui-fullscreen-overlay-bg` | `#ffffff` | 〃 | `#2e2f33` | `#ffffff` | `#232326` | `rgba(255, 255, 255, 0.82)` | `rgba(28, 32, 46, 0.82)` | `#fffdf6` | 全屏弹出内容层背景（模态弹窗） |
| `--devui-feedback-overlay-bg` | `#2a2a2a` | 〃 | `#4e5057` | `#2a2a2a` | `#3a3a3e` | `rgba(28, 32, 46, 0.78)` | `rgba(240, 244, 255, 0.9)` | `#1d1b26` | 信息提示反馈漂浮层背景 |
| `--devui-feedback-overlay-backdrop` | `rgba(0, 0, 0, 0.3)` | 〃 | `rgba(0, 0, 0, 0.72)` | `rgba(0, 0, 0, 0.3)` | `rgba(0, 0, 0, 0.6)` | `rgba(15, 23, 42, 0.18)` | `rgba(0, 0, 0, 0.5)` | `rgba(29, 27, 38, 0.5)` | 反馈覆盖层遮罩 |
| `--devui-embed-search-bg` | `#f2f2f3` | 〃 | `#383838` | `#f2f2f3` | `#26262a` | `rgba(255, 255, 255, 0.5)` | `rgba(255, 255, 255, 0.06)` | `#f4efe1` | 被嵌套无边框搜索框背景 |
| `--devui-embed-search-bg-hover` | `#f5f5f5` | `#eef0f5` | `#3D3E40` | `#eef0f5` | `#2c2c30` | `rgba(255, 255, 255, 0.7)` | `rgba(255, 255, 255, 0.1)` | `#ece4cf` | 被嵌套搜索框悬停背景 |
| `--devui-highlight-overlay` | `rgba(255, 255, 255, 0.8)` | 〃 | `rgba(255, 255, 255, 0.1)` | `rgba(255, 255, 255, 0.8)` | `rgba(20, 20, 21, 0.8)` | `rgba(255, 255, 255, 0.6)` | `rgba(11, 13, 20, 0.6)` | `rgba(244, 239, 225, 0.9)` | 局部半透明全局浮层背景 |
| `--devui-range-item-hover-bg` | `#e9edfa` | `#e1e8fd` | `#454545` | `#f5f5f5` | `#2a2a2d` | `rgba(15, 23, 42, 0.05)` | `rgba(255, 255, 255, 0.07)` | `#ece4cf` | DatePicker 范围日期悬停背景 |
| `--devui-gray-form-control-bg` | `rgba(223, 223, 223, 0.5)` | 〃 | `#16181a` | `rgba(223, 223, 223, 0.5)` | `rgba(255, 255, 255, 0.06)` | `rgba(255, 255, 255, 0.45)` | `rgba(255, 255, 255, 0.06)` | `#ece4cf` | 灰色模式输入框默认背景 |
| `--devui-gray-form-control-hover-bg` | `#dfdfdf` | `#c9c9c9` | `#393939` | `#c9c9c9` | `rgba(255, 255, 255, 0.12)` | `rgba(255, 255, 255, 0.65)` | `rgba(255, 255, 255, 0.1)` | `#e2d7bb` | 灰色模式输入框悬停背景 |
| `--devui-nav-expand-bg` | `#fafafa` | 〃 | `#16181a` | `#fafafa` | `#18181a` | `rgba(255, 255, 255, 0.4)` | `rgba(255, 255, 255, 0.03)` | `#f8f3e6` | 菜单展开区域背景 |
| `--devui-danger-bg` | `#fee7e8` | `#ffd5d4` | `#350305` | `#fce2e0` | `#3d1d1d` | `rgba(242, 48, 48, 0.12)` | `rgba(255, 90, 95, 0.16)` | `#ffd6d1` | 失败底色 |
| `--devui-warning-bg` | `#fde2bd` | `#ffe1c7` | `#3d1601` | `#ffebd1` | `#3d2a12` | `rgba(255, 136, 0, 0.14)` | `rgba(255, 165, 61, 0.16)` | `#ffe7b8` | 警告底色 |
| `--devui-info-bg` | `#cedefd` | `#e1e8fd` | `#1c2543` | `#cedefd` | `#14254a` | `rgba(10, 89, 247, 0.12)` | `rgba(77, 140, 255, 0.18)` | `#cfe0ff` | 通知底色 |
| `--devui-success-bg` | `#e7fbf2` | `#cffcee` | `#00291d` | `#d5f2dc` | `#10331d` | `rgba(0, 179, 54, 0.12)` | `rgba(52, 211, 113, 0.16)` | `#cdf2c8` | 成功底色 |
| `--devui-primary-bg` | `#e6eeff` | `#f2f5fc` | `#383D4F` | `#e6eeff` | `#172440` | `rgba(10, 89, 247, 0.08)` | `rgba(77, 140, 255, 0.12)` | `#dfe8ff` | 主要底色 |
| `--devui-default-bg` | `#fafafa` | `#f7f8fa` | `#313131` | `#f7f8fa` | `#222225` | `rgba(255, 255, 255, 0.5)` | `rgba(255, 255, 255, 0.05)` | `#f4efe1` | 默认底色 |
| `--devui-table-expand-area-bg` | `#DFDFDF` | `#EBEBEB` | `#393a3e` | `#ebebeb` | `#232326` | `rgba(255, 255, 255, 0.38)` | `rgba(255, 255, 255, 0.04)` | `#ece4cf` | 表格展开区域背景 |

#### 品牌与状态色

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-brand` | `#0a59f7` | `#5e7ce0` | `#317af7` | `#0a59f7` | `#3d7bff` | `#0a59f7` | `#4d8cff` | `#0a59f7` | 品牌色 |
| `--devui-brand-foil` | `#f2f2f3` | 〃 | 〃 | 〃 | `#2a2a2d` | `rgba(255, 255, 255, 0.6)` | `rgba(255, 255, 255, 0.08)` | `#ece4cf` | 品牌色辅助色、正衬色 |
| `--devui-brand-hover` | `#3979f9` | `#7693f5` | `#5e7ce0` | `#3a7bff` | `#5c93ff` | `#3a7bff` | `#7aa7ff` | `#3a7bff` | 品牌色高亮色（加亮） |
| `--devui-brand-active` | `#0950de` | `#526ecc` | 〃 | `#0950de` | `#2f6af0` | `#0950de` | `#3a78f0` | `#0640b3` | 品牌色激活色（加深） |
| `--devui-brand-active-focus` | `#00196b` | `#344899` | 〃 | `#073fae` | `#1e4fc2` | `#073fae` | `#2a5cc7` | `#04308a` | 品牌色焦点色（重度加深） |
| `--devui-contrast` | `#c7000b` | 〃 | `#C7000B` | `#c7000b` | `#ff4d55` | `#c7000b` | `#ff4d55` | `#e4002b` | 品牌色撞色、对比色、第二品牌色 |
| `--devui-danger` | — | `#e7625d` | `#e7434a` | `#f23030` | `#f5484d` | `#f23030` | `#ff5a5f` | `#e43b44` | 失败、错误、告警 |
| `--devui-warning` | `#f4840c` | `#f7841f` | `#fac20a` | `#ff8800` | `#ff9a2e` | `#ff8800` | `#ffa53d` | `#f77622` | 警告、需注意类型提示 |
| `--devui-waiting` | `#6b9bfa` | `#beccfa` | `#5e6580` | `#6b9bfa` | `#4f7fd9` | `#6b9bfa` | 〃 | `#5b8cff` | 等待中 |
| `--devui-success` | `#09aa71` | `#2eb78a` | `#058358` | `#00b336` | `#1fbf55` | `#00b336` | `#34d371` | `#3e8948` | 成功、正确 |
| `--devui-info` | `#0a59f7` | `#5e7ce0` | `#526ecc` | `#0a59f7` | `#3d7bff` | `#0a59f7` | `#4d8cff` | `#0a59f7` | 通知、一般提示、执行中 |
| `--devui-initial` | `#cedefd` | `#e1e8fd` | `#64676e` | `#cedefd` | `#1e3466` | `rgba(10, 89, 247, 0.18)` | `rgba(77, 140, 255, 0.24)` | `#cfe0ff` | 初始化、未执行 |
| `--devui-unavailable` | `#f5f5f5` | 〃 | `#5b5b5c` | `#f5f5f5` | `#2a2a2c` | `rgba(15, 23, 42, 0.05)` | `rgba(255, 255, 255, 0.06)` | `#e6e0d0` | 不可用、禁用状态 |
| `--devui-primary` | `#0a59f7` | `#5e7ce0` | `#317af7` | `#191919` | `#ededed` | `#0f172a` | `#f1f5ff` | `#1d1b26` | 主要按钮，同品牌色 |
| `--devui-primary-hover` | `#3979f9` | `#7693f5` | `#5291ff` | `#595959` | `#d4d4d4` | `#334155` | `#ffffff` | `#3a3646` | 主要按钮悬停 |
| `--devui-primary-active` | `#0950de` | `#465eb8` | `#317af7` | `#595959` | `#bdbdbd` | `#1e293b` | `#d6deef` | `#000000` | 主要按钮激活 |
| `--devui-contrast-hover` | `#e7434a` | `#de504e` | `#ee696f` | `#cc272a` | `#ff6b71` | `#cc272a` | `#ff7076` | `#ff2a4a` | 突出按钮悬停 |
| `--devui-contrast-active` | `#c7000b` | `#b02121` | `#B12220` | `#78080e` | `#b3000a` | `#78080e` | `#b3000a` | `#9e001e` | 突出按钮激活 |
| `--devui-logo` | `#c6020b` | `#c7000b` | `#c6020b` | `#c7000b` | 〃 | `#c6020b` | 〃 | `#e4002b` | Logo 颜色 |
| `--devui-constant-blue` | `#0a59f7` | `#5e7ce0` | `#317af7` | `#0a59f7` | `#3d7bff` | `#0a59f7` | `#4d8cff` | `#0a59f7` | 常亮蓝色 |
| `--devui-constant-blue-hover` | `#3979f9` | `#7693f5` | `#5291ff` | `#3979f9` | `#5c93ff` | `#3979f9` | `#7aa7ff` | `#3979f9` | 常亮蓝色悬停色 |
| `--devui-constant-blue-active` | `#0950de` | `#526ecc` | `#002794` | `#0950de` | `#2f6af0` | `#0950de` | `#3a78f0` | `#0950de` | 常亮蓝色激活色 |
| `--devui-constant-blue-disabled` | `#9dbdfc` | `#beccfa` | `#fcce92` | `#9dbdfc` | `#1e3466` | `#9dbdfc` | `rgba(77, 140, 255, 0.3)` | `#9dbdfc` | 常亮蓝色禁用色 |
| `--devui-constant-blue-rippling` | `rgba(10, 89, 247, 0.08)` | `rgba(94, 124, 224, 0.08)` | `rgba(49, 122, 247, 0.08)` | `rgba(10, 89, 247, 0.08)` | `rgba(61, 123, 255, 0.1)` | `rgba(10, 89, 247, 0.08)` | `rgba(77, 140, 255, 0.1)` | `rgba(10, 89, 247, 0.08)` | 常亮蓝色波纹色 |

#### 文字 / 图标色

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-text` | `#191919` | 〃 | `#ced1db` | `#191919` | `#ededed` | `#0f172a` | `#eef2ff` | `#1d1b26` | 正文文本 |
| `--devui-text-weak` | `#333333` | `#575d6c` | `#A0A0A0` | `#575d6c` | `#b4b4b8` | `#475569` | `#b6bdd1` | `#4a4658` | 弱化的正文信息 |
| `--devui-aide-text` | `#777777` | 〃 | `#868a99` | `#595959` | `#9a9a9f` | `#5b6478` | `#9aa3ba` | `#5f5a6e` | 辅助文本、帮助信息 |
| `--devui-aide-text-hover` | `#000000` | `#252b3a` | `#73788a` | `#252b3a` | `#ededed` | `#0f172a` | `#ffffff` | `#1d1b26` | 辅助文本悬浮色 |
| `--devui-aide-text-stress` | `#333333` | `#575d6c` | `#A0A0A0` | `#575d6c` | `#c4c4c8` | `#475569` | `#c3cadc` | `#4a4658` | 辅助文本中的强调色 |
| `--devui-placeholder` | `#aeaeae` | `#babbc0` | `#5b5d66` | `#babbc0` | `#5f5f64` | `#94a3b8` | `#5f6782` | `#9c96a8` | 占位符文本 |
| `--devui-light-text` | `#ffffff` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | `#fffdf6` | 有色深色背景下字体颜色（固定） |
| `--devui-dark-text` | `#000000` | `#252b3a` | 〃 | 〃 | 〃 | 〃 | 〃 | `#1d1b26` | 有色浅色背景下字体颜色（固定） |
| `--devui-link` | `#0a59f7` | `#526ecc` | `#317af7` | `#0a59f7` | `#5c93ff` | `#0a59f7` | `#7aa7ff` | `#0a59f7` | 链接文本颜色 |
| `--devui-link-active` | `#0950de` | `#465eb8` | `#317af7` | `#0950de` | `#85adff` | `#0950de` | `#a8c5ff` | `#0640b3` | 链接文本悬停/激活颜色 |
| `--devui-link-light` | `#6b9bfa` | `#96adfa` | `#6b9bfa` | 〃 | 〃 | 〃 | 〃 | `#7fb0ff` | 深色背景下链接文本颜色 |
| `--devui-link-light-active` | `#beccfa` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | `#c9e4ff` | 深色背景下链接文本激活色 |
| `--devui-link-disabled` | `#777777` | 〃 | `#808080` | `#777777` | `#6a6a6e` | `#94a3b8` | `#5f6782` | `#9c96a8` | 链接禁用色 |
| `--devui-danger-text` | `#e02128` | `#d44644` | `#e7434a` | `#f23030` | `#ff6b6f` | `#cc1f24` | `#ff7a7f` | `#c42430` | 失败文本色 |
| `--devui-warning-text` | `#f4840c` | `#e37d29` | `#f4840c` | `#ff8800` | `#ffa64d` | `#d97000` | `#ffb366` | `#b85a00` | 警告文本色 |
| `--devui-success-text` | `#058358` | `#088c58` | `#058358` | `#029931` | `#3fd06f` | `#027a2a` | `#4ade80` | `#2e6b36` | 成功文本色 |
| `--devui-icon-text` | `#808080` | `#71757f` | `#868a99` | `#808080` | `#8a8a8f` | `#64748b` | `#9aa3ba` | `#5f5a6e` | 文字图标颜色 |
| `--devui-icon-fill` | `#191919` | 〃 | `#868a99` | `#191919` | `#ededed` | `#0f172a` | `#eef2ff` | `#1d1b26` | SVG 图标灰色填充色 |
| `--devui-icon-fill-weak` | `#777777` | 〃 | `#696c75` | `#777777` | `#8a8a8f` | `#64748b` | `#8790a8` | `#5f5a6e` | SVG 弱化图标灰色填充色 |
| `--devui-icon-fill-hover` | `#3979f9` | `#7693f5` | `#5291ff` | `#191919` | `#ffffff` | `#0f172a` | `#ffffff` | `#1d1b26` | SVG 图标填充色悬停反馈色 |
| `--devui-icon-fill-active` | `#0a59f7` | `#5e7ce0` | `#317af7` | `#191919` | `#ffffff` | `#0f172a` | `#ffffff` | `#1d1b26` | SVG 图标高亮填充色（激活） |
| `--devui-icon-fill-active-hover` | `#000000` | `#252b3a` | `#ced1db` | `#252b3a` | `#d4d4d4` | `#334155` | `#d6deef` | `#3a3646` | SVG 图标高亮填充色悬停反馈色 |
| `--devui-shape-icon-fill` | `#939393` | 〃 | `#4e5057` | `#939393` | `#7a7a7f` | `#94a3b8` | `#7c859d` | `#8b8598` | SVG 面型图标颜色 |
| `--devui-shape-icon-fill-hover` | `#777777` | 〃 | `#696c75` | `#777777` | `#9a9a9f` | `#64748b` | `#9aa3ba` | `#5f5a6e` | SVG 面型图标悬停色 |
| `--devui-shape-icon-fill-active` | `#777777` | 〃 | `#696c75` | `#777777` | `#9a9a9f` | `#64748b` | `#9aa3ba` | `#5f5a6e` | SVG 面型图标激活色 |
| `--devui-shape-icon-fill-disabled` | `#dfdfdf` | 〃 | `#393939` | `#dfdfdf` | `#3a3a3e` | `rgba(15, 23, 42, 0.15)` | `rgba(255, 255, 255, 0.14)` | `#d4cdbb` | SVG 面型图标禁用色 |
| `--devui-list-item-active-text` | `#000000` | `#252b3a` | `#526ecc` | `#191919` | `#ededed` | `#0f172a` | `#eef2ff` | `#1d1b26` | 列表单选选中文本 |
| `--devui-list-item-hover-text` | `#000000` | `#252b3a` | `#f5f5f5` | `#191919` | `#ededed` | `#0f172a` | `#eef2ff` | `#1d1b26` | 列表普通选项悬停文本 |
| `--devui-disabled-text` | `#c9c9c9` | 〃 | `rgba(255, 255, 255, 0.3)` | `#c2c2c2` | `#5a5a5e` | `rgba(15, 23, 42, 0.32)` | `rgba(238, 242, 255, 0.3)` | `#a8a294` | 禁用文字色 |
| `--devui-icon-fill-active-disabled` | `#beccfa` | 〃 | `#2B3458` | `#595959` | `#6a6a6e` | `#64748b` | `#5f6782` | `#8b8598` | SVG 图标激活状态禁用色 |
| `--devui-feedback-overlay-text` | `#f0f0f0` | `#dfe1e6` | `#DFE1E6` | `#dfe1e6` | `#ededed` | `#f1f5f9` | `#0f172a` | `#fffdf6` | 信息提示反馈层文本色 |
| `--devui-place` | `#aeaeae` | 〃 | `#808080` | `#aeaeae` | `#5f5f64` | `#94a3b8` | `#5f6782` | `#9c96a8` | 占位色 |
| `--devui-link-light-disabled` | `#777777` | `#C2C2C2` | `#4e5057` | `#777777` | `#4a4a4f` | `#94a3b8` | `#4a5068` | `#9c96a8` | 深色背景下链接禁用色 |
| `--devui-icon-active-color` | `#0950DE` | `#5E7CE0` | `#ffffff` | `#191919` | `#ffffff` | `#0a59f7` | `#ffffff` | `#1d1b26` | 图标激活颜色 |

#### 边框色

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-line` | `#dfdfdf` | 〃 | `#4e5057` | `#c2c2c2` | `#3a3a3f` | `rgba(15, 23, 42, 0.14)` | `rgba(255, 255, 255, 0.12)` | `#1d1b26` | 边框分割线，仅用于边框 |
| `--devui-dividing-line` | `#f3f3f3` | 〃 | `#323338` | `#d5d5db` | `#2c2c30` | `rgba(15, 23, 42, 0.08)` | `rgba(255, 255, 255, 0.07)` | `#d4c9ac` | 内容分割线 |
| `--devui-form-control-line` | `#c9c9c9` | 〃 | `#4e5057` | `#c2c2c2` | `#3f3f44` | `rgba(15, 23, 42, 0.24)` | `rgba(255, 255, 255, 0.14)` | `#1d1b26` | 表单控件边框色 |
| `--devui-form-control-line-hover` | `#191919` | 〃 | `#868a99` | `#191919` | `#8a8a8f` | `rgba(15, 23, 42, 0.4)` | `rgba(255, 255, 255, 0.32)` | `#1d1b26` | 表单控件边框悬停反馈色 |
| `--devui-form-control-line-active` | `#0a59f7` | `#5e7ce0` | `#317af7` | `#191919` | `#ededed` | `#0a59f7` | `#4d8cff` | `#0a59f7` | 表单控件边框激活色 |
| `--devui-form-control-interactive-outline` | `rgba(94, 124, 224, 0.08)` | 〃 | `rgba(82,110,204,0.08)` | `rgba(25, 25, 25, 0.08)` | `rgba(237, 237, 237, 0.1)` | `rgba(10, 89, 247, 0.16)` | `rgba(77, 140, 255, 0.2)` | `#9cc0ff` | 表单控件边框激活外框阴影 |
| `--devui-form-control-line-active-hover` | `#344899` | 〃 | 〃 | `#595959` | `#c4c4c8` | `#3a7bff` | `#7aa7ff` | `#0640b3` | 表单控件边框激活+悬停色 |
| `--devui-disabled-line` | `#c9c9c9` | 〃 | `#2e2f33` | `#c9c9c9` | `#333337` | `rgba(15, 23, 42, 0.1)` | `rgba(255, 255, 255, 0.08)` | `#b8b09c` | 禁用边框色 |
| `--devui-connected-overlay-line` | `#0950de` | `#526ecc` | 〃 | `#191919` | `#5a5a5f` | `rgba(255, 255, 255, 0.7)` | `rgba(255, 255, 255, 0.18)` | `#1d1b26` | 有连接点的弹出菜单边框色 |
| `--devui-danger-line` | `#c7000b` | `#f66f6a` | `#d15854` | `#f66f6a` | `#b8423f` | `#f66f6a` | `#d9534f` | `#c42430` | 失败边框 |
| `--devui-warning-line` | `#f4840c` | `#fa9841` | `#eb8f3d` | `#fa9841` | `#b86b25` | `#fa9841` | `#e08a2e` | `#d86a00` | 警告边框 |
| `--devui-info-line` | `#5e7ce0` | 〃 | `#4482bd` | `#0a59f7` | `#3d7bff` | `#0a59f7` | `#4d8cff` | `#0a59f7` | 通知边框 |
| `--devui-success-line` | `#058358` | `#50d4ab` | `#2aa37e` | `#50d4ab` | `#2a9a5c` | `#50d4ab` | `#2fae63` | `#3e8948` | 成功边框 |
| `--devui-primary-line` | `#0a59f7` | `#5e7ce0` | `#546BB7` | `#0a59f7` | `#3d7bff` | `#0a59f7` | `#4d8cff` | `#0a59f7` | 主要边框 |
| `--devui-default-line` | `#5e7ce0` | 〃 | `#526ecc` | `#5e7ce0` | `#6b85e6` | `#5e7ce0` | `#7b93ea` | `#1d1b26` | 默认边框 |
| `--devui-form-control-line-rippling` | `rgba(10, 89, 247, 0.08)` | `rgba(94, 124, 224, 0.08)` | `rgba(49, 122, 247, 0.08)` | `rgba(25, 25, 25, 0.05)` | `rgba(237, 237, 237, 0.06)` | `rgba(10, 89, 247, 0.08)` | `rgba(77, 140, 255, 0.1)` | `rgba(10, 89, 247, 0.15)` | 表单控件边框波纹色 |
| `--devui-light-line` | `#f3f3f3` | 〃 | `rgba(255, 255, 255, 0.1)` | `#f0f0f0` | `#262628` | `rgba(15, 23, 42, 0.05)` | `rgba(255, 255, 255, 0.05)` | `#e6dcc2` | 浅色分割线 |

#### 阴影色

> 像素风全部为实色墨，配合零模糊几何形成硬投影。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-shadow` | `rgba(0, 0, 0, 0.16)` | `rgba(37, 43, 58, 0.24)` | `rgba(0, 0, 0, 0.72)` | `rgba(37, 43, 58, 0.24)` | `rgba(0, 0, 0, 0.5)` | `rgba(15, 23, 42, 0.16)` | `rgba(0, 0, 0, 0.45)` | `#1d1b26` | 阴影色 |
| `--devui-light-shadow` | `rgba(0, 0, 0, 0.08)` | `rgba(37, 43, 58, 0.12)` | `rgba(0, 0, 0, 0.3)` | `rgba(37, 43, 58, 0.12)` | `rgba(0, 0, 0, 0.32)` | `rgba(15, 23, 42, 0.08)` | `rgba(0, 0, 0, 0.28)` | `#1d1b26` | 弱化阴影色 |
| `--devui-connected-overlay-shadow` | `rgba(0, 0, 0, 0.16)` | `rgba(37, 43, 58, 0.16)` | `rgba(0, 0, 0, 0.42)` | `rgba(37, 43, 58, 0.16)` | `rgba(0, 0, 0, 0.48)` | `rgba(15, 23, 42, 0.14)` | `rgba(0, 0, 0, 0.4)` | `#1d1b26` | 下拉菜单类阴影色 |
| `--devui-feedback-overlay-shadow` | `rgba(0, 0, 0, 0.16)` | `rgba(37, 43, 58, 0.2)` | `rgba(0, 0, 0, 0.54)` | `rgba(37, 43, 58, 0.2)` | `rgba(0, 0, 0, 0.5)` | `rgba(15, 23, 42, 0.18)` | `rgba(0, 0, 0, 0.45)` | `#1d1b26` | 信息展示类阴影色 |
| `--devui-hover-shadow` | `rgba(0, 0, 0, 0.16)` | `rgba(37, 43, 58, 0.2)` | `rgba(0, 0, 0, 0.54)` | `rgba(37, 43, 58, 0.2)` | `rgba(0, 0, 0, 0.5)` | `rgba(15, 23, 42, 0.16)` | `rgba(0, 0, 0, 0.45)` | `#1d1b26` | 悬浮类阴影色 |
| `--devui-float-block-shadow` | `rgba(94, 124, 224, 0.3)` | 〃 | 〃 | `rgba(10, 89, 247, 0.24)` | `rgba(61, 123, 255, 0.32)` | `rgba(10, 89, 247, 0.24)` | `rgba(77, 140, 255, 0.32)` | `#1d1b26` | 特殊浮层背景色 |
| `--devui-table-column-shadow-color` | `rgba(37, 43, 58, 0.08)` | 〃 | `#323338` | `rgba(0, 0, 0, 0.08)` | `rgba(0, 0, 0, 0.4)` | `rgba(15, 23, 42, 0.06)` | `rgba(0, 0, 0, 0.32)` | `#1d1b26` | 表格列阴影色 |

#### 按钮

> 官方按钮专属变量。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-btn-common-bg` | `#ffffff` | 〃 | `#393939` | `#ffffff` | `#1f1f22` | `rgba(255, 255, 255, 0.66)` | `rgba(255, 255, 255, 0.08)` | `#fffdf6` | 通用按钮背景 |
| `--devui-btn-common-bg-disabled` | `rgba(25, 25, 25, 0.05)` | `#F0F0F0` | `#323338` | `#f0f0f0` | `#2a2a2c` | `rgba(15, 23, 42, 0.05)` | `rgba(255, 255, 255, 0.04)` | `#e6e0d0` | 通用按钮禁用背景 |
| `--devui-btn-common-bg-hover` | `#d1d1d1` | `#D1D1D1` | `#4e5057` | `#ffffff` | `#26262a` | `rgba(255, 255, 255, 0.85)` | `rgba(255, 255, 255, 0.12)` | `#fff6d6` | 通用按钮悬停背景 |
| `--devui-btn-common-bg-active` | `#bdbdbd` | `#BDBDBD` | `#4e5057` | `#ffffff` | `#2c2c30` | `rgba(255, 255, 255, 0.95)` | `rgba(255, 255, 255, 0.16)` | `#ffe9a8` | 通用按钮激活背景 |
| `--devui-btn-sm-padding` | `0 12px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 小按钮内边距 |
| `--devui-btn-padding` | `0 16px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 默认按钮内边距 |
| `--devui-btn-lg-padding` | `0 20px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 大按钮内边距 |
| `--devui-btn-common-border-color` | `#c9c9c9` | 〃 | `#393939` | `#c2c2c2` | `#3f3f44` | `rgba(15, 23, 42, 0.14)` | `rgba(255, 255, 255, 0.14)` | `#1d1b26` | 通用按钮边框色 |
| `--devui-btn-common-color-hover` | `#252b3a` | `#252B3A` | `#CED1DB` | `#191919` | `#ededed` | `#0f172a` | `#ffffff` | `#1d1b26` | 通用按钮悬停文字色 |
| `--devui-btn-common-border-color-hover` | `#191919` | 〃 | `#4e5057` | `#191919` | `#8a8a8f` | `rgba(15, 23, 42, 0.32)` | `rgba(255, 255, 255, 0.3)` | `#1d1b26` | 通用按钮悬停边框色 |
| `--devui-btn-common-color-active` | `#252b3a` | `#252B3A` | `#CED1DB` | `#191919` | `#ededed` | `#0f172a` | `#ffffff` | `#1d1b26` | 通用按钮激活文字色 |
| `--devui-btn-common-border-color-active` | `#0a59f7` | `#5e7ce0` | `#317af7` | `#191919` | `#ededed` | `#0a59f7` | `#4d8cff` | `#1d1b26` | 通用按钮激活边框色 |
| `--devui-btn-common-border-disabled` | `#c9c9c9` | 〃 | `#323338` | `#c9c9c9` | `#333337` | `rgba(15, 23, 42, 0.1)` | `rgba(255, 255, 255, 0.08)` | `#b8b09c` | 通用按钮禁用边框色 |

#### 动效

> 像素风把所有缓动曲线改为 `steps(3, end)`，玻璃风放慢并改为弹性减速曲线。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-animation-duration-slow` | `300ms` | 〃 | 〃 | 〃 | 〃 | `420ms` | 〃 | `240ms` | 慢速动画时长 |
| `--devui-animation-duration-base` | `200ms` | 〃 | 〃 | 〃 | 〃 | `300ms` | 〃 | `160ms` | 基础动画时长 |
| `--devui-animation-duration-fast` | `100ms` | 〃 | 〃 | 〃 | 〃 | `160ms` | 〃 | `80ms` | 快速动画时长 |
| `--devui-animation-ease-in` | `cubic-bezier(0.5, 0, 0.84, 0.25)` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | `steps(3, end)` | 缓入动画曲线 |
| `--devui-animation-ease-out` | `cubic-bezier(0.16, 0.75, 0.5, 1)` | 〃 | 〃 | 〃 | 〃 | `cubic-bezier(0.32, 0.72, 0, 1)` | 〃 | `steps(3, end)` | 缓出动画曲线 |
| `--devui-animation-ease-in-out` | `cubic-bezier(0.5, 0.05, 0.5, 0.95)` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | `steps(3, end)` | 缓入缓出动画曲线 |
| `--devui-animation-ease-in-smooth` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | 〃 | 〃 | 〃 | 〃 | `cubic-bezier(0.32, 0.72, 0, 1)` | 〃 | `steps(3, end)` | 平滑缓入动画 |
| `--devui-animation-ease-in-out-smooth` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | 〃 | 〃 | 〃 | 〃 | `cubic-bezier(0.32, 0.72, 0, 1)` | 〃 | `steps(3, end)` | 平滑缓入缓出曲线 |
| `--devui-animation-linear` | `cubic-bezier(0, 0, 1, 1)` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 线性动画曲线 |

#### 层级

> 所有主题一致。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-z-index-full-page-overlay` | `1080` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 全屏覆盖类元素层级 |
| `--devui-z-index-pop-up` | `1060` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 提示类信息层级 |
| `--devui-z-index-dropdown` | `1052` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 下拉菜单层级 |
| `--devui-z-index-modal` | `1050` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 弹窗层级 |
| `--devui-z-index-drawer` | `1040` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 抽屉板层级 |
| `--devui-z-index-framework` | `1000` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 框架类元素层级 |

#### 兼容变量（非官方）

> 官方 design.md 未列出，但 AgentSpace 现网变量表或开源 ng-devui 组件在用。只在扩展主题中输出；官方主题下为 —（组件使用自身回退值）。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-font-size-h1-title` | — | — | — | `28px` | 〃 | 〃 | 〃 | 〃 | 一级标题 |
| `--devui-font-size-h2-title` | — | — | — | `24px` | 〃 | 〃 | 〃 | 〃 | 二级标题 |
| `--devui-font-size-h3-title` | — | — | — | `20px` | 〃 | 〃 | 〃 | 〃 | 三级标题 |
| `--devui-font-size-h4-title` | — | — | — | `18px` | 〃 | 〃 | 〃 | 〃 | 四级标题 |
| `--devui-font-size-h5-title` | — | — | — | `16px` | 〃 | 〃 | 〃 | 〃 | 五级标题 |
| `--devui-block` | — | — | — | `#ffffff` | `#1c1c1e` | `rgba(255, 255, 255, 0.55)` | `rgba(24, 28, 40, 0.55)` | `#fffdf6` | 大面积不可折叠区块（顶部导航等） |
| `--devui-feedback-overlay-light-backdrop` | — | — | — | `rgba(255, 255, 255, 0.6)` | `rgba(20, 20, 21, 0.6)` | `rgba(255, 255, 255, 0.5)` | `rgba(11, 13, 20, 0.6)` | `rgba(244, 239, 225, 0.8)` | 加载遮罩层 |
| `--devui-btn-primary-bg-disabled` | — | — | — | `#f0f0f0` | `#2a2a2c` | `rgba(15, 23, 42, 0.06)` | `rgba(255, 255, 255, 0.06)` | `#e6e0d0` | 主要按钮禁用背景 |
| `--devui-btn-common-text-disabled` | — | — | — | `#c2c2c2` | `#5a5a5e` | `rgba(15, 23, 42, 0.32)` | `rgba(238, 242, 255, 0.3)` | `#a8a294` | 次要按钮禁用文字 |
| `--devui-btn-primary-text-disabled` | — | — | — | `#c2c2c2` | `#5a5a5e` | `rgba(15, 23, 42, 0.32)` | `rgba(238, 242, 255, 0.3)` | `#a8a294` | 主要按钮禁用文字 |

<!-- /GEN:mapping -->

### 5.1 色阶

官方的无限 / 追光两套主题在 CSS 中原样包含色阶变量（`--devui-blue-5~100`、`--devui-slate-*`、`--devui-gray-*` 等 12 组，每组 10–11 级）。由于追光叠加在无限之上，新无限和 5 套扩展主题下这些变量取的是无限的值，或者未定义。**业务代码只使用上表中的语义变量，不要直接引用色阶**（与官方要求一致）。完整色阶见 `dist/devui-themes.css` 和 `dist/tokens.json` 的 `palette` 字段。

---

## 6. 扩展变量 `--devui-ext-*`

<!-- GEN:ext -->
#### 字体族

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-ext-font-family` | `"Helvetica", "Arial", "PingFangSC-Regular", "Hiragino Sans GB", "Microsoft YaHei", "HarmonyOS Sans SC", sans-serif` | 〃 | 〃 | `"HarmonyOS Sans SC", "PingFang SC", "Microsoft YaHei", -apple-system, "Segoe UI", sans-serif` | 〃 | 〃 | 〃 | 〃 | 正文字体族（像素风正文仍用无衬线保可读性） |
| `--devui-ext-font-family-display` | `"Helvetica", "Arial", "PingFangSC-Regular", "Hiragino Sans GB", "Microsoft YaHei", "HarmonyOS Sans SC", sans-serif` | 〃 | 〃 | `"HarmonyOS Sans SC", "PingFang SC", "Microsoft YaHei", -apple-system, "Segoe UI", sans-serif` | 〃 | 〃 | 〃 | `"Fusion Pixel 12px Proportional SC", "Zpix", "Press Start 2P", monospace` | 标题 / 数字 / 按钮字体族 |
| `--devui-ext-font-family-mono` | `"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | `"Fusion Pixel 12px Proportional SC", "Zpix", "Press Start 2P", monospace` | 代码 / 日志字体族 |

#### 几何

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-ext-border-width` | `1px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | `2px` | 通用描边宽度 |
| `--devui-ext-border-style` | `solid` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | 通用描边样式 |
| `--devui-ext-image-rendering` | `auto` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | `pixelated` | 图标 / 头像位图渲染 |

#### 材质

> 只有玻璃主题非 0。组件需显式使用（见 §8 工具类）。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-ext-backdrop` | `#f3f3f3` | 〃 | `#16181a` | `#f5f5f5` | `#141415` | `radial-gradient(60% 50% at 12% 8%, #c9dcff 0%, transparent 60%), radial-gradient(50% 45% at 88% 12%, #f3d2ff 0%, transparent 60%), radial-gradient(55% 50% at 70% 92%, #c8f4ec 0%, transparent 60%), #eef1f8` | `radial-gradient(55% 45% at 10% 0%, rgba(77, 140, 255, 0.35) 0%, transparent 60%), radial-gradient(45% 40% at 92% 10%, rgba(176, 102, 255, 0.28) 0%, transparent 60%), radial-gradient(50% 45% at 65% 100%, rgba(32, 201, 180, 0.22) 0%, transparent 60%), #0b0d14` | `#f4efe1` | 页面底图（body / 应用根容器 background） |
| `--devui-ext-material-blur` | `0px` | 〃 | 〃 | 〃 | 〃 | `24px` | `28px` | `0px` | 玻璃面模糊半径 |
| `--devui-ext-material-saturate` | `100%` | 〃 | 〃 | 〃 | 〃 | `180%` | `160%` | `100%` | 玻璃面饱和度增强 |
| `--devui-ext-material-edge` | `transparent` | 〃 | 〃 | 〃 | 〃 | `rgba(255, 255, 255, 0.7)` | `rgba(255, 255, 255, 0.14)` | `transparent` | 玻璃面亮边（1px 描边色） |
| `--devui-ext-material-highlight` | `none` | 〃 | 〃 | 〃 | 〃 | `inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(255, 255, 255, 0.25)` | `inset 0 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1px 0 rgba(255, 255, 255, 0.04)` | `none` | 玻璃面内高光（叠加在 box-shadow 首位） |

#### 补充语义色

> 补齐官方变量缺失的'主色上的文字'等，解决深色墨主题主按钮反转问题。

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-ext-on-primary` | `#ffffff` | 〃 | 〃 | 〃 | `#121213` | `#ffffff` | `#0b0d14` | `#fffdf6` | 主色（devui-primary）上的文字 / 图标 |
| `--devui-ext-accent` | `#0a59f7` | `#5e7ce0` | `#317af7` | `#0a59f7` | `#3d7bff` | `#0a59f7` | `#4d8cff` | `#0a59f7` | 选中 / 聚焦 / 运行态强调色（官方主题 = 品牌色） |
| `--devui-ext-accent-glow` | `none` | 〃 | 〃 | 〃 | 〃 | `linear-gradient(110deg, #0a59f7 0%, #7b5cff 45%, #22c3e6 100%)` | `linear-gradient(110deg, #4d8cff 0%, #a77bff 45%, #2fd6c3 100%)` | `repeating-linear-gradient(90deg, #0a59f7 0 8px, #5b8cff 8px 16px)` | 流光：运行态描边 / 进度条 / Agent 思考中 |

#### 交互

| 变量 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--devui-ext-press-offset` | `0px` | 〃 | 〃 | 〃 | 〃 | 〃 | 〃 | `2px` | 按下位移（像素风按钮按下时下沉并缩短投影） |

<!-- /GEN:ext -->

---

## 7. 阴影与组件层级映射

沿用官方映射，所有主题通用：

| 阴影变量（组合使用） | 典型用法（适用组件） | 层级变量 | 说明 |
| :--- | :--- | :--- | :--- |
| `var(--devui-shadow-length-base) var(--devui-light-shadow)` | Card、List、Table | — | 基础阴影，直接铺陈在页面上方 |
| `var(--devui-shadow-length-connected-overlay) var(--devui-connected-overlay-shadow)` | DatePicker、Cascader、Select 下拉菜单 | `var(--devui-z-index-dropdown)` | 有连接点的弹出层 |
| `var(--devui-shadow-length-hover) var(--devui-hover-shadow)` | Card hover、MenuItem hover | — | 悬浮态阴影 |
| `var(--devui-shadow-length-feedback-overlay) var(--devui-feedback-overlay-shadow)` | PopOver、Tooltip、Toast、StepsGuide | `var(--devui-z-index-pop-up)` | 信息提示反馈类 |
| `var(--devui-shadow-length-fullscreen-overlay) var(--devui-feedback-overlay-shadow)` | Drawer、Modal、ImagePreview | `var(--devui-z-index-modal)` / `var(--devui-z-index-drawer)` | 无连接点的弹出层 |
| `var(--devui-shadow-length-slide-left)` | DataGrid 固定列向左滑动 | — | 左侧滑出阴影 |
| `var(--devui-shadow-length-slide-right)` | DataGrid 固定列向右滑动 | — | 右侧滑出阴影 |

扩展主题的差异：

- **玻璃**：在阴影前面叠加内高光，写成 `box-shadow: var(--devui-ext-material-highlight), var(--devui-shadow-length-base) var(--devui-light-shadow)`。
- **像素**：上述组合会自动得到硬投影，无需修改。按钮按下态由覆盖层把投影缩短到 `2px 2px 0`。

---

## 8. 材质与像素规则

### 8.1 玻璃（`as-glass`）

| 规则 | 说明 |
| :--- | :--- |
| 只在"浮在内容上"的面使用玻璃 | 卡片、弹窗、抽屉、下拉、Popover、Tooltip、Toast、`d-header`、`d-aside`。表格行、输入框内部、按钮**不**单独加模糊。 |
| 玻璃面最多嵌套 1 层 | 玻璃卡片里再放玻璃卡片会导致模糊叠加、性能下降、文字发灰。内层改用 `--devui-area` 或 `--devui-default-bg`。 |
| 大面积滚动区慎用 | 长表格、日志、代码区使用 `--devui-global-bg-normal`（半透明但不模糊）。 |
| 必须有降级方案 | 浏览器不支持 `backdrop-filter`，或用户开启了"降低透明度"时，覆盖层会自动把玻璃面换成不透明色。 |
| 工具类 | 非 DevUI 组件可以直接加 `.as-glass`（玻璃面）、`.as-glow-border`（流光运行态描边）。 |

### 8.2 像素（`as-pixel`）

| 规则 | 说明 |
| :--- | :--- |
| 描边统一使用 `--devui-ext-border-width`（2px） | 自研组件中写死的 `1px solid` 要改为 `var(--devui-ext-border-width) solid`。 |
| 图标与头像 | 位图使用 `image-rendering: pixelated`；SVG 尽量换成 2px 描边版本或像素图标集。 |
| 不允许出现模糊与渐变 | 流光运行态用 8px 一格的条纹色块配合 `steps(8)` 平移来代替渐变。 |
| 字体 | 像素字体只用于标题、按钮、数字、Tag；正文、表格、表单输入保持无衬线字体。 |

---

## 9. 图表规范

沿用官方规范：

- **折线图面积填充**：使用与线条色同一色相的渐变填充，从上到下不透明度设为 40% → 24% → 8%（三阶渐变）。
- **线条宽度**：默认 3px。
- **坐标轴**：轴线色 `var(--devui-line)`，标签色 `var(--devui-aide-text)`，分割线色 `var(--devui-dividing-line)` 虚线。

扩展主题补充：

| 主题 | 补充规则 |
| :--- | :--- |
| 简约（墨） | 主序列使用墨色 `var(--devui-text)`，对比序列使用 `var(--devui-ext-accent)`；面积填充规则不变 |
| 液态玻璃 | 图表区不加模糊；面积填充可以在 40% → 8% 的基础上改用 `--devui-ext-accent-glow` 的首色作为色相 |
| 像素风 | 线宽 2px，**不用渐变**，面积填充改为单一 24% 实色；折线改为阶梯线（`step`），数据点用方块 |

ECharts、Monaco 等不读取 CSS 变量的库，在切换主题时用 `getComputedStyle(document.documentElement).getPropertyValue('--devui-line')` 读出当前值，再传给它们的主题配置。

---

## 10. 组件适配清单

| # | 问题 | 涉及主题 | 处理 |
| :--- | :--- | :--- | :--- |
| 1 | 开源 ng-devui `button.component.scss` 中 primary / stress 按钮的文字取 `$devui-light-text`（固定白）。简约深色的主按钮为浅底，会出现白字配浅底 | 简约 · 深、液态玻璃 · 深 | 覆盖层让 `.devui-btn-primary` / `.devui-btn-stress`（非禁用态）改用 `--devui-ext-on-primary`。官方主题下该值为 `#fff`，等于官方原样 |
| 2 | `--devui-dark-text`（固定深色）写在状态底色上，深色主题中状态底色变为深色，文字会看不清 | 所有深色主题 | "状态底色 + 文字"组合改用 `--devui-text` 或对应的 `--devui-*-text` |
| 3 | 玻璃面需要 `backdrop-filter` | 液态玻璃 | 覆盖层已统一处理，弹窗和抽屉的遮罩层另加 6px 模糊 |
| 4 | 自研组件写死 `1px`、`border-radius: 4px`、`#fff` | 全部 | 改用 `--devui-ext-border-width`、`--devui-border-radius`、`--devui-base-bg` |
| 5 | 深色玻璃中 Toast 反转为浅色 | 液态玻璃 · 深 | 自研 Toast 文字使用 `--devui-feedback-overlay-text`，不要写死白色 |
| 6 | 像素风下 `--devui-line` 为纯墨色，表格内部线条会显得过重 | 像素风 | 表格内部线条用 `--devui-dividing-line`，外框用 `--devui-line` |

### 类名对照（覆盖层选择器 ← 开源 ng-devui 源码 `ef76c44`）

| 组件 | 覆盖层使用的选择器 | 源码依据 |
| :--- | :--- | :--- |
| 按钮 | `.devui-btn`、`.devui-btn-primary`、`.devui-btn-stress`；文字按钮 `.devui-btn-text(-dark)` 不加像素描边和投影 | `button/button.component.scss` |
| 卡片 | `.devui-card`、`.devui-card-title` | `card/card.component.scss` |
| 弹窗 | `d-modal .modal-content`、`d-modal-header`、遮罩 `.modal-backdrop` | `modal/modal.component.scss` |
| 抽屉 | `d-drawer .drawer-content`、遮罩 `.overlay-backdrop` | `drawer/drawer.component.scss` |
| 下拉 / Select | `.devui-dropdown-menu`（Select 共用） | `select/select.component.scss` |
| Popover / Tooltip / Toast | `.devui-popover`、`.devui-tooltip`、`.devui-toast-item` | 各组件 scss |
| 标签 / 头像 | `.devui-tag-item`、`.devui-avatar-style` | `tags/`、`avatar/` |
| 布局 | `d-header`、`d-aside`（组件标签） | `layout/elements/*` |
| 表单 | `.devui-form-control`、`.devui-input`、`.devui-form-controls textarea` | `style/core/_form.scss` |

---

## 11. 响应式适配

沿用官方规范，所有主题通用：

| 设备 | 分辨率 | 主要变动 |
| :--- | :--- | :--- |
| Mobile 手机 | < 768px | 标准移动叠放布局 |
| 平板、折叠屏 | 768px – 1023px | 部分功能隐藏 / 折叠，允许使用横向内容滚动适配 |
| 平板 | 1024px – 1279px | 与桌面端布局基本一致，部分功能隐藏 / 折叠，允许横向内容滚动，部分布局边距可能需要调整 |
| 常规 PC | 1280px – 1920px 及以上 | 完整布局，最大内容宽度，不允许出现页面级横向内容滚动 |

移动端使用液态玻璃时，把 `--devui-ext-material-blur` 降到 `12px` 左右，以降低 GPU 开销。

---

## 12. Best Practices

官方：

- 各个布局结构不要随意增加自定义的 border、background 样式。
- 优先使用组件 Props，减少自定义样式实现。
- 无 DevUI 组件库时，使用 CSS `var(--devui-*)` 引用 Token，不得硬编码色值。
- 生成页面时根据提示词关键字自动匹配主题，不得自创主题名（扩展后的关键字见 §1.1）。

扩展：

- 扩展主题之间的差异只能通过 `--devui-*` / `--devui-ext-*` 变量和 L3 覆盖层实现，业务组件里不要出现 `if (theme === 'as-pixel')` 这样的分支。
- 蓝色只用于链接、信息、选中、聚焦、运行中（简约主题）。主按钮保持墨色。
- 流光渐变只用于"正在发生"的状态，不要用来做装饰。
- 建议在 stylelint 中启用 `color-no-hex`，防止新代码绕过变量直接写色值。

---

## 13. 对比度校验（WCAG 2.1）

由 `build.py` 自动计算。半透明色先合成到 `--devui-global-bg` 上再计算，所以液态玻璃的结果是**近似值**：真实背景是极光渐变，经过模糊后实际亮度会在 ±10% 内浮动。

<!-- GEN:contrast -->
| 前景 / 背景 | 要求 | 场景 | 新无限 | 无限 | 追光 | 简约 · 浅（墨） | 简约 · 深（墨） | 流光 · 液态玻璃 · 浅 | 流光 · 液态玻璃 · 深 | 像素风 |
| :--- | :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `devui-text` / `devui-base-bg` | ≥4.5 | 正文 / 卡片 | 17.58 ✅ | 17.58 ✅ | 9.41 ✅ | 17.58 ✅ | 14.53 ✅ | 17.05 ✅ | 15.91 ✅ | 16.68 ✅ |
| `devui-text-weak` / `devui-base-bg` | ≥4.5 | 弱化正文 | 12.63 ✅ | 6.59 ✅ | 5.49 ✅ | 6.59 ✅ | 8.23 ✅ | 7.24 ✅ | 9.48 ✅ | 8.94 ✅ |
| `devui-aide-text` / `devui-base-bg` | ≥4.5 | 辅助文本 | 4.48 ⚠️ | 4.48 ⚠️ | 4.18 ⚠️ | 7.00 ✅ | 6.07 ✅ | 5.67 ✅ | 7.05 ✅ | 6.50 ✅ |
| `devui-link` / `devui-base-bg` | ≥4.5 | 链接 | 5.55 ✅ | 4.71 ✅ | 3.59 ⚠️ | 5.55 ✅ | 5.73 ✅ | 5.30 ✅ | 7.46 ✅ | 5.45 ✅ |
| `devui-danger-text` / `devui-base-bg` | ≥4.5 | 失败文字 | 4.75 ✅ | 4.41 ⚠️ | 3.62 ⚠️ | 4.01 ⚠️ | 6.15 ✅ | 5.29 ✅ | 7.07 ✅ | 5.66 ✅ |
| `devui-warning-text` / `devui-base-bg` | ≥3.0 | 警告文字（多为图标旁短词，按 3:1） | 2.58 ⚠️ | 2.90 ⚠️ | 5.57 ✅ | 2.39 ⚠️ | 8.76 ✅ | 3.20 ✅ | 10.08 ✅ | 4.58 ✅ |
| `devui-success-text` / `devui-base-bg` | ≥4.5 | 成功文字 | 4.78 ✅ | 4.28 ⚠️ | 3.00 ⚠️ | 3.75 ⚠️ | 8.48 ✅ | 5.25 ✅ | 10.21 ✅ | 6.30 ✅ |
| `devui-ext-on-primary` / `devui-primary` | ≥4.5 | 主按钮文字 | 5.55 ✅ | 3.86 ⚠️ | 3.99 ⚠️ | 17.58 ✅ | 15.99 ✅ | 17.85 ✅ | 17.79 ✅ | 16.68 ✅ |
| `devui-light-text` / `devui-brand` | ≥3.0 | 品牌色实底上的白字（复选框 / 标签） | 5.55 ✅ | 3.86 ✅ | 3.99 ✅ | 5.55 ✅ | 3.84 ✅ | 5.55 ✅ | 3.23 ✅ | 5.45 ✅ |
| `devui-feedback-overlay-text` / `devui-feedback-overlay-bg` | ≥4.5 | Toast / Tooltip | 12.60 ✅ | 10.97 ✅ | 6.15 ✅ | 10.97 ✅ | 9.67 ✅ | 7.57 ✅ | 13.13 ✅ | 16.68 ✅ |
| `devui-text` / `devui-connected-overlay-bg` | ≥4.5 | 下拉菜单文字 | 17.58 ✅ | 17.58 ✅ | 8.77 ✅ | 17.58 ✅ | 12.88 ✅ | 17.38 ✅ | 14.66 ✅ | 16.68 ✅ |
| `devui-list-item-active-text` / `devui-list-item-active-bg` | ≥4.5 | 列表选中项（叠加于 base-bg） | 18.04 ✅ | 11.55 ✅ | 2.45 ⚠️ | 14.09 ✅ | 11.22 ✅ | 14.50 ✅ | 11.23 ✅ | 12.27 ✅ |
| `devui-form-control-line` / `devui-form-control-bg` | ≥1.5 | 输入框边界（非文本，参考值） | 1.66 ✅ | 1.66 ✅ | 1.78 ✅ | 1.78 ✅ | 1.57 ✅ | 1.68 ✅ | 1.54 ✅ | 16.98 ✅ |
| `devui-placeholder` / `devui-form-control-bg` | ≥2.0 | 占位符（参考值） | 2.22 ✅ | 1.92 ⚠️ | 2.19 ✅ | 1.92 ⚠️ | 2.59 ✅ | 2.48 ✅ | 3.05 ✅ | 2.86 ✅ |

<!-- /GEN:contrast -->

> **官方三主题中的 ⚠️ 来自官方原值**，本扩展没有修改它们，以保证与官方逐字一致。简约 · 浅（墨）中的 ⚠️ 来自 AgentSpace 现网原值（`#f23030`、`#ff8800`、`#029931` 用作白底上的文字，以及 `#babbc0` 占位符）。如果决定修正，建议文字用色改为 `#d9262b` / `#c26400` / `#027a2a`，占位符改为 `#a0a2a8`，状态图标和填充色维持原值。

---

## 14. 维护流程与文件清单

**官方主题更新**：用 DevUI 新版 design.md 覆盖 `source/devui-official-design.md`，然后运行 `python3 build.py`。如果官方新增了变量，build 会报错并列出这些变量，在 `tokens.py` 中给它们分类并补上扩展主题的取值（填 `None` 表示继承 parent）。

**新增扩展主题**：在 `tokens.py` 的 `THEMES` 中加一行（指定 parent 和选择器），为 `TOKENS` 加一列、为 `EXT_TOKENS` 加一列，运行 build，检查 §13 和 `preview.html`。

| 文件 | 作用 |
| :--- | :--- |
| `source/devui-official-design.md` | DevUI 官方 design.md 原文，官方三主题的唯一来源 |
| `tokens.py` | 扩展主题取值、变量分类、扩展层变量 |
| `build.py` | 解析、继承、校验，生成下面所有产物 |
| `DESIGN.md` | 本文档（表格部分为生成内容） |
| `dist/devui-themes.css` | 8 套主题的 CSS 变量块（官方原样 + 扩展完整输出） |
| `dist/devui-theme-ext.scss` / `.less` | 扩展变量声明 |
| `dist/devui-theme-overrides.css` | L3 组件覆盖层（手写） |
| `dist/devui-themes.ts` | 8 个解析后的 `Theme` 对象 |
| `dist/tokens.json` | 平台无关的 token 数据（含官方色阶），可导入 Figma Variables |
| `preview.html` | 8 主题样张 + 可搜索的变量映射面板 |

---

## 15. 现网组件库核对清单

简约（墨）主题对应 AgentSpace 现网使用的组件库。以下几项需要在现网项目里确认（`$LIB` 为现网组件库在 `node_modules` 中的安装路径）：

```bash
# 1. 变量是否为 var() 形式（应接近全部命中，命中才能运行时切换主题）
grep -rc "var(--devui-" $LIB/style/theme/
# 2. 品牌色现网取值：若为 #191919，把 tokens.py 中 as-ink 的 devui-brand* 改为墨色
grep -rn "devui-brand" $LIB/style/theme/
# 3. 主按钮文字是否仍是 $devui-light-text
grep -rn "light-text" $LIB/button/
# 4. 覆盖层选择器是否存在（应全部有输出）
for c in modal-content drawer-content devui-dropdown-menu devui-popover devui-toast-item devui-tag-item devui-avatar-style; do echo "$c: $(grep -rl "$c" $LIB | wc -l)"; done
```
