@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo 方案二：启动主服务器（端口8080）
echo ========================================
echo.
echo 位置: %CD%
echo 文件: server.js
echo 端口: 8080
echo.
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 正在启动主服务器...
echo.
echo 提示: 
echo   - 关闭此窗口会停止服务器
echo   - 按 Ctrl+C 也可以停止服务器
echo   - 服务器启动后，继续启动API代理和ngrok
echo.
echo ========================================
echo.

node server.js

if errorlevel 1 (
    echo.
    echo [错误] 服务器启动失败
    echo 错误代码: %errorlevel%
    echo.
    pause
)
