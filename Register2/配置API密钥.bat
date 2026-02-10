@echo off
chcp 65001 >nul 2>&1
cd /d %~dp0

echo ========================================
echo 配置 Claude API 密钥
echo ========================================
echo.
echo 此脚本将帮助您设置 API 密钥，以便使用需要 API 的功能。
echo.
echo 请选择配置方式：
echo.
echo   1. 设置为系统环境变量（推荐，永久有效）
echo   2. 设置为用户环境变量（仅当前用户）
echo   3. 创建 .env 文件（需要安装 dotenv 包）
echo   4. 仅查看当前配置
echo.
set /p choice="请输入选项 (1-4): "

if "%choice%"=="1" goto set_system
if "%choice%"=="2" goto set_user
if "%choice%"=="3" goto set_env_file
if "%choice%"=="4" goto show_config
echo 无效选项
pause
exit /b 1

:set_system
echo.
echo [方式1] 设置为系统环境变量（需要管理员权限）
echo.
set /p api_key="请输入您的 Claude API 密钥: "
if "%api_key%"=="" (
    echo [错误] 未输入API密钥
    pause
    exit /b 1
)
setx CLAUDE_API_KEY "%api_key%" /M >nul 2>&1
if %errorlevel% equ 0 (
    echo [成功] 系统环境变量已设置
    echo 注意：需要重新打开命令行窗口才能生效
) else (
    echo [错误] 设置失败，可能需要管理员权限
    echo 请右键点击此文件，选择"以管理员身份运行"
)
goto end

:set_user
echo.
echo [方式2] 设置为用户环境变量
echo.
set /p api_key="请输入您的 Claude API 密钥: "
if "%api_key%"=="" (
    echo [错误] 未输入API密钥
    pause
    exit /b 1
)
setx CLAUDE_API_KEY "%api_key%"
if %errorlevel% equ 0 (
    echo [成功] 用户环境变量已设置
    echo 注意：需要重新打开命令行窗口才能生效
) else (
    echo [错误] 设置失败
)
goto end

:set_env_file
echo.
echo [方式3] 创建 .env 文件
echo.
set /p api_key="请输入您的 Claude API 密钥: "
if "%api_key%"=="" (
    echo [错误] 未输入API密钥
    pause
    exit /b 1
)
(
echo # Claude API 配置
echo CLAUDE_API_KEY=%api_key%
) > .env
if exist .env (
    echo [成功] .env 文件已创建
    echo 注意：需要安装 dotenv 包并在 server.js 中加载
    echo 运行: npm install dotenv
    echo 然后在 server.js 开头添加: require('dotenv').config();
) else (
    echo [错误] 创建 .env 文件失败
)
goto end

:show_config
echo.
echo [当前配置]
echo.
if defined CLAUDE_API_KEY (
    echo 环境变量 CLAUDE_API_KEY: %CLAUDE_API_KEY%
) else (
    echo 环境变量 CLAUDE_API_KEY: 未设置
)
if exist .env (
    echo .env 文件: 存在
    type .env | findstr /V "^#" | findstr /V "^$"
) else (
    echo .env 文件: 不存在
)
goto end

:end
echo.
echo ========================================
echo 使用说明
echo ========================================
echo.
echo 设置完成后，启动服务器的方式：
echo.
echo   方式1（环境变量）:
echo     1. 重新打开命令行窗口
echo     2. 运行: 启动服务器.bat
echo.
echo   方式2（.env文件）:
echo     1. 确保已安装 dotenv: npm install dotenv
echo     2. 修改 server.js，在开头添加: require('dotenv').config();
echo     3. 运行: 启动服务器.bat
echo.
echo   方式3（临时设置）:
echo     在命令行中运行:
echo     set CLAUDE_API_KEY=你的密钥
echo     然后运行: node server.js
echo.
pause
