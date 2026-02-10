@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo 手动启动三个服务
echo ========================================
echo.
echo 将打开三个窗口，每个窗口启动一个服务
echo 请保持所有窗口打开
echo.
pause

echo [1/3] 启动主服务器（端口8080）...
start "主服务器-8080" cmd /k "cd /d %~dp0 && node server.js"

timeout /t 3 >nul

echo [2/3] 启动API代理（端口3000）...
start "API代理-3000" cmd /k "cd /d %~dp0Register2 && node server.js"

timeout /t 3 >nul

echo [3/3] 启动localtunnel...
start "localtunnel" cmd /k "lt --port 8080"

echo.
echo ========================================
echo 三个窗口已打开
echo ========================================
echo.
echo 窗口1：主服务器-8080
echo   - 应该显示：主界面预览服务器已启动
echo.
echo 窗口2：API代理-3000
echo   - 应该显示：代理服务器运行在 http://localhost:3000
echo.
echo 窗口3：localtunnel
echo   - 应该显示：your url is: https://xxxxx.loca.lt
echo   - 复制这个URL在手机访问
echo.
echo ========================================
echo.
echo 如果窗口显示错误，告诉我具体错误信息
echo.
pause
