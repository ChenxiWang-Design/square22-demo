# ngrok 配置 authtoken - 快速指南

## ❌ 当前问题

你的ngrok显示错误：
```
ERROR: authentication failed: Usage of ngrok requires a verified account and authtoken.
```

**原因：** ngrok需要先配置authtoken才能使用。

---

## ✅ 解决方法（3步，5分钟）

### 步骤1：注册/登录 ngrok 账号

1. **打开浏览器，访问：**
   - https://dashboard.ngrok.com/signup
   - 或 https://dashboard.ngrok.com/login（如果已有账号）

2. **注册账号（免费）**
   - 输入邮箱和密码
   - 验证邮箱（如果需要）

### 步骤2：获取 authtoken

1. **登录后，访问：**
   - https://dashboard.ngrok.com/get-started/your-authtoken

2. **复制显示的authtoken**
   - 类似：`2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`
   - 这是一串很长的字符

### 步骤3：配置 authtoken

**方法A：使用脚本（推荐）**
1. 双击运行：`配置ngrok-authtoken.bat`
2. 粘贴你的authtoken
3. 按回车

**方法B：手动配置**
1. 打开命令行
2. 运行：
   ```bash
   ngrok config add-authtoken 你的authtoken
   ```
   把"你的authtoken"替换为步骤2复制的token

---

## 🚀 配置完成后

1. **运行：**
   ```bash
   ngrok http 8080
   ```

2. **会显示：**
   ```
   Session Status                online
   Forwarding                    https://xxxxx.ngrok-free.app -> http://localhost:8080
   ```

3. **复制URL，在手机浏览器访问**

---

## 📝 完整流程

```
1. 注册/登录 ngrok → https://dashboard.ngrok.com/signup
2. 获取 authtoken → https://dashboard.ngrok.com/get-started/your-authtoken
3. 运行：配置ngrok-authtoken.bat（或手动配置）
4. 运行：ngrok http 8080
5. 复制URL，手机访问
```

---

## ⚠️ 注意事项

- authtoken只需要配置一次，以后就不用再配置了
- 如果换了电脑，需要重新配置
- authtoken是私密的，不要分享给别人
