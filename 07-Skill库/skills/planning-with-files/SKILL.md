---
name: planning-with-files
version: "2.1.2"
description: 实现Manus风格的基于文件的规划，用于复杂任务。创建task_plan.md、findings.md和progress.md。在开始复杂多步骤任务、研究项目或任何需要>5次工具调用的任务时使用。
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebFetch
  - WebSearch
hooks:
  SessionStart:
    - hooks:
        - type: command
          command: "echo '[planning-with-files] 准备就绪。复杂任务自动激活，或使用/planning-with-files手动调用'"
  PreToolUse:
    - matcher: "Write|Edit|Bash"
      hooks:
        - type: command
          command: "cat task_plan.md 2>/dev/null | head -30 || true"
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "echo '[planning-with-files] 文件已更新。如果完成阶段，请更新task_plan.md状态。'"
  Stop:
    - hooks:
        - type: command
          command: "${CLAUDE_PLUGIN_ROOT}/scripts/check-complete.sh"
---

# 基于文件的规划

像Manus一样工作：使用持久的markdown文件作为你的"磁盘上的工作记忆"。

## 重要：文件存放位置

使用此技能时：

- **模板**存储在技能目录 `${CLAUDE_PLUGIN_ROOT}/templates/`
- **你的规划文件**（`task_plan.md`、`findings.md`、`progress.md`）应该创建在**你的项目目录**中——即你正在工作的文件夹

| 位置 | 存放内容 |
|----------|-----------------|
| 技能目录 (`${CLAUDE_PLUGIN_ROOT}/`) | 模板、脚本、参考文档 |
| 你的项目目录 | `task_plan.md`、`findings.md`、`progress.md` |

这确保你的规划文件与你的代码共存，而不是埋在技能安装文件夹中。

## 快速开始

在任何复杂任务之前：

1. **在你的项目中创建 `task_plan.md`** — 使用 [templates/task_plan.md](templates/task_plan.md) 作为参考
2. **在你的项目中创建 `findings.md`** — 使用 [templates/findings.md](templates/findings.md) 作为参考
3. **在你的项目中创建 `progress.md`** — 使用 [templates/progress.md](templates/progress.md) 作为参考
4. **在做决定前重新阅读计划** — 刷新注意力窗口中的目标
5. **每个阶段后更新** — 标记完成，记录错误

> **注意：** 所有三个规划文件都应该创建在你当前的工作目录（你的项目根目录）中，而不是在技能的安装文件夹中。

## 核心模式

```
Context Window = RAM（易失，有限）
Filesystem = Disk（持久，无限）

→ 任何重要的内容都要写入磁盘。
```

## 文件用途

| 文件 | 用途 | 何时更新 |
|------|---------|----------------|
| `task_plan.md` | 阶段、进度、决策 | 每个阶段后 |
| `findings.md` | 研究、发现 | 任何发现后 |
| `progress.md` | 会话日志、测试结果 | 整个会话期间 |

## 关键规则

### 1. 先创建计划

永远不要在没有 `task_plan.md` 的情况下开始复杂任务。不可协商。

### 2. 2次操作规则

> "每进行2次查看/浏览器/搜索操作后，**立即**将关键发现保存到文本文件中。"

这可以防止视觉/多模态信息丢失。

### 3. 先阅读再决定

在做重大决定之前，阅读计划文件。这会将目标保持在你的注意力窗口中。

### 4. 行动后更新

完成任何阶段后：
- 标记阶段状态：`in_progress` → `complete`
- 记录遇到的任何错误
- 注意创建/修改的文件

### 5. 记录所有错误

每个错误都要进入计划文件。这可以积累知识并防止重复。

```markdown
## 遇到的错误
| 错误 | 尝试 | 解决方案 |
|-------|---------|------------|
| FileNotFoundError | 1 | 创建默认配置 |
| API timeout | 2 | 添加重试逻辑 |
```

### 6. 永远不要重复失败

```
if action_failed:
    next_action != same_action
```

跟踪你尝试过的内容。改变方法。

## 3次错误协议

```
尝试 1: 诊断并修复
  → 仔细阅读错误
  → 识别根本原因
  → 应用针对性修复

尝试 2: 替代方法
  → 同样的错误？尝试不同的方法
  → 不同的工具？不同的库？
  → 永远不要重复完全相同的失败操作

尝试 3: 更广泛的重新思考
  → 质疑假设
  → 搜索解决方案
  → 考虑更新计划

3次失败后: 升级给用户
  → 解释你尝试过的内容
  → 分享具体的错误
  → 请求指导
```

## 读/写决策矩阵

| 情况 | 操作 | 原因 |
|-----------|--------|--------|
| 刚写了一个文件 | 不要读取 | 内容仍在上下文中 |
| 查看了图片/PDF | 立即写入发现 | 多模态 → 在丢失前转为文本 |
| 浏览器返回了数据 | 写入文件 | 截图不会持久保存 |
| 开始新阶段 | 读取计划/发现 | 如果上下文陈旧则重新定位 |
| 发生了错误 | 读取相关文件 | 需要当前状态来修复 |
| 在中断后恢复 | 读取所有规划文件 | 恢复状态 |

## 5问题重启测试

如果你能回答这些问题，你的上下文管理就是可靠的：

| 问题 | 答案来源 |
|----------|---------------|
| 我在哪里？ | task_plan.md 中的当前阶段 |
| 我要去哪里？ | 剩余阶段 |
| 目标是什么？ | 计划中的目标声明 |
| 我学到了什么？ | findings.md |
| 我做了什么？ | progress.md |

## 何时使用此模式

**用于：**
- 多步骤任务（3+ 步骤）
- 研究任务
- 构建/创建项目
- 跨越多个工具调用的任务
- 任何需要组织的任务

**跳过用于：**
- 简单问题
- 单文件编辑
- 快速查找

## 模板

复制这些模板来开始：

- [templates/task_plan.md](templates/task_plan.md) — 阶段跟踪
- [templates/findings.md](templates/findings.md) — 研究存储
- [templates/progress.md](templates/progress.md) — 会话日志

## 脚本

用于自动化的辅助脚本：

- `scripts/init-session.sh` — 初始化所有规划文件
- `scripts/check-complete.sh` — 验证所有阶段完成

## 高级主题

- **Manus 原则：** 参见 [reference.md](reference.md)
- **真实示例：** 参见 [examples.md](examples.md)

## 反模式

| 不要 | 改为这样做 |
|-------|------------|
| 使用 TodoWrite 进行持久化 | 创建 task_plan.md 文件 |
| 声明一次目标然后忘记 | 在做决定前重新阅读计划 |
| 隐藏错误并静默重试 | 将错误记录到计划文件中 |
| 将所有内容塞入上下文 | 将大内容存储在文件中 |
| 立即开始执行 | 首先创建计划文件 |
| 重复失败的操作 | 跟踪尝试，改变方法 |
| 在技能目录中创建文件 | 在你的项目中创建文件 |
