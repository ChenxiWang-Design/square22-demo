# ngrok 安装详细步骤

## 🎯 方法1：使用 npm 安装（最简单，推荐）

### 步骤1：打开命令行
- 按 `Win + R`
- 输入 `cmd` 或 `powershell`
- 按回车

### 步骤2：执行安装命令
```bash
npm install -g ngrok
```

### 步骤3：验证安装
```bash
ngrok version
```
如果显示版本号（例如：`ngrok version 3.x.x`），说明安装成功！

### ✅ 完成！
现在可以直接使用 `ngrok http 8080` 命令了。

---

## 🎯 方法2：手动下载安装（如果npm安装失败）

### 步骤1：注册 ngrok 账号

1. **访问注册页面**
   - 打开浏览器，访问：https://dashboard.ngrok.com/signup
   - 或访问：https://ngrok.com/，点击右上角"Sign up"

2. **填写注册信息**
   - 邮箱：输入你的邮箱地址
   - 密码：设置密码
   - 点击"Sign up"

3. **验证邮箱**（如果需要）
   - 检查邮箱，点击验证链接

### 步骤2：获取 authtoken

1. **登录账号**
   - 访问：https://dashboard.ngrok.com/login
   - 输入邮箱和密码登录

2. **获取 authtoken**
   - 登录后，访问：https://dashboard.ngrok.com/get-started/your-authtoken
   - 或点击左侧菜单"Getting Started" → "Your Authtoken"
   - **复制显示的 authtoken**（类似：`2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`）
   - ⚠️ **重要：保存好这个token，后面要用**

### 步骤3：下载 ngrok

1. **访问下载页面**
   - 访问：https://ngrok.com/download
   - 或访问：https://dashboard.ngrok.com/get-started/setup

2. **选择Windows版本**
   - 找到"Windows"部分
   - 点击"Download for Windows"或"Download ngrok for Windows"

3. **解压文件**
   - 下载后是一个zip文件（例如：`ngrok-v3-stable-windows-amd64.zip`）
   - 解压到任意目录，例如：
     - `C:\ngrok\` （推荐）
     - `D:\tools\ngrok\`
     - `C:\Users\你的用户名\ngrok\`

### 步骤4：配置 authtoken

1. **打开命令行**
   - 按 `Win + R`，输入 `cmd`，回车

2. **进入ngrok目录**
   ```bash
   cd C:\ngrok
   ```
   （如果解压到其他目录，改成对应路径）

3. **配置authtoken**
   ```bash
   ngrok config add-authtoken 你的authtoken
   ```
   将"你的authtoken"替换为步骤2中复制的token

4. **验证配置**
   ```bash
   ngrok version
   ```
   如果显示版本号，说明配置成功！

### 步骤5：添加到系统PATH（可选，但推荐）

**为什么要添加PATH？**
- 添加后，可以在任意目录直接使用 `ngrok` 命令
- 不需要每次都 `cd C:\ngrok`

**如何添加PATH？**

#### Windows 10/11 方法：

1. **打开环境变量设置**
   - 右键"此电脑"（或"我的电脑"）
   - 点击"属性"
   - 点击"高级系统设置"
   - 点击"环境变量"按钮

2. **编辑系统PATH**
   - 在"系统变量"区域，找到 `Path`
   - 选中 `Path`，点击"编辑"
   - 点击"新建"
   - 输入ngrok所在目录（例如：`C:\ngrok`）
   - 点击"确定"保存所有窗口

3. **验证PATH**
   - 关闭所有命令行窗口
   - 重新打开命令行
   - 输入：`ngrok version`
   - 如果显示版本号，说明PATH配置成功！

---

## ✅ 验证安装

无论使用哪种方法，最后都要验证：

```bash
ngrok version
```

如果显示版本号，说明安装成功！

---

## 🚀 测试使用

安装成功后，可以测试：

```bash
ngrok http 8080
```

如果看到类似以下输出，说明正常：
```
Session Status                online
Account                       your-email@example.com
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:8080
```

---

## ❓ 常见问题

### Q: npm install -g ngrok 失败？
**A:** 尝试：
1. 使用管理员权限运行命令行
2. 检查npm是否正常：`npm --version`
3. 使用方法2手动下载

### Q: ngrok命令找不到？
**A:** 
1. 如果使用方法2，确保已添加到PATH
2. 或者每次使用时先 `cd C:\ngrok`（你的ngrok目录）

### Q: authtoken在哪里找？
**A:** 
- 登录 https://dashboard.ngrok.com
- 访问：https://dashboard.ngrok.com/get-started/your-authtoken

### Q: ngrok显示"Visit Site"？
**A:** 
- 这是免费版的正常限制
- 点击"Visit Site"按钮即可访问
- 或者注册付费版去除限制

---

## 📝 下一步

安装完成后，运行 `方案2-一键启动.bat` 或按照 `方案2-详细步骤说明.md` 操作。
