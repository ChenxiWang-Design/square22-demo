@echo off
chcp 65001 >nul
cd /d "%~dp0"
setlocal enabledelayedexpansion

echo ========================================
echo PWA服务器启动工具（简化版）
echo ========================================
echo.

REM 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js
    echo 请先安装Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo 正在查找IP地址...
echo.

REM 查找WLAN的IP（最简单的方法）
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"无线局域网适配器 WLAN" /a /c:"IPv4"') do (
    set LINE=%%a
    set LINE=!LINE: =!
    echo !LINE! | findstr /r "^[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*$" >nul
    if !errorlevel! equ 0 (
        echo 找到IP地址: !LINE!
        echo.
        echo ========================================
        echo 手机访问地址: http://!LINE!:8080
        echo ========================================
        echo.
        goto :start_server
    )
)

REM 如果没找到，显示所有IP让用户选择
echo 未自动找到IP，显示所有IPv4地址:
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4" /c:"IPv4 地址"') do (
    set IP=%%a
    set IP=!IP: =!
    echo   - !IP!
)
echo.
echo 请选择正确的IP地址（通常是 172.x.x.x 或 192.168.x.x）
echo 排除 198.18.x.x 和 26.26.x.x（这些是虚拟网卡）
echo.

:start_server
echo ========================================
echo 正在启动服务器...
echo ========================================
echo.
echo 提示: 关闭此窗口会停止服务器
echo       按 Ctrl+C 也可以停止服务器
echo.
echo ========================================
echo.

node server.js

if %errorlevel% neq 0 (
    echo.
    echo [错误] 服务器启动失败
    pause
)
