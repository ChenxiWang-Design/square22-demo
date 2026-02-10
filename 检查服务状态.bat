@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo 检查服务运行状态
echo ========================================
echo.

echo [检查1] 主服务器（端口8080）...
netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo [✓] 主服务器正在运行
    netstat -ano | findstr :8080
) else (
    echo [✗] 主服务器未运行
    echo 需要运行：cd %~dp0 && node server.js
)
echo.

echo [检查2] API代理（端口3000）...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo [✓] API代理正在运行
    netstat -ano | findstr :3000
) else (
    echo [✗] API代理未运行
    echo 需要运行：cd %~dp0Register2 && node server.js
)
echo.

echo [检查3] ngrok（端口4040 - Web界面）...
netstat -ano | findstr :4040 >nul
if %errorlevel% equ 0 (
    echo [✓] ngrok Web界面正在运行
    echo 可以访问：http://127.0.0.1:4040
    netstat -ano | findstr :4040
) else (
    echo [✗] ngrok未运行或Web界面未启动
    echo 需要运行：ngrok http 8080
)
echo.

echo ========================================
echo 如果ngrok未运行，请：
echo ========================================
echo 1. 打开新的命令行窗口
echo 2. 运行：ngrok http 8080
echo 3. 窗口会显示URL，类似：https://xxxxx.ngrok-free.app
echo.
pause
