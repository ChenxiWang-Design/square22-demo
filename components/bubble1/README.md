# Bubble1 组件

可交互气泡：StPageFlip 内页柔软卷曲翻页，点击/拖拽书角翻到展开态，点击遮罩收起。样式与 `bubble1.pen` 对应。

## 所需文件（嵌入主界面时请一并部署）

| 文件 | 说明 |
|------|------|
| `index.html` | 组件页，可单独打开或通过主界面 iframe 嵌入 |
| `bubble1.css` | 默认态 / 展开态 / 胶带 / 嵌入布局 |
| `bubble1.js` | 翻页初始化、展开/收起、嵌入检测 |
| `page-flip.browser.js` | StPageFlip 库（内页卷曲） |
| `stPageFlip.css` | StPageFlip 所需样式 |
| `tape.svg` | 展开态左上角蓝色胶带贴纸 |

## 嵌入主界面

主界面通过 iframe 引入组件并加 `?embed=1`，气泡会固定在主界面左下区域：

```html
<iframe src="components/bubble1/index.html?embed=1" title="Bubble1" width="360" height="793"></iframe>
```

组件内 `body` 背景为透明，便于叠在主界面背景（如地图）上。

## 本地预览

- **单独预览**：用浏览器打开 `components/bubble1/index.html`。
- **主界面预览**：在项目根目录打开根目录的 `index.html`（以 Frame map 2 为主界面，内嵌 bubble1）。

若使用 `file://` 打开，部分浏览器可能限制脚本或跨域，建议用本地静态服务：

```bash
npx serve .
```

## 交互说明

- **点击**绿色气泡区域或**拖拽**右下角书角 → 内页柔软卷曲翻页；翻到第 2 页后显示展开浮层。
- **点击**灰色遮罩 → 收起并翻回第 1 页。
- 垫在翻动页下方的静态页为纯灰 `#EDEDED`；展开态左上角有蓝色胶带贴纸。

## 样式与 Pencil 对应

- **默认态**：143×60，绿渐变、白边、底部小三角，与 bubble1.pen「Bubble1-默认态」一致。
- **展开态**：223×274，同绿渐变、白边、胶带贴纸，与「Bubble1-展开态」一致。
