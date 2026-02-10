# 🔍 如何找到 ngrok 的 URL

## 📍 ngrok 窗口位置

当你运行 `方案2-一键启动.bat` 后，会打开**三个命令行窗口**：

1. **窗口1**：主服务器-8080（标题栏显示）
2. **窗口2**：API代理-3000（标题栏显示）
3. **窗口3**：**ngrok-8080** ← **这个窗口里有URL！**

---

## 🎯 找到 URL 的步骤

### 步骤1：找到 ngrok 窗口

1. **查看任务栏**
   - 在Windows任务栏底部，找到命令行窗口图标
   - 找到标题为 **"ngrok-8080"** 的窗口
   - 点击打开这个窗口

2. **或者按 Alt+Tab**
   - 按住 `Alt` 键，然后按 `Tab` 键
   - 在窗口列表中查找 **"ngrok-8080"**
   - 选中后松开按键

---

### 步骤2：在 ngrok 窗口中查找 URL

打开 ngrok 窗口后，你会看到类似这样的内容：

```
========================================
ngrok - 端口8080转发
========================================

正在启动ngrok...
启动后，复制Forwarding中的URL在手机访问

========================================

ngrok

Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-def456.ngrok-free.app -> http://localhost:8080
Forwarding                    http://abc123-def456.ngrok-free.app -> http://localhost:8080

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

---

### 步骤3：找到 "Forwarding" 行

在 ngrok 窗口中，找到这两行：

```
Forwarding                    https://abc123-def456.ngrok-free.app -> http://localhost:8080
Forwarding                    http://abc123-def456.ngrok-free.app -> http://localhost:8080
```

**这两行中的URL就是你要的！**

- `https://abc123-def456.ngrok-free.app` ← **这个就是公网URL**
- `http://abc123-def456.ngrok-free.app` ← 这个也可以，但推荐用https

**注意：你的URL会不同，格式类似 `https://xxxxx.ngrok-free.app`**

---

### 步骤4：复制 URL

**方法1：手动复制**
1. 在 ngrok 窗口中，找到 `https://xxxxx.ngrok-free.app` 这部分
2. 用鼠标选中这个URL（从 `https://` 开始，到 `.ngrok-free.app` 结束）
3. 按 `Ctrl + C` 复制
4. 或者右键点击选中的文字，选择"复制"

**方法2：使用 Web Interface（更简单）**
1. 在 ngrok 窗口中，找到这一行：
   ```
   Web Interface                 http://127.0.0.1:4040
   ```
2. 打开浏览器，访问：`http://127.0.0.1:4040`
3. 在网页中会显示更清晰的URL信息，可以直接复制

---

## 📱 在手机使用 URL

### 步骤1：确保电脑连接VPN
- 电脑必须连接VPN（保证AI功能可用）

### 步骤2：在手机浏览器打开
1. 打开手机浏览器（Chrome、Safari、Edge等）
2. 在地址栏输入复制的URL（例如：`https://abc123-def456.ngrok-free.app`）
3. 按回车访问

### 步骤3：处理 ngrok 警告页面（如果出现）

**如果看到 ngrok 的警告页面：**
- 页面显示 "You are about to visit..." 或 "Visit Site"
- 这是免费版的正常限制
- **点击 "Visit Site" 或 "Continue" 按钮**
- 然后就能正常访问了

---

## ⚠️ 如果看不到 URL？

### 情况1：ngrok 窗口显示错误

**如果看到错误信息：**
```
ERROR:  authtoken is required
```

**解决方法：**
1. 打开命令行
2. 运行：`ngrok config add-authtoken 你的authtoken`
3. 重新启动 ngrok

**如何获取 authtoken：**
- 访问：https://dashboard.ngrok.com/get-started/your-authtoken
- 登录后复制 authtoken

---

### 情况2：ngrok 窗口是空的或卡住

**解决方法：**
1. 关闭 ngrok 窗口（按 `Ctrl+C`）
2. 手动打开新的命令行窗口
3. 运行：`ngrok http 8080`
4. 等待几秒，应该会显示URL

---

### 情况3：找不到 ngrok 窗口

**解决方法：**
1. 查看任务栏，找到命令行窗口
2. 或者按 `Alt + Tab` 查看所有窗口
3. 如果找不到，重新运行 `方案2-一键启动.bat`

---

## 🎯 快速检查清单

- [ ] 找到了 ngrok 窗口（标题：ngrok-8080）
- [ ] 看到了 "Session Status: online"
- [ ] 找到了 "Forwarding" 行
- [ ] 复制了 `https://xxxxx.ngrok-free.app` 格式的URL
- [ ] 电脑已连接VPN
- [ ] 在手机浏览器输入URL
- [ ] 如果看到警告页面，点击 "Visit Site"

---

## 💡 提示

1. **URL会变化**：每次重启 ngrok，URL都会不同
2. **保持窗口打开**：关闭 ngrok 窗口后，URL就失效了
3. **使用 Web Interface**：访问 `http://127.0.0.1:4040` 可以看到更详细的信息
4. **HTTPS优先**：优先使用 `https://` 开头的URL

---

## 📞 如果还是找不到

请告诉我：
1. ngrok 窗口显示了什么内容？（截图或复制文字）
2. 是否看到 "Session Status: online"？
3. 是否看到 "Forwarding" 行？

我可以帮你进一步排查！
