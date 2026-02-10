@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo 推送代码到GitHub
echo ========================================
echo.

REM 检查Git是否安装
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Git，请先安装Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [步骤1] 检查Git仓库状态...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo 初始化Git仓库...
    git init
    if %errorlevel% neq 0 (
        echo [错误] Git初始化失败
        pause
        exit /b 1
    )
)

echo.
echo [步骤2] 添加文件到Git...
git add .
if %errorlevel% neq 0 (
    echo [错误] 添加文件失败
    pause
    exit /b 1
)

echo.
echo [步骤3] 提交文件...
git commit -m "Initial commit" >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] 可能没有新文件需要提交，继续...
)

echo.
echo [步骤4] 设置分支名称...
git branch -M main >nul 2>&1

echo.
echo ========================================
echo [重要] 需要设置GitHub仓库地址
echo ========================================
echo.
echo 请先完成以下步骤：
echo   1. 访问 https://github.com
echo   2. 创建新仓库（点击右上角 + → New repository）
echo   3. 复制仓库地址（类似：https://github.com/你的用户名/仓库名.git）
echo.
set /p GITHUB_URL="请粘贴GitHub仓库地址，然后按回车: "

if "%GITHUB_URL%"=="" (
    echo.
    echo [错误] 未输入仓库地址
    pause
    exit /b 1
)

echo.
echo [步骤5] 添加GitHub远程地址...
git remote remove origin >nul 2>&1
git remote add origin %GITHUB_URL%
if %errorlevel% neq 0 (
    echo [错误] 添加远程地址失败
    echo 请检查地址是否正确
    pause
    exit /b 1
)

echo.
echo [步骤6] 推送到GitHub...
echo.
echo 提示：
echo   - 如果要求输入用户名，输入你的GitHub用户名
echo   - 如果要求输入密码，需要使用Personal Access Token
echo     创建Token：https://github.com/settings/tokens
echo     选择 "Generate new token (classic)"
echo     勾选 "repo" 权限
echo     复制Token，作为密码输入
echo.
pause

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [成功] 代码已推送到GitHub！
    echo ========================================
    echo.
    echo 下一步：部署到Railway和Vercel
    echo 详细步骤请查看：部署准备清单.md
) else (
    echo.
    echo ========================================
    echo [错误] 推送失败
    echo ========================================
    echo.
    echo 可能的原因：
    echo   1. 需要创建Personal Access Token
    echo     访问：https://github.com/settings/tokens
    echo   2. 仓库地址不正确
    echo   3. 网络问题
    echo.
    echo 详细说明请查看：GitHub推送代码-详细步骤.md
)

echo.
pause
