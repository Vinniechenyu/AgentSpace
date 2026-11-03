# DevUI · 多主题设计规范

AgentSpace 的 DevUI 多主题扩展规范与交互预览。由本地 `devui-multitheme` 项目同步，保留原有组件、主题与生成方式。

**[在线阅读与下载 DESIGN.md](https://vinniechenyu.github.io/AgentSpace/devui-multitheme/)** · [返回聚合页](https://vinniechenyu.github.io/AgentSpace/) · [完整设计规范](./DESIGN.md)

## 设计文档

聚合页打开 `index.html` 文档阅读器，正文直接读取同目录的 `DESIGN.md`，包含章节目录、表格和代码块。顶部「下载 design.md」下载同一份原文。阅读器使用随仓库提供的 Marked 17.0.5（许可证见 `vendor/marked-LICENSE.md`），无需 CDN。

本地阅读请在仓库根目录运行 `python3 -m http.server 8000`，访问 `http://localhost:8000/devui-multitheme/`。

## 原组件预览

- 8 套主题：官方新无限、无限、追光；AgentSpace 扩展简约浅 / 深、流光浅 / 深、像素风。
- 切换主题，对照按钮、表单、标签、表格、弹窗与数据展示等组件。
- 搜索变量名、描述或色值，查看不同主题的 Token 映射。
- 主题偏好保存在当前浏览器；组件里的任务与指标均为展示示例。

直接打开 `preview.html`，或在仓库根目录运行 `python3 -m http.server 8000`，访问 `http://localhost:8000/devui-multitheme/preview.html`。

## 源文件与构建

```bash
cd devui-multitheme
python3 build.py
```

仅使用 Python 标准库，无需安装依赖。

| 文件 | 用途 |
| --- | --- |
| `DESIGN.md` | 设计规则与自动生成的主题 / 变量表 |
| `source/devui-official-design.md` | 构建使用的官方规范来源快照 |
| `tokens.py` | 主题元数据、Token 分类与扩展主题取值 |
| `preview.template.html` | 组件展示与变量映射页面模板 |
| `build.py` | 生成预览、文档表格与样式产物，执行变量和对比度检查 |
| `preview.html` | 已生成的独立预览页 |
| `dist/` | CSS、SCSS、LESS、TypeScript 与 JSON 产物 |

修改主题值时编辑 `tokens.py`，修改预览结构时编辑 `preview.template.html`，再重新构建。扩展样式保存在 `dist/devui-theme-overrides.css`；不要手改 `DESIGN.md` 的 `GEN` 区块。
