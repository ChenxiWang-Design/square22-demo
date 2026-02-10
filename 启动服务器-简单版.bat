@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动服务器...
node server.js
pause
