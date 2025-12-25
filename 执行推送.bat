@echo off
chcp 65001 >nul
echo ========================================
echo 强制推送到远程仓库
echo ========================================
echo.
echo 警告：这将重写远程历史！
echo.
pause

echo.
echo [1/2] 推送所有分支...
git push origin --force --all

if %errorlevel% neq 0 (
    echo [错误] 推送失败，错误代码: %errorlevel%
    pause
    exit /b 1
)

echo.
echo [2/2] 推送所有标签...
git push origin --force --tags

if %errorlevel% neq 0 (
    echo [警告] 标签推送失败，可能没有标签
)

echo.
echo ========================================
echo 推送完成！
echo ========================================
echo.
echo 重要提醒：
echo   - 远程历史已被重写
echo   - 如果有协作者，他们需要重新克隆仓库
echo.
pause

