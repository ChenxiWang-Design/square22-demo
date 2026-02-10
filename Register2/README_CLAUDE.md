# Claude API 代理服务器设置指南

## 问题说明
由于浏览器的CORS（跨域资源共享）安全策略，无法直接从浏览器调用Claude API。需要通过代理服务器来解决这个问题。

## 解决方案

### 方法1：使用本地代理服务器（推荐）

1. **安装依赖**
   ```bash
   cd Register2
   npm install
   ```

2. **启动代理服务器**
   ```bash
   npm start
   ```
   服务器将在 `http://localhost:3000` 运行

3. **在浏览器中打开应用**
   - 确保代理服务器正在运行
   - 打开 `Register2/index.html` 或通过本地服务器访问

### 方法2：使用公共CORS代理（不推荐，仅用于测试）

如果不想运行本地服务器，可以修改 `register2.js` 中的 `PROXY_URL`：

```javascript
// 使用公共CORS代理（不稳定，仅用于测试）
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/https://api.anthropic.com/v1/messages';
```

**注意**：公共代理服务可能不稳定，生产环境请使用自己的服务器。

## 安全提示

⚠️ **重要**：`server.js` 中包含API密钥，请勿将其提交到公共代码仓库。

生产环境建议：
1. 使用环境变量存储API密钥
2. 添加身份验证
3. 限制请求频率
4. 使用HTTPS

## 故障排除

如果遇到问题：
1. 确保代理服务器正在运行（检查终端输出）
2. 检查浏览器控制台是否有错误信息
3. 确认端口3000未被占用
4. 检查防火墙设置
