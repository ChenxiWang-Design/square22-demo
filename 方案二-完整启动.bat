@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo 方案二：完整启动（主服务器 + API代理 + ngrok）
echo ========================================
echo.
echo 此脚本将启动三个服务：
echo   1. 主服务器（端口8080）
echo   2. API代理（端口3000）
echo   3. ngrok（生成公网URL）
echo.
echo ========================================
echo.

REM 检查Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查ngrok
where ngrok >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到ngrok
    echo.
    echo 安装方法:
    echo   1. 运行: npm install -g ngrok
    echo   2. 或访问: https://ngrok.com/download
    echo.
    echo 配置方法:
    echo   1. 访问 https://dashboard.ngrok.com/signup 注册账号
    echo   2. 获取authtoken
    echo   3. 运行: ngrok config add-authtoken 你的authtoken
    echo.
    pause
    exit /b 1
)

echo 准备启动服务...
echo.
echo 注意: 将打开三个命令行窗口
echo   - 窗口1: 主服务器（8080端口）
echo   - 窗口2: API代理（3000端口）
echo   - 窗口3: ngrok（公网URL）
echo.
echo 请等待所有窗口打开后，查看ngrok窗口中的URL
echo.
pause

REM 启动主服务器（新窗口）
start "主服务器-8080" cmd /k "cd /d %CD% && node server.js"

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 启动API代理（新窗口）
start "API代理-3000" cmd /k "cd /d %CD%\Register2 && node server.js"

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 启动ngrok（新窗口）
start "ngrok-公网URL" cmd /k "ngrok http 8080"

echo.
echo ========================================
echo 所有服务已启动
echo ========================================
echo.
echo 请查看ngrok窗口，复制显示的 https://xxxx.ngrok-free.app URL
echo 在手机浏览器访问这个URL即可
echo.
echo 关闭服务: 关闭对应的命令行窗口即可
echo.
pause
