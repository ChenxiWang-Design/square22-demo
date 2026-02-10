@echo off
REM 快速启动服务器（无暂停，后台运行）
cd /d %~dp0
if exist node_modules (
    start "Claude API 服务器" cmd /k "npm start"
    echo 服务器正在启动中...
    timeout /t 2 /nobreak >nul
    echo 服务器已启动！可以在浏览器中访问 http://localhost:3000/Register2/index.html
) else (
    echo 错误：未找到 node_modules 文件夹
    echo 请先运行: npm install
    pause
)
