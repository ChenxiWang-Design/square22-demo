@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo 方案B：localtunnel 一键启动
echo ========================================
echo.

REM 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查localtunnel
where lt >nul 2>&1
if %errorlevel% neq 0 (
    echo ========================================
    echo [提示] 未检测到localtunnel
    echo ========================================
    echo.
    echo 请先安装localtunnel（只需要一次）：
    echo.
    echo   打开命令行，运行：
    echo   npm install -g localtunnel
    echo.
    echo 安装完成后，重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo [1/3] 检查依赖...
echo.

REM 检查主服务器依赖
if not exist "node_modules\express" (
    echo 正在安装主服务器依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

REM 检查API代理依赖
if not exist "Register2\node_modules\express" (
    echo 正在安装API代理依赖...
    cd Register2
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo [错误] API代理依赖安装失败
        pause
        exit /b 1
    )
)

echo [2/3] 启动主服务器（端口8080）...
echo.
start "主服务器-8080" cmd /k "cd /d %~dp0 && echo ======================================== && echo 主服务器（端口8080） && echo ======================================== && echo. && node server.js"

timeout /t 2 >nul

echo [3/3] 启动API代理服务器（端口3000）...
echo.
start "API代理-3000" cmd /k "cd /d %~dp0Register2 && echo ======================================== && echo API代理服务器（端口3000） && echo ======================================== && echo. && node server.js"

timeout /t 2 >nul

echo ========================================
echo 启动localtunnel（生成公网URL）...
echo ========================================
echo.
echo 提示：
echo   - 将打开一个新窗口运行localtunnel
echo   - localtunnel会显示一个URL（例如：https://xxxxx.loca.lt）
echo   - 复制这个URL在手机浏览器访问
echo.
echo ========================================
echo.
pause

start "localtunnel-URL" cmd /k "title localtunnel - 查看这里的URL && color 0A && echo. && echo ======================================== && echo   localtunnel 正在启动... && echo ======================================== && echo. && echo [重要] 等待几秒后，下面会显示URL && echo. && echo 找到这一行： && echo   your url is: https://xxxxx.loca.lt && echo. && echo 复制这个URL，在手机浏览器访问 && echo. && echo ======================================== && echo. && lt --port 8080 && pause"

echo.
echo ========================================
echo 启动完成！
echo ========================================
echo.
echo 已打开三个窗口：
echo   1. 主服务器（端口8080）
echo   2. API代理（端口3000）
echo   3. localtunnel（生成公网URL） ← 这个窗口里有URL！
echo.
echo ========================================
echo [重要] 如何找到 localtunnel 的 URL：
echo ========================================
echo.
echo 方法1：查看 localtunnel 窗口
echo   1. 找到标题为"localtunnel-URL"的窗口
echo   2. 在窗口中找到"your url is:"这一行
echo   3. 复制后面的URL（例如：https://xxxxx.loca.lt）
echo.
echo 方法2：如果窗口太多找不到
echo   1. 使用 Alt+Tab 切换窗口
echo   2. 找到显示"your url is:"的窗口
echo.
echo ========================================
echo 下一步：
echo ========================================
echo   1. 复制 localtunnel 显示的 URL
echo   2. 确保电脑已连接VPN（保证AI功能）
echo   3. 在手机浏览器访问该URL
echo   4. 测试PWA和AI功能
echo.
echo 关闭服务：按Ctrl+C停止各个窗口
echo.
pause
