# Bubble3 组件

与 `bubble3.pen` 中 **Bubble3-默认态**、**Bubble3-展开态** 对应的气泡组件。

## 文件

- `index.html`：页面结构（默认态 + 展开态浮层）
- `bubble3.css`：样式（默认态 201×111，展开态 237×289）
- `bubble3.js`：长按展开、照片区拖拽与惯性、postMessage 与主界面联动

## 交互

- **默认态**：长按约 250ms 进入展开态
- **展开态**：先 展开态1（叠放）0.5s，再过渡到 展开态2（图1 左、图2 中、图3 右）；照片区支持长按约 150ms 后横向拖拽，松手后停留在拖拽位置；点击遮罩或主界面遮罩关闭
- **图片**：图1/图2/图3 对应 `Pic/pic1.png`、`pic2.png`、`pic3.png`（路径相对 `components/bubble3/` 为 `../../Pic/`）

## 嵌入主界面

主界面 `index.html` 已通过 iframe 嵌入 bubble3：

- iframe 地址：`components/bubble3/index.html?embed=1`
- 默认态尺寸：201×111，位置由主界面 CSS（如 `.iframe-bubble3`）控制
- 展开态尺寸：237×289，由主界面添加 `is-expanded` 并监听 `bubble3-expanded` / `bubble3-collapsed` 控制
- **模糊效果**：主界面全屏遮罩 `#main-overlay` 使用 `backdrop-filter: blur(8px)`，任一气泡（含 bubble3）长按展开时显示该遮罩，主界面背景与其他气泡被模糊，展开的 iframe 置于遮罩之上（z-index 1001）

## 预览

- 单独预览：用浏览器打开 `components/bubble3/index.html`
- 在主界面中：打开项目根目录的 `index.html`，在 bubble3 上长按即可展开，主界面会显示模糊遮罩
