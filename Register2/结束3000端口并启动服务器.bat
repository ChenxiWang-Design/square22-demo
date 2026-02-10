@echo off
cd /d %~dp0
echo Killing process on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a 2>nul
    if not errorlevel 1 echo Killed PID %%a
)
timeout /t 2 /nobreak >nul
echo.
if exist node_modules (
    echo ========================================
    echo 启动服务器（已结束3000端口进程）
    echo ========================================
    echo.
    
    REM 优先检查环境变量
    if not "%CLAUDE_API_KEY%"=="" (
        echo [信息] 使用环境变量中的 API 密钥
        goto start_server
    )
    
    REM 检查是否存在 .env 文件
    if exist .env (
        echo [信息] 检测到 .env 文件，将使用其中的配置
        goto start_server
    )
    
    REM 如果都没有，提示用户
    echo [错误] 未找到 API 密钥配置
    echo.
    echo 请选择以下方式之一配置：
    echo   方式1（推荐）: 运行 "配置API密钥.bat" 脚本
    echo   方式2: 设置环境变量: set CLAUDE_API_KEY=你的密钥
    echo   方式3: 创建 .env 文件（参考 .env.example）
    echo.
    pause
    exit /b 1
    
    :start_server
    echo [信息] 正在启动服务器...
    echo.
    node server.js
    pause
) else (
    echo Error: node_modules not found. Run npm install first.
    pause
)
