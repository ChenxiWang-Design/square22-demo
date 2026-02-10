@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo 重新启动 ngrok 并显示 URL
echo ========================================
echo.

REM 检查ngrok是否已安装
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到ngrok
    echo 请先安装：npm install -g ngrok
    pause
    exit /b 1
)

REM 检查是否配置了authtoken（尝试运行ngrok version，如果未配置会报错）
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ========================================
    echo [重要] ngrok未配置authtoken
    echo ========================================
    echo.
    echo 需要先配置authtoken才能使用ngrok
    echo.
    echo 快速配置：
    echo   1. 双击运行：配置ngrok-authtoken.bat
    echo   2. 或查看：快速配置ngrok.md
    echo.
    echo 配置完成后，再运行此脚本
    echo.
    pause
    exit /b 1
)

echo 正在启动ngrok...
echo.
echo ========================================
echo 重要提示：
echo ========================================
echo 1. 将打开一个新窗口
echo 2. 等待几秒钟，ngrok会显示URL
echo 3. 找到 "Forwarding" 这一行
echo 4. 复制 https://xxxxx.ngrok-free.app 这个URL
echo 5. 在手机浏览器访问这个URL
echo.
echo ========================================
echo.
pause

start "ngrok-URL显示" cmd /k "title ngrok - 查看这里的URL && color 0A && echo. && echo ======================================== && echo   ngrok 正在启动... && echo ======================================== && echo. && echo [重要] 等待几秒后，下面会显示URL && echo. && echo 找到这一行： && echo   Forwarding    https://xxxxx.ngrok-free.app -^> http://localhost:8080 && echo. && echo 复制 https://xxxxx.ngrok-free.app 这个URL && echo 在手机浏览器访问 && echo. && echo ======================================== && echo. && ngrok http 8080 && pause"

echo.
echo ========================================
echo 已打开ngrok窗口
echo ========================================
echo.
echo 请查看新打开的窗口，等待URL显示
echo.
pause
