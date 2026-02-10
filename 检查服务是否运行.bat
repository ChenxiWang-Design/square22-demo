@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo 检查服务运行状态
echo ========================================
echo.

echo [检查1] 主服务器（端口8080）...
netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo [OK] 主服务器正在运行
    netstat -ano | findstr :8080
) else (
    echo [X] 主服务器未运行！
    echo 需要启动：cd %~dp0 && node server.js
)
echo.

echo [检查2] API代理（端口3000）...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo [OK] API代理正在运行
    netstat -ano | findstr :3000
) else (
    echo [X] API代理未运行！
    echo 需要启动：cd %~dp0Register2 && node server.js
)
echo.

echo [检查3] localtunnel进程...
tasklist | findstr /i "lt.exe node.exe" >nul
if %errorlevel% equ 0 (
    echo [OK] localtunnel相关进程在运行
    tasklist | findstr /i "lt.exe node.exe"
) else (
    echo [X] 未找到localtunnel进程！
    echo 需要启动：lt --port 8080
)
echo.

echo ========================================
echo 诊断结果
echo ========================================
echo.
echo 如果看到 [X]，说明对应服务未运行
echo 需要手动启动对应的服务
echo.
pause
