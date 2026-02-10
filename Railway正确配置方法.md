# Railway 正确配置方法

## ⚠️ 问题原因

错误信息：`Failed to read Nixpacks config file 'Register2'` - `Is a directory`

**原因**：`railway.json` 中的 `nixpacksConfigPath` 设置错误，指向了目录而不是配置文件。

---

## ✅ 解决方案

### 方法1：在Railway网站设置Root Directory（推荐）

1. **在Railway网站设置**：
   - 进入你的项目
   - 点击 **Settings**（项目设置，不是Service设置）
   - 找到 **Root Directory**
   - 设置为：`Register2`
   - 保存

2. **删除或修改 railway.json**：
   - 我已经修复了 `railway.json`，移除了错误的 `nixpacksConfigPath`
   - Railway会自动检测 `Register2/Dockerfile` 或 `Register2/nixpacks.toml`

3. **提交并推送**：
   ```bash
   git add railway.json
   git commit -m "修复railway.json配置"
   git push
   ```

### 方法2：使用Dockerfile（已创建）

`Register2/Dockerfile` 已创建，Railway会自动检测并使用它。

**如果Railway检测到Dockerfile，会优先使用Dockerfile而不是nixpacks。**

---

## 📋 Railway配置检查清单

### ✅ 在Railway网站设置：

1. **项目Settings → Root Directory**：
   - 设置为：`Register2`
   - 这告诉Railway在哪个目录构建

2. **Service → Variables**：
   - 添加：`CLAUDE_API_KEY = 你的密钥`

### ✅ 代码配置（已修复）：

1. ✅ `railway.json` - 已修复，移除了错误的配置
2. ✅ `Register2/Dockerfile` - 已创建
3. ✅ `Register2/nixpacks.toml` - 已创建（备用）

---

## 🔄 重新部署步骤

1. **提交修复后的代码**：
   ```bash
   git add railway.json
   git commit -m "修复railway.json配置"
   git push
   ```

2. **在Railway网站**：
   - 确认 Root Directory 设置为 `Register2`
   - 确认环境变量 `CLAUDE_API_KEY` 已设置
   - Railway会自动重新部署

3. **如果还是失败**：
   - 点击 "View logs" 查看详细错误
   - 或者尝试删除 `railway.json`，让Railway完全自动检测

---

## 💡 关键点

- **Root Directory** = 告诉Railway在哪个目录构建（在网站设置）
- **Dockerfile** = Railway会自动检测并使用（如果存在）
- **nixpacks.toml** = 备用配置（如果Dockerfile不存在）
- **railway.json** = 项目级配置（可选）

现在 `railway.json` 已经修复，请：
1. 确认Railway网站的Root Directory设置为 `Register2`
2. 提交并推送修复后的代码
3. Railway会自动重新部署
