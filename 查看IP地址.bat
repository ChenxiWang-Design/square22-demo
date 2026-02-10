@echo off
chcp 65001 >nul
echo ========================================
echo 本机IP地址查询
echo ========================================
echo.
echo 正在获取IP地址...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
    echo IPv4 地址: !IP!
    echo.
    echo ========================================
    echo 手机访问地址
    echo ========================================
    echo http://!IP!:8080
    echo.
    echo 使用说明:
    echo 1. 确保手机和电脑在同一WiFi（或电脑连接手机热点）
    echo 2. 在手机浏览器输入上面的地址
    echo 3. 浏览器会提示"添加到主屏幕"
    echo.
)

pause
