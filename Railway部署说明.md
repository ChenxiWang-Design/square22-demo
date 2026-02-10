# Railway 部署说明

## ⚠️ 重要：Railway 配置

Railway 需要在 **Railway 网站设置** 中指定正确的根目录：

### 步骤1：在 Railway 网站设置 Root Directory

1. 进入你的 Railway 项目
2. 点击 **Settings**（设置）
3. 找到 **Root Directory** 选项
4. 设置为：`Register2`
5. 保存设置

### 步骤2：设置环境变量

在 Railway 的 **Variables**（环境变量）中添加：

```
CLAUDE_API_KEY=你的API密钥
```

### 步骤3：重新部署

保存设置后，Railway 会自动重新部署。

---

## 🔧 如果仍然失败

如果 Railway 仍然在根目录构建，可以：

### 方案A：使用 Dockerfile（已创建）

`Register2/Dockerfile` 已创建，Railway 会自动检测并使用它。

### 方案B：更新根目录 package-lock.json

如果 Railway 坚持使用根目录，运行：

```batch
cd c:\Users\24251\.cursor\Square22
npm install
git add package-lock.json
git commit -m "更新package-lock.json"
git push
```

---

## ✅ 验证部署

部署成功后，Railway 会显示一个 URL，类似：
```
https://your-app.up.railway.app
```

你的 API 地址是：
```
https://your-app.up.railway.app/api/claude
```
