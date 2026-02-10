@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo PWA服务器启动工具
echo ========================================
echo.

REM 启用变量延迟扩展
setlocal enabledelayedexpansion

REM 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo 正在查找正确的IP地址...
echo.

REM 获取正确的局域网IP（优先WLAN，排除虚拟网卡）
set FOUND_IP=0
set CORRECT_IP=

REM 先查找WLAN的IP（通常是手机热点或WiFi）
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4" /c:"IPv4 地址"') do (
    set IP=%%a
    set IP=!IP: =!
    
    REM 检查是否是常见的局域网IP段
    echo !IP! | findstr /r "^172\.\(1[6-9]\|2[0-9]\|3[01]\)\." >nul
    if !errorlevel! equ 0 (
        if !FOUND_IP! equ 0 (
            set CORRECT_IP=!IP!
            set FOUND_IP=1
            echo 找到IP地址: !IP!
        )
    )
)

REM 如果没找到，尝试192.168.x.x
if !FOUND_IP! equ 0 (
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4" /c:"IPv4 地址"') do (
        set IP=%%a
        set IP=!IP: =!
        echo !IP! | findstr /r "^192\.168\." >nul
        if !errorlevel! equ 0 (
            set CORRECT_IP=!IP!
            set FOUND_IP=1
            echo 找到IP地址: !IP!
            goto :found
        )
    )
)

REM 如果还是没找到，尝试10.x.x.x
if !FOUND_IP! equ 0 (
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4" /c:"IPv4 地址"') do (
        set IP=%%a
        set IP=!IP: =!
        echo !IP! | findstr /r "^10\." >nul
        if !errorlevel! equ 0 (
            REM 排除127.0.0.1
            echo !IP! | findstr /r "^127\." >nul
            if !errorlevel! neq 0 (
                set CORRECT_IP=!IP!
                set FOUND_IP=1
                echo 找到IP地址: !IP!
                goto :found
            )
        )
    )
)

:found
echo.
echo ========================================
echo 服务器信息
echo ========================================
if !FOUND_IP! equ 1 (
    echo 推荐使用的IP地址: !CORRECT_IP!
    echo.
    echo 手机访问地址: http://!CORRECT_IP!:8080
    echo 本地访问地址: http://localhost:8080
    echo.
    echo 提示: 
    echo   1. 确保手机和电脑在同一WiFi（或电脑连接手机热点）
    echo   2. 在手机浏览器访问上面的地址
    echo   3. 浏览器会提示"添加到主屏幕"
) else (
    echo [警告] 未找到推荐的局域网IP
    echo.
    echo 请手动查找IP地址:
    echo   1. 运行: ipconfig
    echo   2. 查找"无线局域网适配器 WLAN"的IPv4地址
    echo   3. 或者查找"以太网适配器"的IPv4地址
    echo   4. 排除 198.18.x.x 和 26.26.x.x（这些是虚拟网卡）
    echo.
    echo 找到IP后，在手机访问: http://你的IP:8080
)
echo.
echo ========================================
echo 正在启动服务器...
echo ========================================
echo.
echo 提示: 
echo   - 关闭此窗口会停止服务器
echo   - 按 Ctrl+C 也可以停止服务器
echo   - 服务器启动后，在手机浏览器访问上面的地址
echo.
echo ========================================
echo.

REM 启动服务器
node server.js

REM 如果node命令失败，暂停以便查看错误
if %errorlevel% neq 0 (
    echo.
    echo [错误] 服务器启动失败
    echo 错误代码: %errorlevel%
    echo.
    pause
)
