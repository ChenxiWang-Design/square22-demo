@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动主界面预览服务器（8080）...
node server.js
pause
