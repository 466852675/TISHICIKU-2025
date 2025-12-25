@echo off
chcp 65001 >nul
echo ========================================
echo 完成 Git 历史清理
echo ========================================
echo.

echo [1/3] 清理引用（修复版）...
REM Windows CMD 方式清理引用
for /f "tokens=*" %%i in ('git for-each-ref --format="%%(refname)" refs/original') do (
    git update-ref -d "%%i" 2>nul
)

echo [2/3] 再次清理 reflog...
git reflog expire --expire=now --all

echo [3/3] 最终垃圾回收...
git gc --prune=now --aggressive

echo.
echo [验证] 检查文件是否还在历史中...
git log --all --full-history -- "AI赋能业务设计-智能体搭建指南及配套知识库套件/00-工具安装包/Trae CN-Setup-x64.exe" 2>nul
if %errorlevel% neq 0 (
    echo [成功] 文件已从历史中移除！
) else (
    echo [警告] 文件可能仍在历史中，但 filter-branch 已执行
    echo 请检查上面的输出，如果为空则说明清理成功
)

echo.
echo ========================================
echo 清理完成！
echo ========================================
echo.
echo 下一步：执行强制推送
echo   git push origin --force --all
echo   git push origin --force --tags
echo.
pause

