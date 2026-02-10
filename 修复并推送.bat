@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo 修复Git配置并推送代码
echo ========================================
echo.

echo [步骤1] 检查Git状态...
git status

echo.
echo [步骤2] 添加所有文件...
git add .
if %errorlevel% neq 0 (
    echo [错误] 添加文件失败
    pause
    exit /b 1
)

echo.
echo [步骤3] 提交文件...
git commit -m "Update for deployment"
if %errorlevel% neq 0 (
    echo [提示] 可能没有新文件需要提交
)

echo.
echo [步骤4] 检查远程仓库配置...
git remote -v

echo.
echo [步骤5] 更新远程仓库地址（如果需要）...
echo 当前配置的远程地址：https://github.com/ChenxiWang-Design/square22-demo.git
echo.
set /p UPDATE_REMOTE="是否需要更新远程地址？(Y/N，直接回车跳过): "

if /i "%UPDATE_REMOTE%"=="Y" (
    set /p NEW_URL="请输入新的GitHub仓库地址: "
    if not "%NEW_URL%"=="" (
        git remote set-url origin %NEW_URL%
        echo 远程地址已更新
    )
)

echo.
echo [步骤6] 推送到GitHub...
echo.
echo 提示：
echo   - 如果要求输入用户名，输入：ChenxiWang-Design
echo   - 如果要求输入密码，使用Personal Access Token
echo     创建Token：https://github.com/settings/tokens
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
    echo     选择 "Generate new token (classic)"
    echo     勾选 "repo" 权限
    echo     复制Token，推送时作为密码输入
    echo.
    echo   2. 网络问题，稍后重试
    echo.
    echo   3. 仓库权限问题，检查仓库是否存在
    echo.
)

echo.
pause
