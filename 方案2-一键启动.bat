@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo 方案2：VPN + ngrok 一键启动脚本
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

REM 检查ngrok
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo ========================================
    echo [警告] 未检测到ngrok
    echo ========================================
    echo.
    echo 请先安装ngrok：
    echo.
    echo 方法1（推荐）：使用npm全局安装
    echo   npm install -g ngrok
    echo.
    echo 方法2：手动下载
    echo   1. 访问 https://ngrok.com/download
    echo   2. 注册账号：https://dashboard.ngrok.com/signup
    echo   3. 获取authtoken：https://dashboard.ngrok.com/get-started/your-authtoken
    echo   4. 下载Windows版本并解压
    echo   5. 运行：ngrok config add-authtoken 你的authtoken
    echo   6. 将ngrok目录添加到系统PATH（可选）
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
echo 启动ngrok（端口8080转发）...
echo ========================================
echo.
echo 提示：
echo   - 将打开一个新窗口运行ngrok
echo   - ngrok会显示公网URL（例如：https://abc123.ngrok-free.app）
echo   - 复制这个URL在手机浏览器访问
echo   - 首次访问可能需要点击"Visit Site"
echo.
echo ========================================
echo.
pause

start "ngrok-8080" cmd /k "echo ======================================== && echo ngrok - 端口8080转发 && echo ======================================== && echo. && echo 正在启动ngrok... && echo. && echo [重要] 启动后，在窗口中找到以下内容： && echo. && echo Forwarding    https://xxxxx.ngrok-free.app -^> http://localhost:8080 && echo. && echo 复制 https://xxxxx.ngrok-free.app 这个URL && echo 在手机浏览器访问 && echo. && echo 或者访问 Web Interface: http://127.0.0.1:4040 && echo. && echo ======================================== && echo. && ngrok http 8080"

echo.
echo ========================================
echo 启动完成！
echo ========================================
echo.
echo 已打开三个窗口：
echo   1. 主服务器（端口8080）
echo   2. API代理（端口3000）
echo   3. ngrok（端口8080转发） ← 这个窗口里有URL！
echo.
echo ========================================
echo [重要] 如何找到 ngrok 的 URL：
echo ========================================
echo.
echo 【最简单的方法】使用 Web Interface：
echo   1. 打开浏览器（Chrome、Edge等）
echo   2. 访问：http://127.0.0.1:4040
echo   3. 网页顶部会显示你的公网URL（例如：https://abc123.ngrok-free.app）
echo   4. 直接复制这个URL在手机访问！
echo.
echo 【方法2】在命令行窗口找：
echo   1. 查看屏幕底部任务栏，找到所有命令行窗口
echo   2. 将鼠标悬停在每个窗口上，找到标题为"ngrok-8080"的
echo   3. 点击该窗口，找到"Forwarding"这一行
echo   4. 复制 https://xxxxx.ngrok-free.app 这个URL
echo.
echo 【方法3】使用 Alt+Tab：
echo   1. 按住 Alt 键，然后按 Tab 键
echo   2. 在窗口缩略图中找到命令行窗口
echo   3. 继续按 Tab 切换，直到找到显示ngrok输出的窗口
echo.
echo ========================================
echo 下一步：
echo ========================================
echo   1. 复制 ngrok 显示的 URL
echo   2. 确保电脑已连接VPN
echo   3. 在手机浏览器访问该URL
echo   4. 如果看到警告页面，点击"Visit Site"
echo   5. 测试PWA和AI功能
echo.
echo 详细说明请查看：如何找到ngrok的URL.md
echo.
echo 关闭服务：按Ctrl+C停止各个窗口
echo.
pause
