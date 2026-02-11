# 广场气泡组件 (Square1 Bubbles)

主界面（Frame map 2，360×793）上可放置多种气泡组件，每种在独立文件夹中实现，通过 iframe 嵌入主界面。

## 组件列表

| 组件 | 路径 | 说明 |
|------|------|------|
| **Bubble1** | `bubble1/` | 绿渐变气泡，内页卷曲翻页 → 展开态，胶带贴纸 |
| **Bubble2** | `bubble2/` | 黄块+黄气泡，长按 → 展开态，狼人杀聊天内容 |
| **Bubble6** | `bubble6/` | 中央位置气泡，长按 → 展开态，使用 SVG 文件 |

## 主界面嵌入方式

主界面（项目根目录 `index.html`）使用 360×793 画布与底图 `frame-map-bg.png`，通过 **iframe** 嵌入组件并加 `?embed=1`：

- 组件内背景为透明，叠在底图上。
- 带 `?embed=1` 时组件会使用「嵌入布局」（如固定到左下等），具体位置在各组件的 CSS 中配置（`.bubble1-embed` / `.bubble2-embed` / `.bubble6-embed`）。

**示例：只嵌 Bubble1**

```html
<div class="main-frame">
  <iframe src="components/bubble1/index.html?embed=1" title="Bubble1"></iframe>
</div>
```

**示例：同时嵌 Bubble1 与 Bubble2（需为每个 iframe 设不同定位）**

```html
<div class="main-frame">
  <iframe class="bubble-iframe bubble-iframe--1" src="components/bubble1/index.html?embed=1" title="Bubble1"></iframe>
  <iframe class="bubble-iframe bubble-iframe--2" src="components/bubble2/index.html?embed=1" title="Bubble2"></iframe>
</div>
```

主界面 CSS 中为 `.bubble-iframe--1`、`.bubble-iframe--2` 分别设置 `left`/`top` 或 `right`/`bottom`，避免重叠。

## 本地预览

1. **单独预览某个气泡**：用浏览器打开对应组件的 `index.html`，例如：
   - `components/bubble1/index.html`
   - `components/bubble2/index.html`
   - `components/bubble6/index.html`
2. **主界面预览**：在项目根目录用静态服务打开根目录的 `index.html`。

建议使用本地静态服务（避免 `file://` 限制）：

```bash
npx serve .
# 然后访问 http://localhost:3000 或终端提示的地址
```

## 各组件说明

- **Bubble1**：详见 [bubble1/README.md](bubble1/README.md)
- **Bubble2**：详见 [bubble2/README.md](bubble2/README.md)
- **Bubble6**：详见 [bubble6/README.md](bubble6/README.md)

## 其他目录

- `page-curl-demo/`、`page-flip-demo/`：翻页效果 demo，供参考，主界面不依赖。
