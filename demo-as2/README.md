# AgentSpace 2.0 交互 Demo · AS2 设计系统版

单文件可交互原型：`index.html`（直接用浏览器打开，或访问 GitHub Pages：<https://vinniechenyu.github.io/AgentSpace/demo-as2/>）。

在 MVP 原型的基础上，用 AgentSpace 2.0 设计系统（AS2）重构了前端样式与组件，交互逻辑保持不变，并补充了：

- **框架**：灰阶画布 + 二级菜单与内容同处一块 18px 面板；面包屑右侧只放可见范围。
- **组件**：墨色胶囊主按钮、AS2 状态（执行中 / 需要你 / 待验收 / 已完成）、统一的输入类控件、Composer（参考 Kobra Chat Input / affectUI Chat Composer）。
- **执行可见性**：执行中的任务实时显示当前活动、步骤进度、可展开的工具调用与停止按钮（示例数据）。
- **设置**：通用 / 外观 / 通知 / Agent 与自主权 / 记忆与进化 / 扩展与权限 / 快捷键 / 数据与隐私。
- **主题**：浅色、深色，以及两款个性化皮肤——「流光」（液态玻璃，6 套预设配色 + 自定义主色 / 辅色）与「像素」（开发者风：中性灰、等宽字体、像素标题、直角硬边）。
- **侧栏**（参考 Kobra Sidebar）：选中线滑动、悬停高亮、可收起、可拖动调宽（200–360px），项目切换为锚定浮窗。
- **头像**：Agent 使用 AgentSpace 吉祥物，成员使用 3D 人物形象（见 `build/assets/avatars/CREDITS.md`）。
- **进化中心**：二级菜单进入侧栏，与其他空间同一框架。

数据与执行均为本地演示，保存在浏览器 localStorage；可在「设置 → 数据与隐私」重置。

## 重新生成

`index.html` 由 `build/` 下的脚本生成，原始 MVP 页面保持不动：

```bash
cd demo-as2/build
python3 refactor-as2.py
cp agentspace2.0_mvp.as2.html ../index.html
```

| 文件 | 作用 |
|---|---|
| `backups/agentspace2.0_mvp.before-affectui.html` | 原始 MVP 原型（输入，不修改） |
| `design-system/tokens.css` · `components.css` | AS2 设计 token 与组件样式 |
| `refactor-as2.py` | 构建脚本：内联设计系统，把遗留样式的颜色 / 圆角 / 阴影 / 字体收敛为 AS2 token，并对模板做必要修改 |
| `as2-bridge.css` | 把 demo 自有类名映射到 AS2 组件 |
| `as2-settings.js` | 设置弹窗与全局偏好、输入方式（键盘才显示焦点环） |
| `as2-run.js` | 执行过程组件：Thinking Loader、Task List、Tool Call、停止 |
| `as2-sidebar.js` | 侧栏动效、收起与拖动调宽、项目切换浮窗 |
| `as2-avatars.js` | 把首字母头像替换为成员 / Agent 头像 |
| `assets/avatars/` | 头像资源与来源说明（构建时内嵌） |
| `assets/agentspace-logo.svg` | 品牌 logo（构建时内嵌） |
| `lucide-extract.py` · `assets/lucide-icons.json` | 图标：从 lucide-react 按语义映射提取 Lucide 图标数据（修改映射后重新运行脚本） |
