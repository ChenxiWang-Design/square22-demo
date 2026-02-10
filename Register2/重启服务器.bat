@echo off
echo 正在重启Claude API代理服务器...
echo.
echo 请确保之前的服务器已停止（按Ctrl+C）
echo.
pause
cd /d %~dp0
echo 正在启动服务器...
node server.js
pause
