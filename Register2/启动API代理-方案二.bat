@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo 方案二：启动API代理服务器（端口3000）
echo ========================================
echo.
echo 位置: %CD%
echo 文件: server.js
echo 端口: 3000
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

echo 正在启动API代理服务器...
echo.
echo 提示: 
echo   - 关闭此窗口会停止服务器
echo   - 按 Ctrl+C 也可以停止服务器
echo   - 确保电脑已连接VPN（用于访问Claude API）
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
