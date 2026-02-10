@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo 网络连接诊断工具
echo ========================================
echo.

echo [1] 检查服务器是否运行...
netstat -ano | findstr ":8080" >nul
if %errorlevel% equ 0 (
    echo ✓ 端口8080已被占用（服务器可能正在运行）
    netstat -ano | findstr ":8080"
) else (
    echo ✗ 端口8080未被占用（服务器未启动）
    echo   请先运行: node server.js
)
echo.

echo [2] 获取正确的局域网IP地址...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4" /c:"IPv4 地址"') do (
    set IP=%%a
    set IP=!IP: =!
    echo 检测到IP: !IP!
    
    REM 排除虚拟网卡IP（Clash、VPN等）
    echo !IP! | findstr /i "198.18 26.26 10.0 192.168 172.16 172.17 172.18 172.19 172.20 172.21 172.22 172.23 172.24 172.25 172.26 172.27 172.28 172.29 172.30 172.31" >nul
    if !errorlevel! equ 0 (
        REM 检查是否是常见的局域网IP段
        echo !IP! | findstr /r "^192\.168\." >nul
        if !errorlevel! equ 0 (
            echo   → 推荐使用此IP（192.168.x.x是常见局域网IP）
            set RECOMMENDED_IP=!IP!
        )
        echo !IP! | findstr /r "^172\.\(1[6-9]\|2[0-9]\|3[01]\)\." >nul
        if !errorlevel! equ 0 (
            echo   → 推荐使用此IP（172.16-31.x.x是常见局域网IP）
            set RECOMMENDED_IP=!IP!
        )
        echo !IP! | findstr /r "^10\." >nul
        if !errorlevel! equ 0 (
            echo   → 推荐使用此IP（10.x.x.x是常见局域网IP）
            set RECOMMENDED_IP=!IP!
        )
    )
)
echo.

echo [3] 推荐使用的IP地址:
if defined RECOMMENDED_IP (
    echo   http://%RECOMMENDED_IP%:8080
) else (
    echo   未找到推荐的局域网IP，请检查网络连接
    echo   如果电脑连接手机热点，请查看"无线局域网适配器"的IPv4地址
)
echo.

echo [4] 检查防火墙状态...
netsh advfirewall show allprofiles state | findstr /i "状态" >nul
if %errorlevel% equ 0 (
    echo 防火墙状态:
    netsh advfirewall show allprofiles state | findstr /i "状态"
    echo.
    echo 如果无法访问，可能需要允许Node.js通过防火墙
    echo 或者临时关闭防火墙测试
) else (
    echo 无法检查防火墙状态
)
echo.

echo ========================================
echo 诊断完成
echo ========================================
echo.
echo 下一步操作:
echo 1. 如果服务器未启动，运行: node server.js
echo 2. 在手机浏览器访问推荐的IP地址
echo 3. 确保手机和电脑在同一WiFi（或电脑连接手机热点）
echo.
pause
