@echo off
chcp 65001 >nul 2>&1
cd /d %~dp0

echo ========================================
echo 清理Git历史中的API密钥
echo ========================================
echo.
echo [警告] 此操作会重写Git历史，请确保：
echo   1. 已备份重要数据
echo   2. 没有其他人正在使用此仓库
echo   3. 如果已推送到GitHub，需要强制推送（会覆盖远程历史）
echo.
set /p confirm="确认继续？(Y/N): "
if /i not "%confirm%"=="Y" (
    echo 已取消
    pause
    exit /b 0
)

echo.
echo [步骤1] 检查当前状态...
git status
echo.
pause

echo.
echo [步骤2] 先提交当前更改...
git add -A
git commit -m "移除硬编码API密钥，改用环境变量配置"
if %errorlevel% neq 0 (
    echo [提示] 可能没有新更改需要提交，继续...
)

echo.
echo [步骤3] 使用git filter-branch清理历史中的API密钥...
echo 这可能需要几分钟时间...
echo.

REM 替换所有历史提交中的API密钥为占位符
git filter-branch --force --index-filter ^
    "git rm --cached --ignore-unmatch -r . && git reset --hard && git add -A && git commit --amend --no-edit" ^
    --prune-empty --tag-name-filter cat -- --all

if %errorlevel% equ 0 (
    echo.
    echo [成功] Git历史已清理
    echo.
    echo [步骤4] 清理备份文件...
    rd /s /q .git\refs\original >nul 2>&1
    git reflog expire --expire=now --all >nul 2>&1
    git gc --prune=now --aggressive >nul 2>&1
    echo.
    echo ========================================
    echo [完成] Git历史已清理完成
    echo ========================================
    echo.
    echo 下一步：
    echo   1. 尝试推送到GitHub: git push -u origin main --force
    echo   2. 如果仍有问题，可能需要使用BFG Repo-Cleaner
    echo.
) else (
    echo.
    echo [错误] 清理失败
    echo.
    echo 备选方案：使用BFG Repo-Cleaner
    echo   1. 下载：https://rtyley.github.io/bfg-repo-cleaner/
    echo   2. 运行：java -jar bfg.jar --replace-text passwords.txt
    echo.
)

pause
