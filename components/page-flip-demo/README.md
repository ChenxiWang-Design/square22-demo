# 读书翻页 demo（StPageFlip / page-flip）

本目录使用 **StPageFlip**（[page-flip](https://www.npmjs.com/package/page-flip)）实现读书翻页，参考：[Realistic Book Page Flip Animation – StPageFlip](https://www.cssscript.com/book-page-flip-animation/)。

## 与 Turn.js（page-curl-demo）的区别

| 项目 | Turn.js（page-curl-demo） | StPageFlip（本 demo） |
|------|---------------------------|------------------------|
| **依赖** | 依赖 jQuery | **无依赖**（纯 JS） |
| **定位** | 库内部会改容器 `position`/尺寸，易导致「飘动」 | **固定尺寸**（`size: "fixed"`, `width`/`height`），容器位置稳定 |
| **内容与翻页** | 页 DOM 由库重组，内容不一定随「当前页」一起翻 | **内容随页翻动**：每页是独立 HTML，翻页即翻整块内容 |
| **API** | `$("#flipbook").turn(options)`，多页书结构（hard + page） | `new St.PageFlip(el, options)`，`loadFromHTML(.page)`，事件 `flip` / `changeState` |
| **交互** | 悬停书角即可卷曲（可关），拖拽书角翻页 | **按下 + 拖拽** 书角翻页（无悬停即翻） |
| **适用** | 多页书、需与旧项目 jQuery 共存 | 新项目、单页/多页、固定布局、内容必须跟页走 |

## 使用方式

1. 用浏览器打开 `index.html`（若 CDN 可用则直接打开）。
2. 若 CDN 不可用：  
   `npm install page-flip`，将 `node_modules/page-flip/dist/js/page-flip.browser.min.js` 拷到本目录，把 `index.html` 中的 script 改为该本地文件后刷新。

## 文件说明

- `index.html`：翻书容器 + 若干 `.page`，引入 StPageFlip（CDN）与 `demo.js`。
- `demo.css`：固定容器 `.book-container`（320×440），避免翻书区域飘动；每页样式。
- `demo.js`：`new St.PageFlip(container, { size: "fixed", width: 320, height: 440, ... })`，`loadFromHTML(.page)`，并绑定 `flip` / `changeState`。

## 气泡组件（bubble1）后续建议

若要在气泡里做「从右下角卷曲翻页、内容随页动、位置不飘」：

- 可改用 **StPageFlip**：把绿色 143×60 作为一页，用固定尺寸（如 131×48）初始化，内容放在该页的 HTML 里，翻页即整块内容随页翻。
- 或继续用 Turn.js 时：外层始终用**固定定位的包装层**包住翻书容器，并关闭「悬停即卷曲」，仅「按下后拖拽」才翻页。
