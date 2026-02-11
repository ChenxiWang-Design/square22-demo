# Bubble6 组件

Bubble6 是一个位于主界面中央的气泡组件，使用 SVG 文件实现。

## 尺寸

- **默认态**：151×191px
- **展开态**：235×286px

## 交互

- **长按默认态**（500ms）→ 展开态浮层
- **点击遮罩** → 收起展开态
- **hover 效果**：默认态轻微放大（scale 1.02）
- **长按反馈**：默认态轻微缩小（scale 0.98）

## 文件结构

```
bubble6/
├── index.html    # 组件 HTML 结构
├── bubble6.css   # 组件样式
├── bubble6.js    # 交互逻辑
└── README.md     # 本文件
```

## SVG 资源

SVG 文件位于 `Pic/bubble6AIGC/`：
- `Bubble6默认态.svg`（151×191）
- `Bubble6展开态.svg`（235×286）

## 嵌入主界面

主界面通过 iframe 嵌入 bubble6：
```html
<iframe src="components/bubble6/index.html?embed=1" ...></iframe>
```

当 `embed=1` 参数存在时，组件会：
- 使用嵌入布局（`.bubble6-embed`）
- 展开时通过 `postMessage` 通知主界面
- 遮罩和模糊效果由主界面统一处理

## 预览

单独预览：在浏览器中打开 `components/bubble6/index.html`

主界面预览：在主界面中查看，bubble6 位于中央位置
