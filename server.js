/**
 * 主界面预览服务器（端口 8080）
 * 根路径 / 显示主界面 index.html，/B1chat/ 仍可访问 B1chat
 *
 * 使用：在项目根目录执行 node server.js，然后浏览器打开 http://localhost:8080
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;
const rootDir = __dirname;

app.use(express.static(rootDir));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 根路径返回主界面
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).send('服务器内部错误: ' + err.message);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('主界面预览服务器已启动');
  console.log('主界面: http://localhost:' + PORT);
  console.log('B1chat: http://localhost:' + PORT + '/B1chat/index.html');
  console.log('========================================');
  console.log('按 Ctrl+C 停止');
});
