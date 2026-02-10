@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo 正在启动PWA服务器...
echo ========================================
echo.

REM 检查Node.js是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 获取本机IP地址
echo 正在获取本机IP地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
    echo.
    echo ========================================
    echo 服务器启动信息
    echo ========================================
    echo 本机IP地址: !IP!
    echo.
    echo 主界面服务器: http://!IP!:8080
    echo 本地访问: http://localhost:8080
    echo.
    echo 手机访问步骤:
    echo 1. 确保手机和电脑在同一WiFi（或电脑连接手机热点）
    echo 2. 在手机浏览器访问: http://!IP!:8080
    echo 3. 浏览器会提示"添加到主屏幕"，点击添加即可
    echo.
    echo ========================================
    echo 按 Ctrl+C 停止服务器
    echo ========================================
    echo.
    goto :start_server
)

:start_server
REM 启动主界面服务器
start "主界面服务器(8080)" cmd /k "node server.js"

REM 询问是否启动API代理服务器
echo.
echo 是否需要启动API代理服务器（Register2功能需要）？
echo 输入 Y 启动，其他键跳过...
set /p start_api="请选择 (Y/N): "
if /i "%start_api%"=="Y" (
    echo.
    echo 正在启动API代理服务器（3000端口）...
    start "API代理服务器(3000)" cmd /k "cd Register2 && node server.js"
    echo API代理服务器已启动: http://!IP!:3000
    echo.
)

echo.
echo 服务器已启动！
echo 关闭此窗口不会停止服务器，请关闭对应的服务器窗口来停止。
echo.
pause
