# Git 历史清理说明

## 问题
Git 历史中包含一个 204.49 MB 的安装包文件，超过 GitHub 的 100 MB 限制，导致推送失败。

## 解决方案

### 方法1：使用提供的 PowerShell 脚本（推荐）

1. **运行清理脚本**：
   ```powershell
   .\cleanup-large-file.ps1
   ```

2. **按照提示操作**：
   - 脚本会检查 Git 状态
   - 确认后自动执行清理
   - 完成后按照提示强制推送

### 方法2：手动执行命令

如果脚本无法运行，可以手动执行以下命令：

```bash
# 1. 从历史中移除文件
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch 'AI赋能业务设计-智能体搭建指南及配套知识库套件/00-工具安装包/Trae CN-Setup-x64.exe'" --prune-empty --tag-name-filter cat -- --all

# 2. 清理引用
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin

# 3. 清理 reflog
git reflog expire --expire=now --all

# 4. 垃圾回收
git gc --prune=now --aggressive

# 5. 强制推送
git push origin --force --all
git push origin --force --tags
```

### 方法3：使用 git-filter-repo（如果已安装）

```bash
# 安装 git-filter-repo
pip install git-filter-repo

# 移除文件
git filter-repo --path "AI赋能业务设计-智能体搭建指南及配套知识库套件/00-工具安装包/Trae CN-Setup-x64.exe" --invert-paths

# 强制推送
git push origin --force --all
```

## 重要提醒

⚠️ **执行前必须**：
1. ✅ 备份仓库（克隆一份到其他位置）
2. ✅ 提交所有未提交的更改
3. ✅ 通知协作者（如果有）

⚠️ **执行后**：
- 强制推送会重写远程历史
- 协作者需要重新克隆仓库或执行 `git fetch --all && git reset --hard origin/main`

## 预防措施

已创建 `.gitignore` 文件，排除以下文件类型：
- `*.exe`, `*.dmg`, `*.pkg` 等安装包
- 旧目录结构
- 系统文件和 IDE 配置

**建议**：安装包应通过下载链接提供，不要提交到 Git 仓库。

