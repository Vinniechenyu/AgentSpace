# AgentSpace · 团队协作 Agent 平台

> 面向团队的多 Agent 协作工作台 —— 把代码、需求、架构、评审、测试、数据等 Agent 编排到一处，配合 Skill / Tool / Memory 与精细的权限治理，让 AI 真正融入团队研发流程。

🔗 **在线演示：** https://vinniechenyu.github.io/AgentSpace/

> ⚠️ 本仓库为产品原型（单文件 HTML Demo），用于交互与界面演示，数据均为示例。

---

## ✨ 核心能力

- **Agent 中心** —— 内置代码、需求、架构设计、评审、测试、数据等多种 Agent，支持新建、配置与运行状态查看，工作记录可一键派生为任务。
- **Skill 中心** —— 管理 Agent 可调用的技能，支持官方 / 团队 / 个人多来源与启用控制。
- **Tool 中心（AI 市场）** —— 浏览与接入 MCP、外部工具，统一管理连接状态。
- **Memory 体系** —— 个人 Memory、团队知识源、入库策略与权限分发，让 Agent 拥有可治理的长期记忆。
- **权限与治理** —— 租户 / 团队 / 个人多级可见性（仅本人 · 团队公开 · 团队覆盖 · 继承自租户），配合强制锁定、变更审计与全局策略。
- **定时任务** —— 基于触发条件的自动执行与编排。
- **成员、计费与配额** —— 订阅、配额、成员与权限的统一管理。
- **响应式体验** —— 同时适配桌面端与移动端（AgentSpace Mobile）。

## 🚀 快速开始

直接访问在线演示，或在本地打开：

```bash
git clone https://github.com/Vinniechenyu/AgentSpace.git
cd AgentSpace
open index.html      # macOS；其他系统用浏览器打开 index.html 即可
```

无需任何构建步骤或依赖 —— 整个原型是一个独立的 `index.html`。

## 🌐 部署（GitHub Pages）

本站点通过 GitHub Pages 部署：

1. 仓库根目录提供 `index.html`
2. **Settings → Pages → Source** 选择 **Deploy from a branch**，分支 `main`，目录 `/ (root)`
3. 保存后访问 `https://vinniechenyu.github.io/AgentSpace/`

## 📁 仓库结构

```
AgentSpace/
├── index.html   # 完整产品原型（单文件）
└── README.md
```

## 📄 License

暂未声明开源许可，默认保留所有权利。如需复用请先与作者沟通。
