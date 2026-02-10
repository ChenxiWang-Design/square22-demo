@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo 构建Android APK
echo ========================================
echo.

REM 检查Android目录
if not exist "android" (
    echo [错误] 未找到Android项目
    echo 请先运行: Capacitor-开始打包.bat
    pause
    exit /b 1
)

echo [重要] 构建APK需要Android Studio
echo.
echo 方法1：使用Android Studio（推荐）
echo   1. 运行: npx cap open android
echo   2. 在Android Studio中：Build → Build Bundle(s) / APK(s) → Build APK(s)
echo   3. APK位置: android/app/build/outputs/apk/debug/app-debug.apk
echo.
echo 方法2：使用命令行（需要配置Android SDK）
echo   运行: cd android && gradlew assembleDebug
echo.

echo ========================================
echo 选择操作：
echo ========================================
echo 1. 打开Android Studio
echo 2. 查看Android项目目录
echo 3. 退出
echo.
set /p choice="请选择 (1-3): "

if "%choice%"=="1" (
    echo.
    echo 正在打开Android Studio...
    call npx cap open android
) else if "%choice%"=="2" (
    echo.
    echo Android项目目录: %~dp0android
    explorer "%~dp0android"
) else (
    exit /b 0
)

echo.
pause
