@echo off
chcp 65001 >nul
echo 正在启动 B1chat 预览服务器...
echo.

cd /d "%~dp0"

if not exist "..\node_modules\express" (
    echo 正在安装依赖...
    cd ..
    call npm install express
    cd B1chat
    echo.
)

echo 启动服务器...
echo 访问地址: http://localhost:8080/B1chat/index.html
echo 按 Ctrl+C 停止服务器
echo.

node preview-server.js

pause
