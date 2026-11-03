# AgentSpace Liquid Glass 独立预览

入口：`demo-liquid-glass/index.html`。与 `demo-as2/`、根目录入口完全分开。

- 三张壁纸，左右方向键切换；仅深夜工作室启用 dark mode。
- 主体统一 Liquid 折射，白色填充及模糊支持上下渐变；右下角可调节。
- CSS、Liquid 引擎、图片与 SVG 均位于本目录，相对路径加载，支持 GitHub Pages 子路径。
- 本地状态使用 `agentspace-glass-preview-*` / `glass-preview-*`，不读写原版状态。
- 无构建步骤。仓库根目录运行 HTTP 静态服务器，访问 `/demo-liquid-glass/`。

Liquid Glass 引擎复用 AI Infra 的 liquid-glass-controls，保留本目录 LICENSE。壁纸为本次预览提供的素材；工作垫为 SVG 重绘。

验证：内联脚本和引擎语法、资源相对路径、目录隔离。近期浏览器自动化连接不可用，最终视觉回归尚未完成；性能尚无量化对比。
