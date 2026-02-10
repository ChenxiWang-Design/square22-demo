/**
 * B1chat 预览服务器
 * 简单的静态文件服务器，用于预览 B1chat 页面
 * 
 * 使用方法：
 * 1. 安装依赖: npm install express
 * 2. 运行服务器: node preview-server.js
 * 3. 访问 http://localhost:8080/B1chat/index.html
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// 设置静态文件目录为项目根目录
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));

// 添加请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 处理根路径
app.get('/', (req, res) => {
  res.redirect('/B1chat/index.html');
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).send('服务器内部错误: ' + err.message);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(`B1chat 预览服务器已启动！`);
  console.log(`服务器运行在: http://localhost:${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}/B1chat/index.html`);
  console.log(`项目根目录: ${rootDir}`);
  console.log(`========================================`);
  console.log(`按 Ctrl+C 停止服务器`);
});
