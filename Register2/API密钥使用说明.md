# API 密钥使用说明

## 📋 概述

为了安全起见，代码中不再包含硬编码的 API 密钥。您需要自行配置 API 密钥才能使用相关功能。

## 🔑 获取 API 密钥

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 登录您的账户
3. 进入 API Keys 页面
4. 创建新的 API 密钥（格式：`sk-ant-api03-...`）
5. 复制密钥（**注意：密钥只显示一次，请妥善保存**）

## ⚙️ 配置方法

### 方法1：使用配置脚本（推荐）

运行 `配置API密钥.bat` 脚本，按照提示选择配置方式：

```batch
配置API密钥.bat
```

脚本提供三种配置方式：
- **系统环境变量**：所有用户可用（需要管理员权限）
- **用户环境变量**：仅当前用户可用
- **创建 .env 文件**：项目级别配置

### 方法2：手动设置环境变量

#### Windows PowerShell:
```powershell
# 设置用户环境变量（永久）
[System.Environment]::SetEnvironmentVariable('CLAUDE_API_KEY', '你的API密钥', 'User')

# 设置当前会话（临时）
$env:CLAUDE_API_KEY = '你的API密钥'
```

#### Windows CMD:
```batch
# 设置用户环境变量（永久）
setx CLAUDE_API_KEY "你的API密钥"

# 设置当前会话（临时）
set CLAUDE_API_KEY=你的API密钥
```

**注意**：使用 `setx` 设置后，需要重新打开命令行窗口才能生效。

### 方法3：使用 .env 文件

1. 复制 `.env.example` 为 `.env`：
   ```batch
   copy .env.example .env
   ```

2. 编辑 `.env` 文件，填入您的 API 密钥：
   ```
   CLAUDE_API_KEY=你的API密钥
   ```

3. 安装 dotenv 包（如果尚未安装）：
   ```batch
   npm install dotenv
   ```

4. 修改 `server.js`，在文件开头添加：
   ```javascript
   require('dotenv').config();
   ```

5. 确保 `.env` 文件在 `.gitignore` 中（不会被提交到 Git）

## 🚀 启动服务器

配置完成后，使用以下方式启动服务器：

### 方式1：使用批处理文件
```batch
启动服务器.bat
```

或

```batch
结束3000端口并启动服务器.bat
```

### 方式2：直接运行 Node.js
```batch
node server.js
```

## ✅ 验证配置

启动服务器后，查看控制台输出：

- ✅ **成功**：显示 `API 密钥: 使用环境变量 CLAUDE_API_KEY`
- ❌ **失败**：显示错误信息 `错误: 未设置 CLAUDE_API_KEY 环境变量`

## 🔒 安全建议

1. **永远不要**将 API 密钥提交到 Git 仓库
2. **永远不要**在公开场合分享您的 API 密钥
3. 如果密钥泄露，立即在 Anthropic Console 中撤销并创建新密钥
4. 定期轮换 API 密钥
5. 使用环境变量或 `.env` 文件，而不是硬编码在代码中

## 🆘 常见问题

### Q: 设置环境变量后仍然提示未设置？
A: 使用 `setx` 设置后，需要**重新打开命令行窗口**才能生效。

### Q: 如何查看当前设置的环境变量？
A: 运行 `配置API密钥.bat`，选择选项 4，或使用命令：
```batch
echo %CLAUDE_API_KEY%
```

### Q: 可以使用多个 API 密钥吗？
A: 当前配置只支持一个 API 密钥。如果需要切换，可以：
- 修改环境变量
- 修改 `.env` 文件
- 使用不同的批处理文件设置不同的密钥

### Q: 服务器启动失败，提示 API 密钥错误？
A: 
1. 检查环境变量是否正确设置：`echo %CLAUDE_API_KEY%`
2. 检查 API 密钥格式是否正确（应以 `sk-ant-api03-` 开头）
3. 确认 API 密钥未过期或被撤销
4. 检查网络连接和代理设置

## 📝 示例

### 完整配置流程示例：

```batch
# 1. 设置环境变量
setx CLAUDE_API_KEY "sk-ant-api03-你的密钥"

# 2. 重新打开命令行窗口

# 3. 验证设置
echo %CLAUDE_API_KEY%

# 4. 启动服务器
cd Register2
启动服务器.bat
```

---

**需要帮助？** 查看项目根目录的 `一键推送GitHub.bat` 或相关文档。
