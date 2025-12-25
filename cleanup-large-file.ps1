# Git 历史清理脚本 - 移除大文件
# 用途：从 Git 历史中移除超过 GitHub 限制的大文件

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git 历史清理脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在 Git 仓库中
if (-not (Test-Path .git)) {
    Write-Host "错误：当前目录不是 Git 仓库！" -ForegroundColor Red
    exit 1
}

Write-Host "步骤 1: 检查 Git 状态..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "警告：此操作将重写 Git 历史！" -ForegroundColor Red
Write-Host "请确保："
Write-Host "  1. 已备份仓库"
Write-Host "  2. 已提交所有更改"
Write-Host "  3. 已通知协作者（如果有）" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "确认继续？(yes/no)"
if ($confirm -ne "yes") {
    Write-Host "操作已取消" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "步骤 2: 从 Git 历史中移除大文件..." -ForegroundColor Yellow

# 要移除的文件路径（旧目录结构）
$filePath = "AI赋能业务设计-智能体搭建指南及配套知识库套件/00-工具安装包/Trae CN-Setup-x64.exe"

# 使用 git filter-branch 移除文件
Write-Host "正在执行 git filter-branch..." -ForegroundColor Cyan
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch '$filePath'" --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ filter-branch 执行成功" -ForegroundColor Green
} else {
    Write-Host "✗ filter-branch 执行失败" -ForegroundColor Red
    Write-Host "尝试使用替代方法..." -ForegroundColor Yellow
    
    # 替代方法：使用 git filter-repo（如果已安装）
    $hasFilterRepo = Get-Command git-filter-repo -ErrorAction SilentlyContinue
    if ($hasFilterRepo) {
        Write-Host "使用 git-filter-repo..." -ForegroundColor Cyan
        git filter-repo --path "$filePath" --invert-paths
    } else {
        Write-Host "错误：git-filter-repo 未安装" -ForegroundColor Red
        Write-Host "请安装：pip install git-filter-repo" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "步骤 3: 清理 Git 引用..." -ForegroundColor Yellow

# 清理备份引用
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 引用清理完成" -ForegroundColor Green
}

# 清理 reflog
git reflog expire --expire=now --all
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ reflog 清理完成" -ForegroundColor Green
}

# 垃圾回收
Write-Host "正在执行垃圾回收（这可能需要几分钟）..." -ForegroundColor Cyan
git gc --prune=now --aggressive
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 垃圾回收完成" -ForegroundColor Green
}

Write-Host ""
Write-Host "步骤 4: 验证清理结果..." -ForegroundColor Yellow

# 检查文件是否还在历史中
$stillExists = git log --all --full-history -- "$filePath" 2>&1
if ($stillExists -match "fatal" -or $stillExists -eq "") {
    Write-Host "✓ 文件已从历史中移除" -ForegroundColor Green
} else {
    Write-Host "⚠ 警告：文件可能仍在历史中" -ForegroundColor Yellow
    Write-Host "请检查输出：" -ForegroundColor Yellow
    Write-Host $stillExists
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "清理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "  1. 检查仓库状态：git status" -ForegroundColor White
Write-Host "  2. 强制推送到远程：git push origin --force --all" -ForegroundColor White
Write-Host "  3. 如果有标签，也需要推送：git push origin --force --tags" -ForegroundColor White
Write-Host ""
Write-Host "⚠ 重要提醒：" -ForegroundColor Red
Write-Host "  - 强制推送会重写远程历史" -ForegroundColor Yellow
Write-Host "  - 如果有协作者，他们需要重新克隆仓库" -ForegroundColor Yellow
Write-Host ""

