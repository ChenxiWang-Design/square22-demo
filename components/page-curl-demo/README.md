# 翻书效果演示（Turn.js）

本目录是一个**独立的翻书演示**，仅做翻书效果，无正文内容。用于对比「真实仿真翻书」与气泡里当前实现的差异。

## 效果说明

- 使用 [Turn.js](http://www.turnjs.com/) 实现：书角可拖拽、页面沿折线卷曲、有厚度与阴影，即「仿真翻书」。
- 若 CDN 能加载：打开 `index.html` 或在本目录执行 `npx serve .` 后访问，拖拽书角或边缘即可翻页。
- 若 Turn.js 未加载：页面会提示；可从 [turnjs.com](http://www.turnjs.com) 下载 `turn.min.js` 放到本目录，并把 `index.html` 中的 Turn.js 的 script 改为 `src="turn.min.js"` 后刷新。

## 本地预览

```bash
cd c:\Users\24251\.cursor\Square1\components\page-curl-demo
npx serve .
```

浏览器打开终端里显示的地址（如 http://localhost:3000）即可。
