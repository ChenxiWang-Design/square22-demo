@echo off
chcp 65001 >nul 2>&1
cls
echo.
echo ========================================
echo ngrok 快速配置
echo ========================================
echo.
echo ngrok需要先配置才能用，3步搞定：
echo.
echo 第1步：打开浏览器，复制这个链接：
echo    https://dashboard.ngrok.com/get-started/your-authtoken
echo.
echo 第2步：登录后，复制页面上的authtoken
echo.
echo 第3步：粘贴到下面，按回车
echo.
echo ========================================
echo.
set /p TOKEN="粘贴authtoken后按回车: "

if "%TOKEN%"=="" (
    echo 没输入，退出
    pause
    exit
)

echo.
echo 正在配置...
ngrok config add-authtoken %TOKEN%

if %errorlevel% equ 0 (
    echo.
    echo ✓ 配置成功！
    echo.
    echo 现在运行：ngrok http 8080
    echo 就会显示URL了
    echo.
    pause
    exit
) else (
    echo.
    echo ✗ 配置失败，检查token是否正确
    echo.
    pause
    exit
)
