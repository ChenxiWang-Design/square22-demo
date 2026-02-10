# Register 注册流程模块

## 目录结构

```
Register/
├── index.html          # 主入口文件
├── register.css        # 样式文件
├── register.js         # 页面切换逻辑
├── README.md          # 说明文档
└── pages/             # 各个页面的具体内容（可选，如果页面内容较多可以拆分）
    ├── page1.html
    ├── page2.html
    └── ...
```

## 使用说明

### 基本结构

Register模块采用单页应用（SPA）的方式，所有页面都在 `index.html` 中，通过JavaScript控制显示/隐藏。

### 添加新页面

1. 在 `index.html` 的 `.page-wrapper` 中添加新的页面div：

```html
<div class="page page-N" data-page="N">
  <div class="page-content">
    <h1>页面标题</h1>
    <p>页面内容</p>
    <button class="btn-next" onclick="goToNextPage()">下一步</button>
    <button class="btn-prev" onclick="goToPrevPage()">上一步</button>
  </div>
</div>
```

2. 在 `register.js` 中更新 `totalPages` 变量（如果使用动态获取可以忽略）

3. 在进度指示器中添加对应的进度点（可选）

### API

#### `goToNextPage()`
跳转到下一页

#### `goToPrevPage()`
跳转到上一页

#### `goToPage(pageNumber)`
跳转到指定页面

#### `RegisterFlow.getCurrentPage()`
获取当前页面编号

#### `RegisterFlow.getTotalPages()`
获取总页面数

### 自定义样式

可以通过修改 `register.css` 来自定义页面样式、动画效果等。

### 页面过渡动画

当前使用简单的淡入淡出和滑动效果，可以在CSS中自定义更复杂的过渡动画。
