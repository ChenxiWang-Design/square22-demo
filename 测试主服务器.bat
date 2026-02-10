@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo 测试主服务器是否运行
echo ========================================
echo.

echo 检查端口8080是否被占用...
netstat -ano | findstr :8080

if %errorlevel% equ 0 (
    echo.
    echo [OK] 端口8080正在使用，说明主服务器可能正在运行
    echo.
    echo 请在浏览器打开测试：
    echo http://localhost:8080
    echo.
    echo 如果能打开，说明主服务器正常
    echo 如果打不开，说明主服务器有问题
) else (
    echo.
    echo [X] 端口8080未被占用，主服务器未运行！
    echo.
    echo 需要启动主服务器：
    echo cd %~dp0
    echo node server.js
)

echo.
pause
