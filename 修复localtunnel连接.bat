@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo 修复 localtunnel 连接问题
echo ========================================
echo.

echo 步骤1：关闭现有的 localtunnel 窗口
echo 请手动关闭显示 "your url is:" 的那个窗口
echo.
pause

echo 步骤2：等待主服务器完全启动...
timeout /t 3 >nul

echo 步骤3：重新启动 localtunnel
echo.
echo 将打开新窗口，等待连接建立...
echo.
pause

start "localtunnel-重新连接" cmd /k "echo ======================================== && echo 重新启动 localtunnel && echo ======================================== && echo. && echo 等待连接建立... && echo 如果看到 'your url is:' 说明连接成功 && echo 如果看到错误信息，告诉我具体错误 && echo. && echo ======================================== && echo. && lt --port 8080 && pause"

echo.
echo ========================================
echo 已重新启动 localtunnel
echo ========================================
echo.
echo 请查看新窗口：
echo 1. 如果显示 "your url is: https://xxxxx.loca.lt"
echo    复制新URL，在手机访问
echo.
echo 2. 如果显示错误信息，告诉我具体错误
echo.
pause
