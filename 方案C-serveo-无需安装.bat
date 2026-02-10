@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo 方案C：serveo（无需安装，直接用）
echo ========================================
echo.

REM 检查SSH是否可用（Win10自带）
where ssh >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到SSH客户端
    echo Windows 10应该自带SSH，如果没有请安装OpenSSH
    pause
    exit /b 1
)

echo [提示] serveo 不需要安装任何东西
echo 使用Windows自带的SSH即可
echo.
echo ========================================
echo 重要：确保主服务器正在运行
echo ========================================
echo.
echo 如果主服务器未运行，先启动：
echo   cd %~dp0
echo   node server.js
echo.
pause

echo.
echo ========================================
echo 启动 serveo 隧道
echo ========================================
echo.
echo 将打开新窗口，等待连接建立...
echo serveo会显示一个URL，复制后在手机访问
echo.
pause

start "serveo-URL" cmd /k "echo ======================================== && echo serveo 正在连接... && echo ======================================== && echo. && echo 等待几秒，会显示URL && echo 找到类似这样的行： && echo   Forwarding HTTP traffic from https://xxxxx.serveo.net && echo. && echo 复制 https://xxxxx.serveo.net 这个URL && echo 在手机浏览器访问 && echo. && echo ======================================== && echo. && ssh -R 80:localhost:8080 serveo.net && pause"

echo.
echo ========================================
echo 已启动 serveo
echo ========================================
echo.
echo 查看新窗口，等待URL显示
echo 如果连接成功，会显示类似：
echo   Forwarding HTTP traffic from https://xxxxx.serveo.net
echo.
echo 复制URL，在手机访问即可
echo.
pause
