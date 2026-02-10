@echo off
chcp 65001 >nul 2>&1

echo ========================================
echo 方案二：启动ngrok（生成公网URL）
echo ========================================
echo.
echo 作用: 将本地8080端口映射到公网URL
echo 端口: 8080
echo.
echo ========================================
echo.

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

echo 正在启动ngrok...
echo.
echo 提示: 
echo   - 关闭此窗口会停止ngrok
echo   - 按 Ctrl+C 也可以停止ngrok
echo   - 复制显示的 https://xxxx.ngrok-free.app URL
echo   - 在手机浏览器访问这个URL
echo.
echo ========================================
echo.

ngrok http 8080

pause
