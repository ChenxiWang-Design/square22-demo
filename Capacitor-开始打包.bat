@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo Capacitor Android 打包工具
echo ========================================
echo.

REM 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo [步骤1/5] 检查依赖...
echo.

REM 检查package.json
if not exist "package.json" (
    echo 创建package.json...
    echo { > package.json
    echo   "name": "square22-app", >> package.json
    echo   "version": "1.0.0", >> package.json
    echo   "scripts": { >> package.json
    echo     "build": "echo Build complete" >> package.json
    echo   } >> package.json
    echo } >> package.json
)

echo [步骤2/5] 安装Capacitor依赖...
echo.
echo 正在安装Capacitor核心包...
call npm install @capacitor/core @capacitor/cli @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar --save-dev

if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)

echo.
echo [步骤3/5] 初始化Capacitor...
echo.
echo 如果提示输入信息：
echo   App name: 数字分身广场
echo   App ID: com.square22.app
echo   Web dir: ./
echo.

if not exist "capacitor.config.ts" (
    echo 使用默认配置初始化...
    call npx cap init "数字分身广场" "com.square22.app" --web-dir="./"
) else (
    echo Capacitor配置已存在，跳过初始化
)

echo.
echo [步骤4/5] 添加Android平台...
echo.

if not exist "android" (
    call npx cap add android
    if %errorlevel% neq 0 (
        echo [错误] 添加Android平台失败
        echo 请确保已安装Android Studio和Android SDK
        pause
        exit /b 1
    )
) else (
    echo Android平台已存在
)

echo.
echo [步骤5/5] 同步文件...
echo.
call npx cap sync

echo.
echo ========================================
echo 配置完成！
echo ========================================
echo.
echo 下一步：
echo   1. 修改 Register2/register2.js 中的API地址
echo      从: http://localhost:3000/api/claude
echo      改为: https://your-api.railway.app/api/claude
echo.
echo   2. 运行: npx cap open android
echo      在Android Studio中构建APK
echo.
echo   3. 或者运行: Capacitor-构建APK.bat
echo.
echo ========================================
echo.
pause
