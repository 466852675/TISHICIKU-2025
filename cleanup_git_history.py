#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Git 历史清理脚本 - 移除大文件
"""
import subprocess
import sys
import os

def run_command(cmd, description):
    """执行命令并显示结果"""
    print(f"\n{'='*50}")
    print(f"执行: {description}")
    print(f"命令: {cmd}")
    print('='*50)
    
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore'
        )
        
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        
        return result.returncode == 0
    except Exception as e:
        print(f"错误: {e}", file=sys.stderr)
        return False

def main():
    print("="*50)
    print("Git 历史清理脚本")
    print("="*50)
    
    # 检查是否在 Git 仓库中
    if not os.path.exists('.git'):
        print("错误：当前目录不是 Git 仓库！")
        sys.exit(1)
    
    # 检查 Git 状态
    print("\n步骤 1: 检查 Git 状态...")
    run_command("git status", "检查状态")
    
    # 确认
    print("\n" + "="*50)
    print("警告：此操作将重写 Git 历史！")
    print("="*50)
    confirm = input("\n确认继续？(yes/no): ").strip().lower()
    
    if confirm != 'yes':
        print("操作已取消")
        sys.exit(0)
    
    # 执行清理
    file_path = "AI赋能业务设计-智能体搭建指南及配套知识库套件/00-工具安装包/Trae CN-Setup-x64.exe"
    
    print("\n步骤 2: 从 Git 历史中移除大文件...")
    print("这可能需要几分钟，请耐心等待...")
    
    cmd = f'git filter-branch --force --index-filter "git rm --cached --ignore-unmatch \'{file_path}\'" --prune-empty --tag-name-filter cat -- --all'
    success = run_command(cmd, "移除大文件")
    
    if not success:
        print("\n[错误] filter-branch 执行失败")
        sys.exit(1)
    
    print("\n步骤 3: 清理 Git 引用...")
    run_command('git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin', "清理引用")
    run_command("git reflog expire --expire=now --all", "清理 reflog")
    
    print("\n步骤 4: 垃圾回收（这可能需要几分钟）...")
    run_command("git gc --prune=now --aggressive", "垃圾回收")
    
    print("\n步骤 5: 验证清理结果...")
    result = subprocess.run(
        f'git log --all --full-history -- "{file_path}"',
        shell=True,
        capture_output=True,
        text=True,
        encoding='utf-8',
        errors='ignore'
    )
    
    if result.returncode != 0 or not result.stdout.strip():
        print("[成功] 文件已从历史中移除")
    else:
        print("[警告] 文件可能仍在历史中")
        print(result.stdout)
    
    print("\n" + "="*50)
    print("清理完成！")
    print("="*50)
    print("\n下一步操作：")
    print("  1. 检查仓库状态：git status")
    print("  2. 强制推送到远程：git push origin --force --all")
    print("  3. 如果有标签，也需要推送：git push origin --force --tags")
    print("\n重要提醒：")
    print("  - 强制推送会重写远程历史")
    print("  - 如果有协作者，他们需要重新克隆仓库")

if __name__ == '__main__':
    main()

