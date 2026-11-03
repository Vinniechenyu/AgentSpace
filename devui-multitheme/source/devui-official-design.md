# DevUI 设计规范

DevUI 是一套源自华为云实战的企业级前端解决方案，其设计风格以简单、沉浸、灵活为核心，通过高度组件化和 Token 驱动的主题系统，致力于解决中后台开发中的一致性与效率难题。

---

## 主题体系

本规范定义三套主题：**新无限主题**（默认亮色）、**无限主题**（备选亮色）、**追光主题**（深色），用户可通过元素上的 `data-theme` 属性切换。

### 主题识别规则

生成页面时，根据用户提示词中的关键字自动匹配主题：

| 用户提示词关键字 | 匹配主题 | data-theme 值 | data-mode (追光) | 说明 |
|-----------------|---------|--------------|-----------------|------|
| `"新无限"`, `"新无限主题"` | **新无限主题** | `newInfinity-theme` | — | 默认浅色主题，品牌色 `#0a59f7` |
| `"无限"`, `"无限主题"` | **无限主题** | `default` | — | 备选浅色主题，品牌色 `#5e7ce0` |
| `"追光"`, `"追光主题"`, `"深色"`, `"暗色"`, `"dark"` | **追光主题** | `default` | `dark` | 深色主题，品牌色 `#317af7` |

**规则**：
- 提示词中未明确指定主题时，默认使用**新无限主题**
- 追光主题需同时设置 `data-theme="default"` 和 `data-mode="dark"` 两个属性
- 生成页面时，必须在根元素（如 `<html>`）上设置正确属性，不可遗漏

### 代码使用方法

**在 CSS 中使用（推荐，无需 DevUI 组件库）：**

```css
/* 在 html 元素上设置 data-theme 属性即可切换主题 */
/* 默认新无限主题: <html data-theme="newInfinity-theme"> */
/* 无限主题:       <html data-theme="default"> */
/* 追光主题:       <html data-theme="default" data-mode="dark"> */

/* 使用 var() 引用 Token（CSS 变量名对应 SCSS 变量 $devui-xxx = var(--devui-xxx)） */
.card {
  background: var(--devui-base-bg);
  color: var(--devui-text);
  border-radius: var(--devui-border-radius-card);
}
```

**在 SCSS 中使用（已安装 DevUI 组件库时）：**

```scss
@import '@devui/theme/styles-var/devui-var.scss';
.my-component {
  background-color: $devui-brand;
  color: $devui-text;
  padding: 12px;
}
```

> **变量关系**：`$devui-brand`（SCSS）等同于 `var(--devui-brand)`（CSS），两者值一致。无 DevUI 组件库时使用 CSS `var()` 方式，有组件库时使用 SCSS 变量方式。

> **无 DevUI 组件库时**：直接使用 CSS `var()` 函数引用本文档中定义的 `--devui-*` CSS 变量，无需安装任何依赖。生成 HTML 时需在 `<head>` 内联本文档中的 CSS 变量定义或引用外置 CSS 文件。

---

## 主题 Token 定义

以下是三套主题的完整 CSS 变量定义。生成页面时严格使用本文档中的变量名和值，不得自创变量或硬编码色值。

> **注意**：以下 Token 以 CSS 自定义属性（`--devui-*`）形式定义，对应 SCSS 变量名即 `$devui-*`（移除 `--` 前缀）。生成纯 HTML/CSS 页面时使用 `var(--devui-*)` 引用；生成 Vue SFC 且安装了 DevUI 组件库时使用 `$devui-*` 引用。

---

### 主题一：新无限主题 (newInfinity-theme)

**选择器**：`:root, [data-theme="newInfinity-theme"]`

**品牌色**：`--devui-brand: #0a59f7`（蓝色）

| CSS 变量名 | 值 | 描述 |
|-----------|-----|------|
| `--devui-logo` | #c6020b | Logo 颜色 |
| `--devui-global-bg` | #f3f3f3 | 全局带底色背景 |
| `--devui-place` | #aeaeae | 占位色 |
| `--devui-glass-morphism-bg` | rgba(243, 243, 243, 0.9) | 毛玻璃样式背景色 |
| `--devui-glass-morphism-overlay-bg` | rgba(255, 255, 255, 0.9) | 毛玻璃覆盖层背景 |
| `--devui-glass-morphism-floating-container-bg` | rgba(255, 255, 255, 0.9) | 毛玻璃浮动容器背景 |
| `--devui-global-bg-normal` | #ffffff | 全局白色背景 |
| `--devui-base-bg` | #ffffff | 基础区块背景白色，大面积不可折叠区块背景 |
| `--devui-base-bg-dark` | #000000 | 基础区块背景深色（固定） |
| `--devui-brand` | #0a59f7 | 品牌色 |
| `--devui-brand-foil` | #f2f2f3 | 品牌色辅助色、正衬色 |
| `--devui-brand-hover` | #3979f9 | 品牌色高亮色（加亮） |
| `--devui-brand-active` | #0950de | 品牌色激活色（加深） |
| `--devui-brand-active-focus` | #00196b | 品牌色焦点色（重度加深） |
| `--devui-contrast` | #c7000b | 品牌色撞色、对比色、第二品牌色 |
| `--devui-text` | #191919 | 正文文本 |
| `--devui-text-weak` | #333333 | 弱化的正文信息 |
| `--devui-aide-text` | #777777 | 辅助文本、帮助信息 |
| `--devui-aide-text-hover` | #000000 | 辅助文本悬浮色 |
| `--devui-aide-text-stress` | #333333 | 辅助文本中的强调色 |
| `--devui-placeholder` | #aeaeae | 占位符文本 |
| `--devui-light-text` | #ffffff | 有色深色背景下字体颜色（固定） |
| `--devui-dark-text` | #000000 | 有色浅色背景下字体颜色（固定） |
| `--devui-link` | #0a59f7 | 链接文本颜色 |
| `--devui-link-active` | #0950de | 链接文本悬停/激活颜色 |
| `--devui-link-disabled` | #777777 | 链接禁用色 |
| `--devui-link-light` | #6b9bfa | 深色背景下链接文本颜色 |
| `--devui-link-light-active` | #beccfa | 深色背景下链接文本激活色 |
| `--devui-link-light-disabled` | #777777 | 深色背景下链接禁用色 |
| `--devui-line` | #dfdfdf | 边框分割线，仅用于边框 |
| `--devui-light-line` | #f3f3f3 | 浅色分割线 |
| `--devui-dividing-line` | #f3f3f3 | 内容分割线 |
| `--devui-area` | #f5f5f5 | 可折叠区块背景 |
| `--devui-warning` | #f4840c | 警告、需注意类型提示 |
| `--devui-success` | #09aa71 | 成功、正确 |
| `--devui-initial` | #cedefd | 初始化、未执行 |
| `--devui-waiting` | #6b9bfa | 等待中 |
| `--devui-info` | #0a59f7 | 通知、一般提示、执行中 |
| `--devui-unavailable` | #f5f5f5 | 不可用、禁用状态 |
| `--devui-shadow` | rgba(0, 0, 0, 0.16) | 阴影色 |
| `--devui-light-shadow` | rgba(0, 0, 0, 0.08) | 弱化阴影色 |
| `--devui-connected-overlay-shadow` | rgba(0, 0, 0, 0.16) | 下拉菜单类阴影色 |
| `--devui-feedback-overlay-shadow` | rgba(0, 0, 0, 0.16) | 信息展示类阴影色 |
| `--devui-feedback-overlay-backdrop` | rgba(0, 0, 0, 0.3) | 反馈覆盖层遮罩 |
| `--devui-hover-shadow` | rgba(0, 0, 0, 0.16) | 悬浮类阴影色 |
| `--devui-table-column-shadow-color` | rgba(37, 43, 58, 0.08) | 表格列阴影色 |
| `--devui-table-expand-area-bg` | #DFDFDF | 表格展开区域背景 |
| `--devui-icon-text` | #808080 | 文字图标颜色 |
| `--devui-icon-bg` | #ffffff | SVG 图标背景色 |
| `--devui-icon-fill` | #191919 | SVG 图标灰色填充色 |
| `--devui-icon-fill-weak` | #777777 | SVG 弱化图标灰色填充色 |
| `--devui-icon-fill-hover` | #3979f9 | SVG 图标填充色悬停反馈色 |
| `--devui-icon-fill-active` | #0a59f7 | SVG 图标高亮填充色（激活） |
| `--devui-icon-fill-active-hover` | #000000 | SVG 图标高亮填充色悬停反馈色 |
| `--devui-icon-fill-active-disabled` | #beccfa | SVG 图标激活状态禁用色 |
| `--devui-shape-icon-fill` | #939393 | SVG 面型图标颜色 |
| `--devui-shape-icon-fill-hover` | #777777 | SVG 面型图标悬停色 |
| `--devui-shape-icon-fill-active` | #777777 | SVG 面型图标激活色 |
| `--devui-shape-icon-fill-disabled` | #dfdfdf | SVG 面型图标禁用色 |
| `--devui-form-control-line` | #c9c9c9 | 表单控件边框色 |
| `--devui-form-control-bg` | #ffffff | 表单控件背景色 |
| `--devui-form-control-line-hover` | #191919 | 表单控件边框悬停反馈色 |
| `--devui-form-control-line-active` | #0a59f7 | 表单控件边框激活色 |
| `--devui-form-control-line-rippling` | rgba(10, 89, 247, 0.08) | 表单控件边框波纹色 |
| `--devui-form-control-interactive-outline` | rgba(94, 124, 224, 0.08) | 表单控件边框激活外框阴影 |
| `--devui-form-control-line-active-hover` | #344899 | 表单控件边框激活+悬停色 |
| `--devui-list-item-active-bg` | #e6eeff | 列表单选选中背景 |
| `--devui-list-item-active-text` | #000000 | 列表单选选中文本 |
| `--devui-list-item-active-hover-bg` | #e9edfa | 列表单选选中悬停背景 |
| `--devui-list-item-hover-bg` | rgba(25, 25, 25, 0.05) | 列表普通选项悬停背景 |
| `--devui-list-item-hover-text` | #000000 | 列表普通选项悬停文本 |
| `--devui-list-item-selected-bg` | #cedefd | 列表多选选中行色 |
| `--devui-list-item-strip-bg` | #f2f5fc | 列表斑马纹色 |
| `--devui-disabled-bg` | #f5f5f5 | 禁用背景色 |
| `--devui-disabled-fill-bg` | #f3f3f3 | 禁用填充背景色 |
| `--devui-disabled-line` | #c9c9c9 | 禁用边框色 |
| `--devui-disabled-text` | #c9c9c9 | 禁用文字色 |
| `--devui-primary-disabled` | #9dbdfc | 主要按钮禁用文字色 |
| `--devui-label-bg` | #f0f0f0 | 标签化选项背景色 |
| `--devui-connected-overlay-bg` | #ffffff | 有连接点的弹出菜单背景色 |
| `--devui-connected-overlay-line` | #0950de | 有连接点的弹出菜单边框色 |
| `--devui-fullscreen-overlay-bg` | #ffffff | 全屏弹出内容层背景（模态弹窗） |
| `--devui-feedback-overlay-bg` | #2a2a2a | 信息提示反馈漂浮层背景 |
| `--devui-feedback-overlay-text` | #f0f0f0 | 信息提示反馈层文本色 |
| `--devui-embed-search-bg` | #f2f2f3 | 被嵌套无边框搜索框背景 |
| `--devui-embed-search-bg-hover` | #f5f5f5 | 被嵌套搜索框悬停背景 |
| `--devui-float-block-shadow` | rgba(94, 124, 224, 0.3) | 特殊浮层背景色 |
| `--devui-highlight-overlay` | rgba(255, 255, 255, 0.8) | 局部半透明全局浮层背景 |
| `--devui-range-item-hover-bg` | #e9edfa | DatePicker 范围日期悬停背景 |
| `--devui-gray-form-control-bg` | rgba(223, 223, 223, 0.5) | 灰色模式输入框默认背景 |
| `--devui-gray-form-control-hover-bg` | #dfdfdf | 灰色模式输入框悬停背景 |
| `--devui-nav-expand-bg` | #fafafa | 菜单展开区域背景 |
| `--devui-primary` | #0a59f7 | 主要按钮，同品牌色 |
| `--devui-primary-hover` | #3979f9 | 主要按钮悬停 |
| `--devui-primary-active` | #0950de | 主要按钮激活 |
| `--devui-contrast-hover` | #e7434a | 突出按钮悬停 |
| `--devui-contrast-active` | #c7000b | 突出按钮激活 |
| `--devui-danger-line` | #c7000b | 失败边框 |
| `--devui-danger-bg` | #fee7e8 | 失败底色 |
| `--devui-danger-text` | #e02128 | 失败文本色 |
| `--devui-warning-line` | #f4840c | 警告边框 |
| `--devui-warning-bg` | #fde2bd | 警告底色 |
| `--devui-warning-text` | #f4840c | 警告文本色 |
| `--devui-info-line` | #5e7ce0 | 通知边框 |
| `--devui-info-bg` | #cedefd | 通知底色 |
| `--devui-success-line` | #058358 | 成功边框 |
| `--devui-success-bg` | #e7fbf2 | 成功底色 |
| `--devui-success-text` | #058358 | 成功文本色 |
| `--devui-primary-line` | #0a59f7 | 主要边框 |
| `--devui-primary-bg` | #e6eeff | 主要底色 |
| `--devui-default-line` | #5e7ce0 | 默认边框 |
| `--devui-default-bg` | #fafafa | 默认底色 |
| `--devui-shadow-length-base` | 0 1px 6px 0 | 基础阴影长度（Card 等） |
| `--devui-shadow-length-slide-left` | -2px 0 8px 0 | 向左滑动阴影长度 |
| `--devui-shadow-length-slide-right` | 2px 0 8px 0 | 向右滑动阴影长度 |
| `--devui-shadow-length-connected-overlay` | 0 4px 12px 0 | 弹出层阴影长度 |
| `--devui-shadow-length-hover` | 0 8px 24px 0 | 悬浮阴影长度 |
| `--devui-shadow-length-feedback-overlay` | 0 8px 24px 0 | 反馈层阴影长度 |
| `--devui-shadow-length-fullscreen-overlay` | 0 16px 48px 0 | 全屏弹出层阴影长度 |
| `--devui-border-radius` | 4px | 一般圆角 |
| `--devui-border-radius-feedback` | 4px | 反馈类圆角 |
| `--devui-border-radius-card` | 8px | 卡片圆角 |
| `--devui-border-radius-card-xl` | 16px | 大卡片圆角 |
| `--devui-border-radius-full` | 100px | 全圆角（胶囊形） |
| `--devui-font-size` | 14px | 正文、帮助信息字号 |
| `--devui-font-size-card-title` | 16px | 卡片标题字号 |
| `--devui-font-size-page-title` | 16px | 页面标题字号 |
| `--devui-font-size-modal-title` | 18px | 弹窗标题字号 |
| `--devui-font-size-price` | 20px | 价格字号 |
| `--devui-font-size-data-overview` | 24px | 数据总览字号 |
| `--devui-font-size-icon` | 16px | 图标大小 |
| `--devui-font-size-sm` | 12px | 小控件文字大小 |
| `--devui-font-size-md` | 14px | 中控件文字大小 |
| `--devui-font-size-lg` | 14px | 大控件文字大小 |
| `--devui-font-title-weight` | bold | 标题文字粗细 |
| `--devui-font-content-weight` | normal | 内容文字粗细 |
| `--devui-line-height-base` | 1.5 | 规范行高 |
| `--devui-animation-ease-in-smooth` | cubic-bezier(0.645, 0.045, 0.355, 1) | 平滑缓入动画 |
| `--devui-animation-duration-slow` | 300ms | 慢速动画时长 |
| `--devui-animation-duration-base` | 200ms | 基础动画时长 |
| `--devui-animation-duration-fast` | 100ms | 快速动画时长 |
| `--devui-animation-ease-in` | cubic-bezier(0.5, 0, 0.84, 0.25) | 缓入动画曲线 |
| `--devui-animation-ease-out` | cubic-bezier(0.16, 0.75, 0.5, 1) | 缓出动画曲线 |
| `--devui-animation-ease-in-out` | cubic-bezier(0.5, 0.05, 0.5, 0.95) | 缓入缓出动画曲线 |
| `--devui-animation-ease-in-out-smooth` | cubic-bezier(0.645, 0.045, 0.355, 1) | 平滑缓入缓出曲线 |
| `--devui-animation-linear` | cubic-bezier(0, 0, 1, 1) | 线性动画曲线 |
| `--devui-z-index-full-page-overlay` | 1080 | 全屏覆盖类元素层级 |
| `--devui-z-index-pop-up` | 1060 | 提示类信息层级 |
| `--devui-z-index-dropdown` | 1052 | 下拉菜单层级 |
| `--devui-z-index-modal` | 1050 | 弹窗层级 |
| `--devui-z-index-drawer` | 1040 | 抽屉板层级 |
| `--devui-z-index-framework` | 1000 | 框架类元素层级 |
| `--devui-btn-sm-padding` | 0 12px | 小按钮内边距 |
| `--devui-btn-padding` | 0 16px | 默认按钮内边距 |
| `--devui-btn-lg-padding` | 0 20px | 大按钮内边距 |
| `--devui-btn-common-bg` | #ffffff | 通用按钮背景 |
| `--devui-btn-common-bg-disabled` | rgba(25, 25, 25, 0.05) | 通用按钮禁用背景 |
| `--devui-btn-common-border-color` | #c9c9c9 | 通用按钮边框色 |
| `--devui-btn-common-bg-hover` | #d1d1d1 | 通用按钮悬停背景 |
| `--devui-btn-common-color-hover` | #252b3a | 通用按钮悬停文字色 |
| `--devui-btn-common-border-color-hover` | #191919 | 通用按钮悬停边框色 |
| `--devui-btn-common-bg-active` | #bdbdbd | 通用按钮激活背景 |
| `--devui-btn-common-color-active` | #252b3a | 通用按钮激活文字色 |
| `--devui-btn-common-border-color-active` | #0a59f7 | 通用按钮激活边框色 |
| `--devui-btn-common-border-disabled` | #c9c9c9 | 通用按钮禁用边框色 |
| `--devui-icon-hover-bg` | #dfdfdf | 图标悬停背景色 |
| `--devui-icon-active-bg` | #aeaeae | 图标激活背景色 |
| `--devui-icon-active-color` | #0950DE | 图标激活颜色 |
| `--devui-constant-blue` | #0a59f7 | 常亮蓝色 |
| `--devui-constant-blue-hover` | #3979f9 | 常亮蓝色悬停色 |
| `--devui-constant-blue-active` | #0950de | 常亮蓝色激活色 |
| `--devui-constant-blue-disabled` | #9dbdfc | 常亮蓝色禁用色 |
| `--devui-constant-blue-rippling` | rgba(10, 89, 247, 0.08) | 常亮蓝色波纹色 |

> 色阶类变量（`--devui-blue-5~100`、`--devui-slate-5~100`、`--devui-gray-5~100`、`--devui-zinc-5~100`、`--devui-green-5~100`、`--devui-yellow-5~100`、`--devui-orange-5~100`、`--devui-red-5~100`、`--devui-sky-5~100`、`--devui-lime-5~100`、`--devui-magenta-5~100`、`--devui-purple-5~100`）详细定义见 DevUI 设计系统 Token 完整清单，生成页面时使用上表语义 Token（`--devui-brand`、`--devui-text`、`--devui-line` 等）即可，不需要引用色阶细分级。

---

### 主题二：无限主题 (default 亮色)

**选择器**：`[data-theme="default"]`

**品牌色**：`--devui-brand: #5e7ce0`（淡蓝色）

| CSS 变量名 | 值 |
|-----------|-----|
| `--devui-logo` | #c7000b |
| `--devui-global-bg` | #f3f3f3 |
| `--devui-place` | #aeaeae |
| `--devui-glass-morphism-bg` | rgba(245, 245, 245, 0.9) |
| `--devui-glass-morphism-overlay-bg` | rgba(255, 255, 255, 0.9) |
| `--devui-glass-morphism-floating-container-bg` | rgba(255, 255, 255, 0.9) |
| `--devui-global-bg-normal` | #ffffff |
| `--devui-base-bg` | #ffffff | 基础区块背景白色，大面积不可折叠区块背景 |
| `--devui-base-bg-dark` | #252b3a |
| `--devui-brand` | #5e7ce0 |
| `--devui-brand-foil` | #f2f2f3 |
| `--devui-brand-hover` | #7693f5 |
| `--devui-brand-active` | #526ecc |
| `--devui-brand-active-focus` | #344899 |
| `--devui-contrast` | #c7000b |
| `--devui-text` | #191919 |
| `--devui-text-weak` | #575d6c |
| `--devui-aide-text` | #777777 |
| `--devui-aide-text-hover` | #252b3a |
| `--devui-aide-text-stress` | #575d6c |
| `--devui-placeholder` | #babbc0 |
| `--devui-light-text` | #ffffff |
| `--devui-dark-text` | #252b3a |
| `--devui-link` | #526ecc |
| `--devui-link-active` | #465eb8 |
| `--devui-link-light` | #96adfa |
| `--devui-link-light-active` | #beccfa |
| `--devui-link-light-disabled` | #C2C2C2 |
| `--devui-link-disabled` | #777777 |
| `--devui-icon-hover-bg` | #EBEBEB |
| `--devui-icon-active-bg` | #aeaeae |
| `--devui-icon-active-color` | #5E7CE0 |
| `--devui-line` | #dfdfdf |
| `--devui-light-line` | #f3f3f3 |
| `--devui-dividing-line` | #f3f3f3 |
| `--devui-area` | #f5f5f5 |
| `--devui-danger` | #e7625d |
| `--devui-warning` | #f7841f |
| `--devui-waiting` | #beccfa |
| `--devui-success` | #2eb78a |
| `--devui-info` | #5e7ce0 |
| `--devui-initial` | #e1e8fd |
| `--devui-unavailable` | #f5f5f5 |
| `--devui-danger-text` | #d44644 |
| `--devui-warning-text` | #e37d29 |
| `--devui-success-text` | #088c58 |
| `--devui-shadow` | rgba(37, 43, 58, 0.24) |
| `--devui-light-shadow` | rgba(37, 43, 58, 0.12) |
| `--devui-connected-overlay-shadow` | rgba(37, 43, 58, 0.16) |
| `--devui-feedback-overlay-shadow` | rgba(37, 43, 58, 0.2) |
| `--devui-feedback-overlay-backdrop` | rgba(0, 0, 0, 0.3) |
| `--devui-hover-shadow` | rgba(37, 43, 58, 0.2) |
| `--devui-icon-text` | #71757f |
| `--devui-icon-bg` | #ffffff |
| `--devui-icon-fill` | #191919 |
| `--devui-icon-fill-weak` | #777777 |
| `--devui-icon-fill-hover` | #7693f5 |
| `--devui-icon-fill-active` | #5e7ce0 |
| `--devui-icon-fill-active-hover` | #252b3a |
| `--devui-shape-icon-fill` | #939393 |
| `--devui-shape-icon-fill-hover` | #777777 |
| `--devui-shape-icon-fill-active` | #777777 |
| `--devui-shape-icon-fill-disabled` | #dfdfdf |
| `--devui-form-control-line` | #c9c9c9 |
| `--devui-form-control-bg` | #ffffff |
| `--devui-form-control-line-hover` | #191919 |
| `--devui-form-control-line-active` | #5e7ce0 |
| `--devui-form-control-line-rippling` | rgba(94, 124, 224, 0.08) |
| `--devui-form-control-interactive-outline` | rgba(94, 124, 224, 0.08) |
| `--devui-form-control-line-active-hover` | #344899 |
| `--devui-list-item-active-bg` | #e1e8fd |
| `--devui-list-item-active-text` | #252b3a |
| `--devui-list-item-active-hover-bg` | #e1e8fd |
| `--devui-list-item-hover-bg` | rgba(25, 25, 25, 0.05) |
| `--devui-list-item-hover-text` | #252b3a |
| `--devui-list-item-selected-bg` | #e1e8fd |
| `--devui-list-item-strip-bg` | #f2f5fc |
| `--devui-disabled-bg` | #f5f5f5 |
| `--devui-disabled-line` | #c9c9c9 |
| `--devui-disabled-text` | #c9c9c9 |
| `--devui-disabled-fill-bg` | #f3f3f3 |
| `--devui-primary-disabled` | #beccfa |
| `--devui-icon-fill-active-disabled` | #beccfa |
| `--devui-label-bg` | #f0f0f0 |
| `--devui-connected-overlay-bg` | #ffffff |
| `--devui-connected-overlay-line` | #526ecc |
| `--devui-fullscreen-overlay-bg` | #ffffff |
| `--devui-feedback-overlay-bg` | #2a2a2a |
| `--devui-feedback-overlay-text` | #dfe1e6 |
| `--devui-embed-search-bg` | #f2f2f3 |
| `--devui-embed-search-bg-hover` | #eef0f5 |
| `--devui-float-block-shadow` | rgba(94, 124, 224, 0.3) |
| `--devui-highlight-overlay` | rgba(255, 255, 255, 0.8) |
| `--devui-range-item-hover-bg` | #e1e8fd |
| `--devui-gray-form-control-bg` | rgba(223, 223, 223, 0.5) |
| `--devui-gray-form-control-hover-bg` | #c9c9c9 |
| `--devui-nav-expand-bg` | #fafafa |
| `--devui-primary` | #5e7ce0 |
| `--devui-primary-hover` | #7693f5 |
| `--devui-primary-active` | #465eb8 |
| `--devui-contrast-hover` | #de504e |
| `--devui-contrast-active` | #b02121 |
| `--devui-danger-line` | #f66f6a |
| `--devui-danger-bg` | #ffd5d4 |
| `--devui-warning-line` | #fa9841 |
| `--devui-warning-bg` | #ffe1c7 |
| `--devui-info-line` | #5e7ce0 |
| `--devui-info-bg` | #e1e8fd |
| `--devui-success-line` | #50d4ab |
| `--devui-success-bg` | #cffcee |
| `--devui-primary-line` | #5e7ce0 |
| `--devui-primary-bg` | #f2f5fc |
| `--devui-default-line` | #5e7ce0 |
| `--devui-default-bg` | #f7f8fa |
| `--devui-shadow-length-base` | 0 2px 6px 0 |
| `--devui-shadow-length-slide-left` | -2px 0 8px 0 |
| `--devui-shadow-length-slide-right` | 2px 0 8px 0 |
| `--devui-shadow-length-connected-overlay` | 0 2px 12px 0 |
| `--devui-shadow-length-hover` | 0 4px 16px 0 |
| `--devui-shadow-length-feedback-overlay` | 0 4px 16px 0 |
| `--devui-shadow-length-fullscreen-overlay` | 0 10px 24px 0 |
| `--devui-border-radius` | 4px |
| `--devui-border-radius-feedback` | 4px |
| `--devui-border-radius-card` | 8px |
| `--devui-border-radius-card-xl` | 16px |
| `--devui-border-radius-full` | 100px |
| `--devui-font-size` | 14px |
| `--devui-font-size-card-title` | 16px |
| `--devui-font-size-page-title` | 16px |
| `--devui-font-size-modal-title` | 18px |
| `--devui-font-size-price` | 20px |
| `--devui-font-size-data-overview` | 24px |
| `--devui-font-size-icon` | 16px |
| `--devui-font-size-sm` | 12px |
| `--devui-font-size-md` | 14px |
| `--devui-font-size-lg` | 14px |
| `--devui-font-title-weight` | bold |
| `--devui-font-content-weight` | normal |
| `--devui-line-height-base` | 1.5 |
| `--devui-animation-ease-in-smooth` | cubic-bezier(0.645, 0.045, 0.355, 1) |
| `--devui-animation-duration-slow` | 300ms |
| `--devui-animation-duration-base` | 200ms |
| `--devui-animation-duration-fast` | 100ms |
| `--devui-animation-ease-in` | cubic-bezier(0.5, 0, 0.84, 0.25) |
| `--devui-animation-ease-out` | cubic-bezier(0.16, 0.75, 0.5, 1) |
| `--devui-animation-ease-in-out` | cubic-bezier(0.5, 0.05, 0.5, 0.95) |
| `--devui-animation-ease-in-out-smooth` | cubic-bezier(0.645, 0.045, 0.355, 1) |
| `--devui-animation-linear` | cubic-bezier(0, 0, 1, 1) |
| `--devui-z-index-full-page-overlay` | 1080 |
| `--devui-z-index-pop-up` | 1060 |
| `--devui-z-index-dropdown` | 1052 |
| `--devui-z-index-modal` | 1050 |
| `--devui-z-index-drawer` | 1040 |
| `--devui-z-index-framework` | 1000 |
| `--devui-table-column-shadow-color` | rgba(37, 43, 58, 0.08) |
| `--devui-table-expand-area-bg` | #EBEBEB |
| `--devui-constant-blue` | #5e7ce0 |
| `--devui-constant-blue-hover` | #7693f5 |
| `--devui-constant-blue-active` | #526ecc |
| `--devui-constant-blue-disabled` | #beccfa |
| `--devui-constant-blue-rippling` | rgba(94, 124, 224, 0.08) |
| `--devui-blue-5` | #f2f5fc |
| `--devui-blue-10` | #e1e8fd |
| `--devui-blue-20` | #beccfa |
| `--devui-blue-30` | #96adfa |
| `--devui-blue-40` | #7693f5 |
| `--devui-blue-50` | #5e7ce0 |
| `--devui-blue-60` | #4965c3 |
| `--devui-blue-70` | #465eb8 |
| `--devui-blue-80` | #3c51a6 |
| `--devui-blue-90` | #344899 |
| `--devui-blue-100` | #2a3c85 |
| `--devui-slate-5` | #fafafa |
| `--devui-slate-10` | #f5f5f5 |
| `--devui-slate-20` | #f0f0f0 |
| `--devui-slate-30` | #e6e6e6 |
| `--devui-slate-40` | #dbdbdb |
| `--devui-slate-50` | #c2c2c2 |
| `--devui-slate-60` | #808080 |
| `--devui-slate-70` | #595959 |
| `--devui-slate-80` | #333333 |
| `--devui-slate-90` | #191919 |
| `--devui-slate-100` | #000000 |
| `--devui-gray-5` | #f3f3f3 |
| `--devui-gray-10` | #dfdfdf |
| `--devui-gray-20` | #c9c9c9 |
| `--devui-gray-30` | #aeaeae |
| `--devui-gray-40` | #939393 |
| `--devui-gray-50` | #777777 |
| `--devui-gray-60` | #595959 |
| `--devui-gray-70` | #393939 |
| `--devui-gray-80` | #2a2a2a |
| `--devui-gray-90` | #191919 |
| `--devui-gray-100` | #000000 |
| `--devui-zinc-5` | #f7f7f9 |
| `--devui-zinc-10` | #f2f2f3 |
| `--devui-zinc-20` | #e2e2e6 |
| `--devui-zinc-30` | #d5d5db |
| `--devui-zinc-40` | #c7c7d1 |
| `--devui-zinc-50` | #aeaebd |
| `--devui-zinc-60` | #9696a3 |
| `--devui-zinc-70` | #7a7a85 |
| `--devui-zinc-80` | #63636b |
| `--devui-zinc-90` | #9898A3 |
| `--devui-zinc-100` | #37373d |
| `--devui-green-5` | #edfff9 |
| `--devui-green-10` | #cffcee |
| `--devui-green-20` | #acf2dc |
| `--devui-green-30` | #8be8cb |
| `--devui-green-40` | #6ddebb |
| `--devui-green-50` | #40c89e |
| `--devui-green-60` | #2eb78a |
| `--devui-green-70` | #27b080 |
| `--devui-green-80` | #169e6c |
| `--devui-green-100` | #007a45 |
| `--devui-yellow-5` | #fffbf0 |
| `--devui-yellow-10` | #fff1c2 |
| `--devui-yellow-20` | #ffe794 |
| `--devui-yellow-30` | #ffdc66 |
| `--devui-yellow-40` | #ffd138 |
| `--devui-yellow-50` | #fac20a |
| `--devui-yellow-60` | #d8a202 |
| `--devui-yellow-70` | #cc9600 |
| `--devui-yellow-80` | #b58200 |
| `--devui-yellow-100` | #875c00 |
| `--devui-orange-5` | #fff3e8 |
| `--devui-orange-10` | #ffe1c7 |
| `--devui-orange-20` | #ffd0a6 |
| `--devui-orange-30` | #ffbf85 |
| `--devui-orange-40` | #ffad63 |
| `--devui-orange-50` | #f7841f |
| `--devui-orange-60` | #db731e |
| `--devui-orange-70` | #cc6414 |
| `--devui-orange-80` | #b54e04 |
| `--devui-orange-100` | #873400 |
| `--devui-red-5` | #ffeeed |
| `--devui-red-10` | #fce2e0 |
| `--devui-red-20` | #ffbcba |
| `--devui-red-30` | #ffa4a1 |
| `--devui-red-40` | #ff8b87 |
| `--devui-red-50` | #e7625d |
| `--devui-red-60` | #d44644 |
| `--devui-red-70` | #c73636 |
| `--devui-red-80` | #b02121 |
| `--devui-red-100` | #820404 |
| `--devui-sky-5` | #ebf6ff |
| `--devui-sky-10` | #d1ebff |
| `--devui-sky-20` | #b8e0ff |
| `--devui-sky-30` | #9ed5ff |
| `--devui-sky-40` | #85caff |
| `--devui-sky-50` | #59b0f2 |
| `--devui-sky-60` | #4099db |
| `--devui-sky-70` | #3590cc |
| `--devui-sky-80` | #207ab3 |
| `--devui-sky-100` | #035880 |
| `--devui-lime-5` | #f0ffe6 |
| `--devui-lime-10` | #e5ffd4 |
| `--devui-lime-20` | #d8fcc0 |
| `--devui-lime-30` | #c5f2a7 |
| `--devui-lime-40` | #b3e890 |
| `--devui-lime-50` | #94ce6e |
| `--devui-lime-60` | #81c054 |
| `--devui-lime-70` | #7eba50 |
| `--devui-lime-80` | #6ca83b |
| `--devui-lime-100` | #518519 |
| `--devui-magenta-5` | #ffedf3 |
| `--devui-magenta-10` | #ffd4e3 |
| `--devui-magenta-20` | #ffbad2 |
| `--devui-magenta-30` | #ffa1c2 |
| `--devui-magenta-40` | #fc86b0 |
| `--devui-magenta-50` | #e8578b |
| `--devui-magenta-60` | #d04379 |
| `--devui-magenta-70` | #c4356e |
| `--devui-magenta-80` | #ad215b |
| `--devui-magenta-100` | #800440 |
| `--devui-purple-5` | #f7edfe |
| `--devui-purple-10` | #e8cffe |
| `--devui-purple-20` | #d9b1fd |
| `--devui-purple-30` | #cb8efb |
| `--devui-purple-40` | #bf68fa |
| `--devui-purple-50` | #b62bf7 |
| `--devui-purple-60` | #8a21bc |
| `--devui-purple-70` | #651b8b |
| `--devui-purple-80` | #520673 |
| `--devui-purple-100` | #36004d |
| `--devui-btn-sm-padding` | 0 12px |
| `--devui-btn-padding` | 0 16px |
| `--devui-btn-lg-padding` | 0 20px |
| `--devui-btn-common-bg` | #ffffff |
| `--devui-btn-common-bg-disabled` | #F0F0F0 |
| `--devui-btn-common-border-color` | #c9c9c9 |
| `--devui-btn-common-bg-hover` | #D1D1D1 |
| `--devui-btn-common-color-hover` | #252B3A |
| `--devui-btn-common-border-color-hover` | #191919 |
| `--devui-btn-common-bg-active` | #BDBDBD |
| `--devui-btn-common-color-active` | #252B3A |
| `--devui-btn-common-border-color-active` | #5e7ce0 |
| `--devui-btn-common-border-disabled` | #c9c9c9 |

---

### 主题三：追光主题 (default 深色)

**选择器**：`[data-theme="default"][data-mode="dark"]`

**品牌色**：`--devui-brand: #317af7`（亮蓝色）

| CSS 变量名 | 值 |
|-----------|-----|
| `--devui-global-bg` | #16181a |
| `--devui-glass-morphism-bg` | rgba(26, 26, 28, 0.9) |
| `--devui-glass-morphism-overlay-bg` | rgba(255, 255, 255, 0.9) |
| `--devui-global-bg-normal` | #202124 |
| `--devui-base-bg` | #2a2a2a | 基础区块背景白色，大面积不可折叠区块背景 |
| `--devui-base-bg-dark` | #2e2f31 |
| `--devui-brand` | #317af7 |
| `--devui-brand-foil` | #f2f2f3 |
| `--devui-brand-hover` | #5e7ce0 |
| `--devui-brand-active` | #526ecc |
| `--devui-brand-active-focus` | #344899 |
| `--devui-logo` | #c6020b |
| `--devui-place` | #808080 |
| `--devui-contrast` | #C7000B |
| `--devui-text` | #ced1db |
| `--devui-text-weak` | #A0A0A0 |
| `--devui-aide-text` | #868a99 |
| `--devui-aide-text-hover` | #73788a |
| `--devui-aide-text-stress` | #A0A0A0 |
| `--devui-placeholder` | #5b5d66 |
| `--devui-light-text` | #ffffff |
| `--devui-dark-text` | #252b3a |
| `--devui-link` | #317af7 |
| `--devui-link-active` | #317af7 |
| `--devui-link-light` | #6b9bfa |
| `--devui-link-light-active` | #beccfa |
| `--devui-link-disabled` | #808080 |
| `--devui-line` | #4e5057 |
| `--devui-dividing-line` | #323338 |
| `--devui-light-line` | rgba(255, 255, 255, 0.1) |
| `--devui-area` | #34363A |
| `--devui-danger` | #e7434a |
| `--devui-warning` | #fac20a |
| `--devui-waiting` | #5e6580 |
| `--devui-success` | #058358 |
| `--devui-info` | #526ecc |
| `--devui-initial` | #64676e |
| `--devui-unavailable` | #5b5b5c |
| `--devui-shadow` | rgba(0, 0, 0, 0.72) |
| `--devui-light-shadow` | rgba(0, 0, 0, 0.3) |
| `--devui-connected-overlay-shadow` | rgba(0, 0, 0, 0.42) |
| `--devui-feedback-overlay-shadow` | rgba(0, 0, 0, 0.54) |
| `--devui-feedback-overlay-backdrop` | rgba(0, 0, 0, 0.72) |
| `--devui-hover-shadow` | rgba(0, 0, 0, 0.54) |
| `--devui-icon-text` | #868a99 |
| `--devui-icon-bg` | #2E2F31 |
| `--devui-icon-fill` | #868a99 |
| `--devui-icon-fill-weak` | #696c75 |
| `--devui-icon-fill-hover` | #5291ff |
| `--devui-icon-fill-active` | #317af7 |
| `--devui-icon-fill-active-hover` | #ced1db |
| `--devui-shape-icon-fill` | #4e5057 |
| `--devui-shape-icon-fill-active` | #696c75 |
| `--devui-shape-icon-fill-hover` | #696c75 |
| `--devui-shape-icon-fill-disabled` | #393939 |
| `--devui-form-control-line` | #4e5057 |
| `--devui-form-control-bg` | #292a2e |
| `--devui-form-control-line-hover` | #868a99 |
| `--devui-form-control-line-active` | #317af7 |
| `--devui-form-control-interactive-outline` | rgba(82,110,204,0.08) |
| `--devui-form-control-line-active-hover` | #344899 |
| `--devui-list-item-active-bg` | #393939 |
| `--devui-list-item-active-text` | #526ecc |
| `--devui-list-item-active-hover-bg` | #33384b |
| `--devui-list-item-hover-bg` | rgba(206, 209, 219, 0.05) |
| `--devui-list-item-hover-text` | #f5f5f5 |
| `--devui-list-item-selected-bg` | #33384b |
| `--devui-list-item-strip-bg` | #383838 |
| `--devui-disabled-bg` | #2d2e32 |
| `--devui-disabled-line` | #2e2f33 |
| `--devui-disabled-text` | rgba(255, 255, 255, 0.3) |
| `--devui-primary-disabled` | #003d83 |
| `--devui-icon-fill-active-disabled` | #2B3458 |
| `--devui-label-bg` | #353537 |
| `--devui-connected-overlay-bg` | #2e2f33 |
| `--devui-connected-overlay-line` | #526ecc |
| `--devui-fullscreen-overlay-bg` | #2e2f33 |
| `--devui-feedback-overlay-bg` | #4e5057 |
| `--devui-feedback-overlay-text` | #DFE1E6 |
| `--devui-gray-form-control-bg` | #16181a |
| `--devui-gray-form-control-hover-bg` | #393939 |
| `--devui-nav-expand-bg` | #16181a |
| `--devui-embed-search-bg` | #383838 |
| `--devui-embed-search-bg-hover` | #3D3E40 |
| `--devui-float-block-shadow` | rgba(94, 124, 224, 0.3) |
| `--devui-highlight-overlay` | rgba(255, 255, 255, 0.1) |
| `--devui-range-item-hover-bg` | #454545 |
| `--devui-primary` | #317af7 |
| `--devui-primary-hover` | #5291ff |
| `--devui-primary-active` | #317af7 |
| `--devui-contrast-hover` | #ee696f |
| `--devui-contrast-active` | #B12220 |
| `--devui-danger-line` | #d15854 |
| `--devui-danger-bg` | #350305 |
| `--devui-warning-line` | #eb8f3d |
| `--devui-warning-bg` | #3d1601 |
| `--devui-info-line` | #4482bd |
| `--devui-info-bg` | #1c2543 |
| `--devui-success-line` | #2aa37e |
| `--devui-success-bg` | #00291d |
| `--devui-primary-line` | #546BB7 |
| `--devui-primary-bg` | #383D4F |
| `--devui-default-line` | #526ecc |
| `--devui-default-bg` | #313131 |
| `--devui-shadow-length-base` | 0 1px 6px 0 |
| `--devui-shadow-length-slide-left` | -2px 0 8px 0 |
| `--devui-shadow-length-slide-right` | 2px 0 8px 0 |
| `--devui-shadow-length-connected-overlay` | 0 4px 12px 0 |
| `--devui-shadow-length-hover` | 0 8px 24px 0 |
| `--devui-shadow-length-feedback-overlay` | 0 8px 16px 0 |
| `--devui-shadow-length-fullscreen-overlay` | 0 0 6px 0 |
| `--devui-border-radius` | 4px |
| `--devui-border-radius-feedback` | 4px |
| `--devui-border-radius-card` | 8px |
| `--devui-border-radius-card-xl` | 16px |
| `--devui-border-radius-full` | 100px |
| `--devui-font-size` | 14px |
| `--devui-font-size-card-title` | 16px |
| `--devui-font-size-page-title` | 16px |
| `--devui-font-size-modal-title` | 18px |
| `--devui-font-size-price` | 20px |
| `--devui-font-size-data-overview` | 24px |
| `--devui-font-size-icon` | 16px |
| `--devui-font-size-sm` | 12px |
| `--devui-font-size-md` | 14px |
| `--devui-font-size-lg` | 14px |
| `--devui-font-title-weight` | bold |
| `--devui-font-content-weight` | normal |
| `--devui-line-height-base` | 1.5 |
| `--devui-animation-ease-in-smooth` | cubic-bezier(0.645, 0.045, 0.355, 1) |
| `--devui-animation-duration-slow` | 300ms |
| `--devui-animation-duration-base` | 200ms |
| `--devui-animation-duration-fast` | 100ms |
| `--devui-animation-ease-in` | cubic-bezier(0.5, 0, 0.84, 0.25) |
| `--devui-animation-ease-out` | cubic-bezier(0.16, 0.75, 0.5, 1) |
| `--devui-animation-ease-in-out` | cubic-bezier(0.5, 0.05, 0.5, 0.95) |
| `--devui-animation-ease-in-out-smooth` | cubic-bezier(0.645, 0.045, 0.355, 1) |
| `--devui-animation-linear` | cubic-bezier(0, 0, 1, 1) |
| `--devui-z-index-full-page-overlay` | 1080 |
| `--devui-z-index-pop-up` | 1060 |
| `--devui-z-index-dropdown` | 1052 |
| `--devui-z-index-modal` | 1050 |
| `--devui-z-index-drawer` | 1040 |
| `--devui-z-index-framework` | 1000 |
| `--devui-icon-active-color` | #ffffff |
| `--devui-table-column-shadow-color` | #323338 |
| `--devui-table-expand-area-bg` | #393a3e |
| `--devui-btn-sm-padding` | 0 12px |
| `--devui-btn-padding` | 0 16px |
| `--devui-btn-lg-padding` | 0 20px |
| `--devui-btn-common-bg` | #393939 |
| `--devui-btn-common-bg-disabled` | #323338 |
| `--devui-btn-common-border-color` | #393939 |
| `--devui-btn-common-bg-hover` | #4e5057 |
| `--devui-btn-common-color-hover` | #CED1DB |
| `--devui-btn-common-border-color-hover` | #4e5057 |
| `--devui-btn-common-bg-active` | #4e5057 |
| `--devui-btn-common-color-active` | #CED1DB |
| `--devui-btn-common-border-color-active` | #317af7 |
| `--devui-btn-common-border-disabled` | #323338 |
| `--devui-icon-hover-bg` | #393939 |
| `--devui-icon-active-bg` | #4e5057 |
| `--devui-glass-morphism-floating-container-bg` | rgba(0, 0, 0, 0.9) |
| `--devui-form-control-line-rippling` | rgba(49, 122, 247, 0.08) |
| `--devui-warning-text` | #f4840c |
| `--devui-success-text` | #058358 |
| `--devui-link-light-disabled` | #4e5057 |
| `--devui-disabled-fill-bg` | #2e2f33 |
| `--devui-constant-blue` | #317af7 |
| `--devui-constant-blue-hover` | #5291ff |
| `--devui-constant-blue-active` | #002794 |
| `--devui-constant-blue-disabled` | #fcce92 |
| `--devui-constant-blue-rippling` | rgba(49, 122, 247, 0.08) |
| `--devui-danger-text` | #e7434a |
| `--devui-blue-5` | #F2F9FF |
| `--devui-blue-10` | #DBEEFF |
| `--devui-blue-20` | #A2CAFA |
| `--devui-blue-30` | #74ADF7 |
| `--devui-blue-40` | #5291FF |
| `--devui-blue-50` | #317AF7 |
| `--devui-blue-60` | #2B60CC |
| `--devui-blue-70` | #264DAB |
| `--devui-blue-80` | #082677 |
| `--devui-blue-90` | #00196b |
| `--devui-blue-100` | #000B33 |
| `--devui-slate-5` | #000000 |
| `--devui-slate-10` | #1A1A1A |
| `--devui-slate-20` | #262626 |
| `--devui-slate-30` | #333333 |
| `--devui-slate-40` | #4D4D4D |
| `--devui-slate-50` | #666666 |
| `--devui-slate-60` | #808080 |
| `--devui-slate-70` | #999999 |
| `--devui-slate-80` | #B3B3B3 |
| `--devui-slate-90` | #E6E6E6 |
| `--devui-slate-100` | #FFFFFF |
| `--devui-gray-5` | #000000 |
| `--devui-gray-10` | #16181a |
| `--devui-gray-20` | #2a2a2a |
| `--devui-gray-30` | #2e2f33 |
| `--devui-gray-40` | #323338 |
| `--devui-gray-50` | #393939 |
| `--devui-gray-60` | #4e5057 |
| `--devui-gray-70` | #696c75 |
| `--devui-gray-80` | #868a99 |
| `--devui-gray-90` | #E6E6E6 |
| `--devui-gray-100` | #f3f3f3 |
| `--devui-zinc-5` | #1A1A1C |
| `--devui-zinc-10` | #212124 |
| `--devui-zinc-20` | #28282B |
| `--devui-zinc-30` | #2F2F33 |
| `--devui-zinc-40` | #353537 |
| `--devui-zinc-50` | #3D3D42 |
| `--devui-zinc-60` | #4B4B52 |
| `--devui-zinc-70` | #5B5D66 |
| `--devui-zinc-80` | #767680 |
| `--devui-zinc-90` | #9898A3 |
| `--devui-zinc-100` | #B7B7C7 |
| `--devui-sky-5` | #e8fcfd |
| `--devui-sky-10` | #c9f6f9 |
| `--devui-sky-20` | #a4ecf1 |
| `--devui-sky-30` | #7ddfe7 |
| `--devui-sky-40` | #55ccd9 |
| `--devui-sky-50` | #2cb8c9 |
| `--devui-sky-60` | #1c94a4 |
| `--devui-sky-70` | #127180 |
| `--devui-sky-80` | #094c57 |
| `--devui-sky-100` | #04282f |
| `--devui-green-5` | #F3FFF0 |
| `--devui-green-10` | #D8EED1 |
| `--devui-green-20` | #BCDCB4 |
| `--devui-green-30` | #8ABA82 |
| `--devui-green-40` | #75B06D |
| `--devui-green-50` | #5BA854 |
| `--devui-green-60` | #2C9624 |
| `--devui-green-70` | #208718 |
| `--devui-green-80` | #166610 |
| `--devui-green-100` | #003303 |
| `--devui-lime-5` | #f2fbe9 |
| `--devui-lime-10` | #dff4cc |
| `--devui-lime-20` | #c6e9a8 |
| `--devui-lime-30` | #a8db81 |
| `--devui-lime-40` | #87c859 |
| `--devui-lime-50` | #62b42e |
| `--devui-lime-60` | #488e20 |
| `--devui-lime-70` | #316614 |
| `--devui-lime-80` | #1b3e0a |
| `--devui-lime-100` | #0c2004 |
| `--devui-yellow-5` | #fefce0 |
| `--devui-yellow-10` | #fdf8b8 |
| `--devui-yellow-20` | #fef08a |
| `--devui-yellow-30` | #fde55c |
| `--devui-yellow-40` | #fcd72e |
| `--devui-yellow-50` | #fcc800 |
| `--devui-yellow-60` | #d19f00 |
| `--devui-yellow-70` | #9e7400 |
| `--devui-yellow-80` | #614500 |
| `--devui-yellow-100` | #2e1f00 |
| `--devui-orange-5` | #fef5e8 |
| `--devui-orange-10` | #fde2bd |
| `--devui-orange-20` | #fcce92 |
| `--devui-orange-30` | #f9b766 |
| `--devui-orange-40` | #f69e39 |
| `--devui-orange-50` | #f4840c |
| `--devui-orange-60` | #c76207 |
| `--devui-orange-70` | #954304 |
| `--devui-orange-80` | #642802 |
| `--devui-orange-100` | #3d1601 |
| `--devui-red-5` | #fee7e8 |
| `--devui-red-10` | #fabdc1 |
| `--devui-red-20` | #f59297 |
| `--devui-red-30` | #ee696f |
| `--devui-red-40` | #e7434a |
| `--devui-red-50` | #e02128 |
| `--devui-red-60` | #c7000b |
| `--devui-red-70` | #850f12 |
| `--devui-red-80` | #59080a |
| `--devui-red-100` | #350305 |
| `--devui-magenta-5` | #fee5f2 |
| `--devui-magenta-10` | #fcc3e0 |
| `--devui-magenta-20` | #f99ac7 |
| `--devui-magenta-30` | #f470ab |
| `--devui-magenta-40` | #ed448a |
| `--devui-magenta-50` | #e61866 |
| `--devui-magenta-60` | #c40054 |
| `--devui-magenta-70` | #811439 |
| `--devui-magenta-80` | #540d24 |
| `--devui-magenta-100` | #330614 |
| `--devui-purple-5` | #f7edfe |
| `--devui-purple-10` | #e8cffe |
| `--devui-purple-20` | #d9b1fd |
| `--devui-purple-30` | #cb8efb |
| `--devui-purple-40` | #bf68fa |
| `--devui-purple-50` | #b62bf7 |
| `--devui-purple-60` | #8a21bc |
| `--devui-purple-70` | #651b8b |
| `--devui-purple-80` | #520673 |
| `--devui-purple-100` | #36004d |

---

## 阴影与组件层级映射

| 阴影变量（组合使用） | 典型用法（适用组件） | 层级变量 | 说明 |
|---------|-------------------|---------|------|
| `var(--devui-shadow-length-base) var(--devui-light-shadow)` | Card、List、Table | — | 基础阴影，直接铺陈在页面上方 |
| `var(--devui-shadow-length-connected-overlay) var(--devui-connected-overlay-shadow)` | DatePicker、Cascader、Select 下拉菜单 | `var(--devui-z-index-dropdown)` | 有连接点的弹出层 |
| `var(--devui-shadow-length-hover) var(--devui-hover-shadow)` | Card hover、MenuItem hover | — | 悬浮态阴影 |
| `var(--devui-shadow-length-feedback-overlay) var(--devui-feedback-overlay-shadow)` | PopOver、Tooltip、Toast、StepsGuide | `var(--devui-z-index-pop-up)` | 信息提示反馈类 |
| `var(--devui-shadow-length-fullscreen-overlay) var(--devui-feedback-overlay-shadow)` | Drawer、Modal、ImagePreview | `var(--devui-z-index-modal)` / `var(--devui-z-index-drawer)` | 无连接点的弹出层 |
| `var(--devui-shadow-length-slide-left)` | DataGrid 固定列向左滑动 | — | 左侧滑出阴影 |
| `var(--devui-shadow-length-slide-right)` | DataGrid 固定列向右滑动 | — | 右侧滑出阴影 |

使用示例：
```css
.card {
  box-shadow: var(--devui-shadow-length-base) var(--devui-light-shadow);
}
.card:hover {
  box-shadow: var(--devui-shadow-length-hover) var(--devui-hover-shadow);
}
```

---

## 响应式适配

| 设备 | 分辨率 | 主要变动 |
| --- | --- | --- |
| Mobile 手机 | < 768px | 标准移动叠放布局 |
| 平板、折叠屏 | 768px - 1023px | 部分功能隐藏/折叠，允许使用横向内容滚动适配 |
| 平板 | 1024px - 1279px | 与桌面端布局基本一致，部分功能隐藏/折叠，允许使用横向内容滚动适配，部分布局边距可能需要调整 |
| 常规PC | 1280px - 1920px及以上 | 完整布局，最大内容宽度，不允许出现页面级横向内容滚动 |

---

## Best Practices

- 各个布局结构不要随意增加自定义的 border、background 样式
- 优先使用组件 Props，减少自定义样式实现
- 无 DevUI 组件库时，使用 CSS `var(--devui-*)` 引用 Token，不得硬编码色值
- 生成页面时，根据提示词关键字（新无限/无限/追光）自动匹配主题，不得自创主题名

### 图表规范

- **折线图面积填充**：使用与线条色同一色相的渐变填充，从上到下不透明度设为 40% → 24% → 8%（三阶渐变）
- **线条宽度**：默认 3px
- **坐标轴**：轴线色 `var(--devui-line)`，标签色 `var(--devui-aide-text)`，分割线色 `var(--devui-dividing-line)` 虚线
