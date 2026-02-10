@echo off
chcp 65001 >nul 2>&1
cd /d %~dp0
echo ========================================
echo 启动 Claude API 代理服务器
echo ========================================
echo.

REM 检查端口3000是否被占用
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [警告] 端口 3000 已被占用，请先关闭其他服务器窗口
    echo.
)

REM 优先检查环境变量
if not "%CLAUDE_API_KEY%"=="" (
    echo [信息] 使用环境变量中的 API 密钥
    goto start_server
)

REM 检查是否存在 .env 文件
if exist .env (
    echo [信息] 检测到 .env 文件，将使用其中的配置
    REM 注意：需要 server.js 中加载 dotenv
    goto start_server
)

REM 如果都没有，提示用户
echo [错误] 未找到 API 密钥配置
echo.
echo 请选择以下方式之一配置：
echo.
echo   方式1（推荐）: 运行 "配置API密钥.bat" 脚本
echo   方式2: 设置环境变量: set CLAUDE_API_KEY=你的密钥
echo   方式3: 创建 .env 文件（参考 .env.example）
echo.
echo 详细说明请查看: API密钥使用说明.md
echo.
pause
exit /b 1

:start_server
if exist node_modules (
    echo [信息] 正在启动服务器...
    echo.
    node server.js
) else (
    echo [错误] 未找到 node_modules 目录
    echo 请先运行: npm install
    echo.
    pause
)
if exist node_modules (
    node server.js
) else (
    echo Error: node_modules not found. Run: npm install
)
echo.
pause
