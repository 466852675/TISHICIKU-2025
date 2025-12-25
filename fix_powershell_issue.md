# PowerShell 执行问题诊断和解决方案

## 问题分析

从错误信息来看，问题出在 Cursor 的 PowerShell 包装器脚本上，而不是你执行的命令。错误发生在：
- 临时 PowerShell 脚本的第34行
- Base64 解码相关的代码
- 字符串格式化操作

这是 Cursor IDE 的终端环境配置问题，不是你的代码问题。

## 解决方案

### 方案1：使用 cmd.exe 而不是 PowerShell（推荐）

在 Cursor 设置中，将默认终端改为 `cmd.exe` 或 `Git Bash`：

1. 打开 Cursor 设置（Ctrl+,）
2. 搜索 "terminal.integrated.shell.windows"
3. 设置为：
   - `C:\Windows\System32\cmd.exe` (CMD)
   - 或 `C:\Program Files\Git\bin\bash.exe` (Git Bash)

### 方案2：使用 Git Bash

如果安装了 Git，可以直接使用 Git Bash：
- 右键项目文件夹 → "Git Bash Here"
- 在 Git Bash 中执行命令

### 方案3：使用 Python 脚本（已创建）

我已经创建了 `cleanup_git_history.py`，你可以：
1. 打开命令提示符（不是 PowerShell）
2. 运行：`python cleanup_git_history.py`

### 方案4：修改 Cursor 终端配置

在 Cursor 的 `settings.json` 中添加：

```json
{
  "terminal.integrated.defaultProfile.windows": "Command Prompt",
  "terminal.integrated.profiles.windows": {
    "Command Prompt": {
      "path": "C:\\Windows\\System32\\cmd.exe"
    },
    "Git Bash": {
      "path": "C:\\Program Files\\Git\\bin\\bash.exe"
    }
  }
}
```

### 方案5：直接使用批处理文件

我已经创建了 `执行清理.bat`，你可以：
1. 在文件资源管理器中双击运行
2. 或在 CMD 中执行：`执行清理.bat`

## 临时解决方案

如果无法修改终端配置，可以：

1. **使用外部终端**：
   - 打开 Windows 命令提示符（CMD）
   - 或打开 Git Bash
   - 切换到项目目录
   - 执行清理脚本

2. **使用 Python 脚本**（最可靠）：
   ```bash
   python cleanup_git_history.py
   ```

## 推荐操作

**立即执行清理**：
1. 打开 Windows 命令提示符（Win+R，输入 `cmd`）
2. 切换到项目目录：
   ```bash
   cd "C:\Users\hangy\Desktop\智能体配置模板"
   ```
3. 运行 Python 脚本：
   ```bash
   python cleanup_git_history.py
   ```

**长期解决**：
修改 Cursor 设置，将默认终端改为 CMD 或 Git Bash。

