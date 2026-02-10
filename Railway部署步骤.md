# 🚀 Railway 部署步骤（API服务器）

## 当前步骤：选择 GitHub Repository

✅ **你已经选择了 "GitHub Repository"**

---

## 下一步操作：

### 1️⃣ 选择仓库
- Railway 会显示你的 GitHub 仓库列表
- **选择：`ChenxiWang-Design/square22-demo`**
- 点击仓库名称

### 2️⃣ Railway 自动检测配置
Railway 会自动读取 `railway.json`，配置如下：
- ✅ Root Directory: `Register2`（自动检测）
- ✅ Start Command: `cd Register2 && node server.js`（自动检测）
- ✅ Build: NIXPACKS（自动检测）

### 3️⃣ 设置环境变量（重要！）
在 Railway 项目页面：

1. 点击项目名称进入项目
2. 点击 **"Variables"** 标签
3. 点击 **"New Variable"**
4. 添加：
   - **Key**: `CLAUDE_API_KEY`
   - **Value**: 你的API密钥（`sk-ant-api03-...`）
5. 点击 **"Add"**

**⚠️ 重要**：没有这个环境变量，API服务器无法工作！

### 4️⃣ 等待部署完成
- Railway 会自动开始构建和部署
- 等待 2-3 分钟
- 查看日志确认部署成功

### 5️⃣ 获取 API 地址
部署完成后：

1. 在项目页面，点击 **"Settings"**
2. 找到 **"Generate Domain"** 或 **"Domains"**
3. 点击生成域名
4. 会显示类似：`https://xxx.up.railway.app`
5. **复制这个地址**（这就是你的API服务器地址）

### 6️⃣ 更新前端配置
部署完成后，需要更新 `api-config.js`：

1. 打开 `api-config.js`
2. 找到第20行：
   ```javascript
   return 'https://your-api.up.railway.app'; // TODO: 替换为你的Railway地址
   ```
3. 替换为你的实际Railway地址：
   ```javascript
   return 'https://xxx.up.railway.app'; // 你的实际Railway地址
   ```
4. 提交并推送到GitHub：
   ```batch
   git add api-config.js
   git commit -m "更新API地址为Railway部署地址"
   git push
   ```

---

## ✅ 验证部署

部署完成后，测试API：

1. 在浏览器访问：`https://你的Railway地址/api/claude`
2. 应该看到错误信息（这是正常的，因为需要POST请求）
3. 如果能看到响应，说明部署成功 ✅

---

## 🎯 完成后

✅ API服务器已部署到Railway  
⬜ 更新 `api-config.js` 中的API地址  
⬜ 部署前端到Vercel  
⬜ 手机访问Vercel地址  

---

## ❓ 遇到问题？

**问题1：部署失败**
- 检查日志：项目页面 → "Deployments" → 点击失败的部署 → 查看日志
- 确认环境变量 `CLAUDE_API_KEY` 已设置

**问题2：API返回403**
- 确认环境变量中的API密钥正确
- 检查API密钥是否有效

**问题3：找不到域名**
- 在 Settings → Domains 中生成域名
- 或使用 Railway 提供的默认域名
