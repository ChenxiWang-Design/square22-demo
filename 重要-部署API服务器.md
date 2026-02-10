# ⚠️ 重要：必须先部署API服务器！

## 为什么需要？

手机APP **不能访问** `localhost:3000`，必须：
1. 将API代理服务器部署到公网
2. 修改代码中的API地址
3. 然后才能打包APP

---

## 🚀 快速部署API服务器（Railway - 免费）

### 步骤1：注册Railway
1. 访问：https://railway.app
2. 使用GitHub账号登录（免费）

### 步骤2：创建新项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 如果没有GitHub仓库，先创建一个

### 步骤3：配置部署
1. Railway会自动检测到 `Register2/server.js`
2. 设置环境变量（可选）：
   - `CLAUDE_API_KEY=你的密钥`（如果server.js里没有）

### 步骤4：获得API地址
部署完成后，Railway会显示一个URL：
```
https://your-api.up.railway.app
```

你的API地址就是：
```
https://your-api.up.railway.app/api/claude
```

---

## 🔧 修改代码

### 修改 Register2/register2.js

找到这一行（大约715行）：
```javascript
API_URL = 'http://localhost:3000/api/claude';
```

改为：
```javascript
API_URL = 'https://your-api.up.railway.app/api/claude';
```
（替换为你的Railway地址）

---

## ✅ 验证

部署完成后，测试API：
1. 在浏览器访问：`https://your-api.up.railway.app/api/claude`
2. 应该返回404或错误（这是正常的，因为需要POST请求）
3. 如果能看到响应，说明部署成功

---

## 📝 然后才能打包APP

**只有API服务器部署成功后，才能继续Capacitor打包！**

否则APP的AI功能无法使用。
