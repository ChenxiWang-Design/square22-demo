@echo off
chcp 65001 >nul 2>&1
cd /d %~dp0

echo ========================================
echo 彻底清理Git历史并推送到GitHub
echo ========================================
echo.
echo [警告] 此操作会：
echo   1. 删除本地Git历史
echo   2. 重新初始化Git仓库
echo   3. 创建新的干净提交
echo   4. 强制推送到GitHub（覆盖远程历史）
echo.
echo [注意] 确保：
echo   - GitHub仓库是新的，或可以覆盖
echo   - 没有其他人正在使用此仓库
echo.
set /p confirm="确认继续？(Y/N): "
if /i not "%confirm%"=="Y" (
    echo 已取消
    pause
    exit /b 0
)

echo.
echo [步骤1] 备份当前远程地址...
for /f "tokens=2" %%a in ('git remote get-url origin 2^>nul') do set REMOTE_URL=%%a
if "%REMOTE_URL%"=="" (
    set REMOTE_URL=https://github.com/ChenxiWang-Design/square22-demo.git
    echo 使用默认地址: %REMOTE_URL%
) else (
    echo 当前远程地址: %REMOTE_URL%
)

echo.
echo [步骤2] 删除本地Git历史...
rd /s /q .git
if %errorlevel% neq 0 (
    echo [错误] 删除失败
    pause
    exit /b 1
)

echo.
echo [步骤3] 重新初始化Git仓库...
git init
git branch -M main

echo.
echo [步骤4] 添加所有文件（.gitignore会排除敏感文件）...
git add .

echo.
echo [步骤5] 创建初始提交...
git commit -m "Initial commit - 已移除所有API密钥"

echo.
echo [步骤6] 添加远程仓库...
git remote add origin %REMOTE_URL%

echo.
echo [步骤7] 强制推送到GitHub...
echo 注意：这会覆盖GitHub上的历史
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [成功] 代码已推送到GitHub！
    echo ========================================
    echo.
    echo 下一步：
    echo   1. 部署API服务器到Railway
    echo   2. 部署前端到Vercel
    echo   3. 手机访问Vercel地址
    echo.
) else (
    echo.
    echo [错误] 推送失败
    echo 可能的原因：
    echo   1. GitHub推送保护仍然检测到密钥
    echo   2. 需要检查是否还有文件包含密钥
    echo   3. 网络问题
    echo.
)

pause
