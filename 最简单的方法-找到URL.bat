@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo 查找 ngrok URL 的简单方法
echo ========================================
echo.

echo 方法1：直接查看命令行窗口
echo ----------------------------------------
echo 1. 查看你打开的所有黑色命令行窗口
echo 2. 找到显示 "Forwarding" 字样的窗口
echo 3. 复制窗口中的 https://xxxxx.ngrok-free.app
echo.

echo 方法2：重新启动ngrok并显示URL
echo ----------------------------------------
echo 按任意键打开新的ngrok窗口（会显示URL）...
pause >nul

start "ngrok显示URL" cmd /k "echo ======================================== && echo ngrok URL 显示窗口 && echo ======================================== && echo. && echo 下面的 Forwarding 行就是你要的URL： && echo. && ngrok http 8080"

echo.
echo ========================================
echo 已打开新窗口，查看窗口中的URL
echo ========================================
echo.
echo 如果还是看不到，按任意键查看所有命令行窗口...
pause >nul

echo.
echo 正在列出所有命令行窗口...
tasklist /FI "IMAGENAME eq cmd.exe" /FO TABLE
echo.
echo 如果看到多个cmd.exe，说明窗口都在运行
echo 请手动查看每个窗口，找到显示ngrok的那个
echo.
pause
