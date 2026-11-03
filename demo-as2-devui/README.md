# AgentSpace 2.0 交互 Demo · DevUI 多主题版

`index.html` 是 [AS2 版 Demo](../demo-as2/) 的副本，按 DevUI 多主题设计规范（`demo-as2/build/devui/vendor/DESIGN.md`）调整：
所有颜色、圆角、阴影、字体、动效都改由 `--devui-*` 变量取值，主题挂在 `<body data-theme data-mode>` 上。

GitHub Pages：<https://vinniechenyu.github.io/AgentSpace/demo-as2-devui/>

- **8 套主题**（设置 → 外观）：简约 · 浅 / 深（墨，默认）、流光 · 浅 / 深（液态玻璃）、像素，以及 DevUI 官方的新无限、无限、追光。
- **DevUI 几何**：主按钮平铺实底、4px 圆角按钮与输入框、各浮层使用对应的面色与阴影组合。
- **材质**：玻璃只用于浮在内容上的面且最多一层；像素风为 2px 墨边、0 圆角、硬投影、阶跃动效。
- 与 AS2 版分开保存本地状态，互不影响。

## 重新生成

```bash
cd demo-as2/build
python3 refactor-as2.py            # 先生成 AS2 版
python3 devui/build-devui.py       # 再生成 DevUI 版
cp agentspace2.0_mvp.devui.html ../../demo-as2-devui/index.html
```
