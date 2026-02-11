# Bubble6 拖拽跟随问题解决方案

## 问题描述
在主界面中，bubble6 不能跟随岛屿移动。拖拽岛屿时，bubble6 会突然移动到左上角，而不是像其他气泡（bubble1-5）一样保持相对位置不变。

## 问题原因
1. **CSS优先级问题**：`.is-dragging` 规则中使用了 `left: auto !important` 和 `top: auto !important`，这些规则会覆盖 JavaScript 设置的内联样式，导致位置计算错误。

2. **相对位置初始化问题**：bubble6 初始使用居中定位（`left: 50%; top: 50%; transform: translate(-50%, -50%)`），在拖拽开始时计算相对位置时可能出现异常值。

3. **定位方式冲突**：bubble6 的 CSS 使用百分比定位，而拖拽时需要转换为像素定位，两者之间存在冲突。

## 解决方案

### 1. 修复 CSS 规则
移除了 `.is-dragging` 规则中的 `left: auto !important` 和 `top: auto !important`，只保留 `transform: translate(0, 0) !important`，让 JavaScript 的内联样式能够正确设置位置。

```css
/* 修改前 */
.main-frame .bubble-wrapper-bubble6.is-dragging {
  left: auto !important;
  top: auto !important;
  transform: translate(0, 0) !important;
}

/* 修改后 */
.main-frame .bubble-wrapper-bubble6.is-dragging {
  transform: translate(0, 0) !important;
}
```

### 2. 优化相对位置初始化
在 `startDrag` 函数中，确保 bubble6 的相对位置正确初始化：
- 添加异常值检测：如果计算出的相对位置绝对值 > 500px，说明计算错误，使用 (0, 0)
- 支持两种 key 格式（`"bubble6"` 和 `"bubble" + index`）以兼容不同情况
- 在拖拽开始时，基于相对位置将 bubble6 从居中定位转换为绝对定位

### 3. 保存拖拽开始时的岛屿偏移
添加了 `dragStartIslandOffsetX` 和 `dragStartIslandOffsetY` 变量，在 `startDrag` 时保存初始岛屿位置，用于在 `onDrag` 中正确计算相对位置（如果相对位置不存在）。

### 4. 统一位置更新逻辑
在 `onDrag` 函数中，bubble6 与其他气泡使用相同的逻辑更新位置：
- 基于相对位置计算新位置
- 应用惯性跟随效果
- 使用内联样式设置位置（优先级高于 CSS）

## 关键代码修改

### CSS 修改
- 移除了 `.is-dragging` 规则中的 `left` 和 `top` 设置
- 保留了 `transform: translate(0, 0) !important` 以清除居中定位的 transform

### JavaScript 修改
1. **startDrag 函数**：
   - 添加异常值检测
   - 确保相对位置正确初始化
   - 将 bubble6 从居中定位转换为绝对定位

2. **onDrag 函数**：
   - 使用拖拽开始时的岛屿位置计算相对位置（如果不存在）
   - 统一的位置更新逻辑

3. **endDrag 函数**：
   - 清除惯性偏移，恢复到最终相对位置

## 效果
修复后，bubble6 能够：
- ✅ 在拖拽过程中保持相对位置不变（与其他气泡一致）
- ✅ 只产生惯性效果，不会突然移动到左上角
- ✅ 拖拽前后相对位置保持一致
- ✅ 正确跟随岛屿移动

## 注意事项
- bubble6 初始使用居中定位，在拖拽时需要转换为绝对定位
- 相对位置的计算需要考虑初始居中定位的特殊性
- CSS 的 `!important` 规则会覆盖内联样式，需要谨慎使用
