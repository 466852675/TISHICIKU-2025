@echo off
chcp 65001 >nul
echo ========================================
echo 快速执行 Git 历史清理
echo ========================================
echo.

REM 直接执行清理命令（无交互）
echo [1/5] 从历史中移除大文件...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch \"AI赋能业务设计-智能体搭建指南及配套知识库套件/00-工具安装包/Trae CN-Setup-x64.exe\"" --prune-empty --tag-name-filter cat -- --all

if %errorlevel% neq 0 (
    echo [错误] 清理失败，错误代码: %errorlevel%
    pause
    exit /b 1
)

echo [2/5] 清理引用...
git for-each-ref --format="delete %(refname)" refs/original > refs_to_delete.txt 2>nul
if exist refs_to_delete.txt (
    for /f "delims=" %%i in (refs_to_delete.txt) do git update-ref -d "%%i" 2>nul
    del refs_to_delete.txt
)

echo [3/5] 清理 reflog...
git reflog expire --expire=now --all

echo [4/5] 垃圾回收（可能需要几分钟）...
git gc --prune=now --aggressive

echo [5/5] 验证清理结果...
git log --all --full-history -- "AI赋能业务设计-智能体搭建指南及配套知识库套件/00-工具安装包/Trae CN-Setup-x64.exe" >nul 2>&1
if %errorlevel% neq 0 (
    echo [成功] 文件已从历史中移除
) else (
    echo [警告] 文件可能仍在历史中
)

echo.
echo ========================================
echo 清理完成！
echo ========================================
echo.
echo 现在可以执行强制推送：
echo   git push origin --force --all
echo   git push origin --force --tags
echo.
pause

