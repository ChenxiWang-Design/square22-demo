# B1chat 群聊界面

与 Register2 同级的界面系列，用于群聊场景。

## 结构

- **index.html**：群聊主页面（可直接在浏览器打开预览）
- **b1chat.css**：样式（尺寸 360×793，与 Register2 一致；底图使用 `Pic/Register/渐变背景.jpg`）
- **b1chat.js**：返回主界面、发送消息、回车发送等逻辑

## 设计参考

- 布局参考：`容器 48 1.svg`（顶部栏、消息区、底部圆角输入框）
- 底图：`../Pic/Register/渐变背景.jpg`（与 Register 系列一致）

## 预览

### 使用预览服务器（推荐）

1. 双击运行 `启动预览服务器.bat`
2. 访问 `http://localhost:8080/B1chat/index.html`

**⚠️ 如果遇到连接错误，请查看 [问题解决记录.md](./问题解决记录.md)**

### 其他方式

在项目根目录下用任意本地服务器打开，或直接双击 `index.html` 打开：

- 打开 `B1chat/index.html` 即可预览群聊界面
- 返回按钮预留了与主界面衔接：`goToMain()` 会尝试跳转 `../index.html` 或由父页面/全局 `openMain()` 处理

## 与主界面连接（后续）

- 主界面可通过链接或 iframe 进入：`B1chat/index.html`
- B1chat 内点击返回会调用 `goToMain()`，主界面可提供 `openMain` 或通过 iframe 的 parent 处理
