# Register2 注册流程模块

## 概述

Register2 是一个多页面注册流程模块，使用 360×793 的移动端容器尺寸，支持页面间的切换、动画效果、表单填写、下拉菜单等交互功能。

## 目录结构

```
Register2/
├── index.html          # 主入口文件
├── register2.css       # 样式文件
├── register2.js        # 页面切换逻辑
└── README.md          # 说明文档
```

## 功能特性

- ✅ 多页面切换（R1, R2, R3, R4 等）
- ✅ 前进/后退导航
- ✅ 进度指示器
- ✅ 页面切换动画
- ✅ 键盘快捷键支持（左右箭头）
- ✅ 可扩展的页面事件系统

## 使用说明

### 基本结构

Register2 采用单页应用（SPA）的方式，所有页面都在 `index.html` 中，通过 JavaScript 控制显示/隐藏。

### 添加新页面

1. 在 `index.html` 的 `.page-wrapper` 中添加新的页面 div：

```html
<div class="page page-N" data-page="N">
  <div class="page-content page-N-content">
    <div class="page-background">
      <!-- 背景内容 -->
    </div>
    
    <div class="page-content-layer">
      <!-- 页面内容 -->
      <h1>R{N} 页面</h1>
      
      <!-- 返回按钮 -->
      <button class="btn-prev" onclick="goToPrevPage()">返回</button>
      <!-- 下一步按钮 -->
      <button class="btn-next" onclick="goToNextPage()">下一步</button>
    </div>
  </div>
</div>
```

2. 在 `register2.js` 中更新 `totalPages` 变量

3. 在进度指示器中添加对应的进度点

4. 在 `register2.css` 中添加页面特定的样式

### API

#### `goToNextPage()`
跳转到下一页

#### `goToPrevPage()`
跳转到上一页

#### `goToPage(pageNumber)`
跳转到指定页面

#### `getCurrentPage()`
获取当前页面编号

#### `getTotalPages()`
获取总页面数

#### `showPage(pageNumber)`
显示指定页面

### 页面事件

每个页面支持以下自定义事件：

- `page-show`: 页面显示时触发
- `page-leave`: 页面离开时触发

示例：

```javascript
const pageElement = document.querySelector('.page-1');
pageElement.addEventListener('page-show', (event) => {
  console.log('R1 页面显示了');
  // 执行页面特定的初始化
});

pageElement.addEventListener('page-leave', (event) => {
  console.log('R1 页面离开了');
  // 执行清理操作
});
```

### 自定义样式

可以通过修改 `register2.css` 来自定义：
- 页面背景和颜色
- 按钮样式
- 动画效果
- 进度指示器样式

### 键盘快捷键

- `←` (左箭头): 上一页
- `→` (右箭头): 下一页

## 预览

在浏览器中打开 `index.html` 即可预览。建议使用本地服务器：

```bash
# Python 3
python -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000
```

然后访问：`http://localhost:8000/Register2/index.html`

## 扩展功能

### 添加表单验证

可以在页面切换前添加表单验证逻辑：

```javascript
function goToNextPage() {
  if (validateCurrentPage()) {
    // 验证通过，继续切换
    // ...
  } else {
    // 显示错误提示
    alert('请填写完整信息');
  }
}
```

### 添加动画效果

在 CSS 中定义页面切换动画：

```css
.page {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.page.slide-out {
  transform: translateX(-100%);
}

.page.slide-in {
  transform: translateX(0);
}
```

### 添加下拉菜单

在页面中添加下拉菜单组件：

```html
<select class="dropdown-menu">
  <option value="option1">选项1</option>
  <option value="option2">选项2</option>
</select>
```

## 注意事项

- 确保所有页面使用相同的容器尺寸（360×793）
- 页面切换时注意数据保存和恢复
- 考虑移动端的触摸交互体验
