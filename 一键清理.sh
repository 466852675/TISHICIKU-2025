#!/bin/bash
# Git 历史清理脚本 - 适用于 Git Bash

echo "========================================"
echo "Git 历史清理脚本"
echo "========================================"
echo ""

# 检查是否在 Git 仓库中
if [ ! -d .git ]; then
    echo "错误：当前目录不是 Git 仓库！"
    exit 1
fi

echo "步骤 1: 检查 Git 状态..."
git status

echo ""
echo "警告：此操作将重写 Git 历史！"
read -p "确认继续？(yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "操作已取消"
    exit 0
fi

echo ""
echo "步骤 2: 从 Git 历史中移除大文件..."
echo "正在执行 git filter-branch（这可能需要几分钟）..."

git filter-branch --force --index-filter "git rm --cached --ignore-unmatch 'AI赋能业务设计-智能体搭建指南及配套知识库套件/00-工具安装包/Trae CN-Setup-x64.exe'" --prune-empty --tag-name-filter cat -- --all

if [ $? -eq 0 ]; then
    echo "[成功] filter-branch 执行成功"
else
    echo "[失败] filter-branch 执行失败"
    exit 1
fi

echo ""
echo "步骤 3: 清理 Git 引用..."

git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
echo "[完成] 引用清理完成"

git reflog expire --expire=now --all
echo "[完成] reflog 清理完成"

echo "正在执行垃圾回收（这可能需要几分钟）..."
git gc --prune=now --aggressive
echo "[完成] 垃圾回收完成"

echo ""
echo "步骤 4: 验证清理结果..."

if git log --all --full-history -- "AI赋能业务设计-智能体搭建指南及配套知识库套件/00-工具安装包/Trae CN-Setup-x64.exe" 2>&1 | grep -q "fatal"; then
    echo "[成功] 文件已从历史中移除"
else
    echo "[警告] 文件可能仍在历史中，请手动检查"
fi

echo ""
echo "========================================"
echo "清理完成！"
echo "========================================"
echo ""
echo "下一步操作："
echo "  1. 检查仓库状态：git status"
echo "  2. 强制推送到远程：git push origin --force --all"
echo "  3. 如果有标签，也需要推送：git push origin --force --tags"
echo ""
echo "重要提醒："
echo "  - 强制推送会重写远程历史"
echo "  - 如果有协作者，他们需要重新克隆仓库"
echo ""

