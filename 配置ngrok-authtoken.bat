@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo 配置 ngrok authtoken
echo ========================================
echo.
echo [问题] ngrok需要配置authtoken才能使用
echo.
echo ========================================
echo 步骤1：获取 authtoken
echo ========================================
echo.
echo 1. 打开浏览器，访问：
echo    https://dashboard.ngrok.com/signup
echo.
echo 2. 如果没有账号，先注册（免费）
echo    如果有账号，直接登录：
echo    https://dashboard.ngrok.com/login
echo.
echo 3. 登录后，访问这个页面获取authtoken：
echo    https://dashboard.ngrok.com/get-started/your-authtoken
echo.
echo 4. 复制显示的authtoken（类似：2abc123def456...）
echo.
echo ========================================
echo 步骤2：配置 authtoken
echo ========================================
echo.
set /p AUTHTOKEN="请粘贴你的authtoken，然后按回车: "

if "%AUTHTOKEN%"=="" (
    echo.
    echo [错误] 未输入authtoken
    pause
    exit /b 1
)

echo.
echo 正在配置...
ngrok config add-authtoken %AUTHTOKEN%

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [成功] authtoken配置完成！
    echo ========================================
    echo.
    echo 现在可以运行：ngrok http 8080
    echo.
) else (
    echo.
    echo [错误] 配置失败，请检查authtoken是否正确
    echo.
)

pause
