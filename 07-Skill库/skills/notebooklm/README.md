<div align="center">

# NotebookLM Claude Code 技能

**让 [Claude Code](https://github.com/anthropics/claude-code) 直接与 NotebookLM 对话，基于您上传的文档获得有来源依据的答案**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-purple.svg)](https://www.anthropic.com/news/skills)
[![Based on](https://img.shields.io/badge/Based%20on-NotebookLM%20MCP-green.svg)](https://github.com/PleasePrompto/notebooklm-mcp)
[![GitHub](https://img.shields.io/github/stars/PleasePrompto/notebooklm-skill?style=social)](https://github.com/PleasePrompto/notebooklm-skill)

> 使用此技能直接从 Claude Code 查询您的 Google NotebookLM 笔记本，获得来自 Gemini 的有来源依据、带引用的答案。浏览器自动化、库管理、持久化认证。大幅减少幻觉——答案仅来自您上传的文档。

[安装](#installation) • [快速开始](#quick-start) • [为什么选择 NotebookLM](#why-notebooklm-not-local-rag) • [工作原理](#how-it-works) • [MCP 替代方案](https://github.com/PleasePrompto/notebooklm-mcp)

</div>

---

## ⚠️ 重要：仅限本地 Claude Code

**此技能仅适用于本地 [Claude Code](https://github.com/anthropics/claude-code) 安装，不适用于 Web UI。**

Web UI 在沙箱中运行技能，没有网络访问权限，而此技能需要浏览器自动化的网络访问。您必须在本地机器上使用 [Claude Code](https://github.com/anthropics/claude-code)。

---

## 问题所在

当您告诉 [Claude Code](https://github.com/anthropics/claude-code) "搜索我的本地文档"时，会发生以下情况：
- **巨大的 token 消耗**：搜索文档意味着反复读取多个文件
- **不准确的检索**：搜索关键词，遗漏文档之间的上下文和联系
- **幻觉**：当它找不到某些内容时，会编造看似合理的 API
- **手动复制粘贴**：在 NotebookLM 浏览器和编辑器之间不断切换

## 解决方案

此 Claude Code 技能让 [Claude Code](https://github.com/anthropics/claude-code) 直接与 [**NotebookLM**](https://notebooklm.google/) 对话——Google 的**有来源依据的知识库**，由 Gemini 2.5 驱动，专门从您上传的文档提供智能、综合的答案。

```
您的任务 → Claude 询问 NotebookLM → Gemini 综合答案 → Claude 编写正确的代码
```

**不再有复制粘贴的麻烦**：Claude 直接提问并在 CLI 中立即获得答案。它通过自动跟进建立深入理解，获得具体的实现细节、边缘情况和最佳实践。

---

## 为什么选择 NotebookLM，而不是本地 RAG？

| 方法 | Token 成本 | 设置时间 | 幻觉 | 答案质量 |
|------|------------|----------|------|----------|
| **将文档提供给 Claude** | 🔴 非常高（多次文件读取） | 即时 | 是——填补空白 | 检索效果不稳定 |
| **网络搜索** | 🟡 中等 | 即时 | 高——来源不可靠 | 时好时坏 |
| **本地 RAG** | 🟡 中高 | 数小时（嵌入、分块） | 中等——检索空白 | 取决于设置 |
| **NotebookLM 技能** | 🟢 最小 | 5 分钟 | **最小**——仅基于来源 | 专家综合 |

### 是什么让 NotebookLM 更优越？

1. **由 Gemini 预处理**：一次上传文档，立即获得专家知识
2. **自然语言问答**：不只是检索——真正的理解和综合
3. **多源关联**：跨 50+ 文档连接信息
4. **带引用支持**：每个答案都包含来源引用
5. **无需基础设施**：无需向量数据库、嵌入或分块策略

---

## 安装

### 最简单的安装：

```bash
# 1. 创建技能目录（如果不存在）
mkdir -p ~/.claude/skills

# 2. 克隆此仓库
cd ~/.claude/skills
git clone https://github.com/PleasePrompto/notebooklm-skill notebooklm

# 3. 完成！打开 Claude Code 并说：
"我有哪些技能？"
```

当您第一次使用技能时，它会自动：
- 创建隔离的 Python 环境（`.venv`）
- 安装所有依赖，包括 **Google Chrome**
- 使用 Chrome（不是 Chromium）设置浏览器自动化以获得最大可靠性
- 所有内容都包含在技能文件夹中

**注意：** 设置使用真正的 Chrome 而不是 Chromium，以获得跨平台可靠性、一致的浏览器指纹和与 Google 服务的更好反检测能力

---

## 快速开始

### 1. 检查您的技能

在 Claude Code 中说：
```
"我有哪些技能？"
```

Claude 将列出您的可用技能，包括 NotebookLM。

### 2. 与 Google 认证（一次性）

```
"设置 NotebookLM 认证"
```
*Chrome 窗口打开 → 使用您的 Google 账户登录*

### 3. 创建您的知识库

前往 [notebooklm.google.com](https://notebooklm.google.com) → 创建笔记本 → 上传您的文档：
- 📄 PDF、Google Docs、markdown 文件
- 🔗 网站、GitHub 仓库
- 🎥 YouTube 视频
- 📚 每个笔记本多个来源

分享：**⚙️ 分享 → 知道链接的任何人 → 复制**

### 4. 添加到您的库

**选项 A：让 Claude 自动发现（智能添加）**
```
"查询这个笔记本关于其内容并添加到我的库：[your-link]"
```
Claude 将自动查询笔记本以发现其内容，然后添加适当的元数据。

**选项 B：手动添加**
```
"将此 NotebookLM 添加到我的库：[your-link]"
```
Claude 会询问名称和主题，然后保存以供将来使用。

### 5. 开始研究

```
"我的 React 文档关于 hooks 说了什么？"
```

Claude 自动选择正确的笔记本并直接从 NotebookLM 获得答案。

---

## 工作原理

这是一个 **Claude Code 技能**——一个本地文件夹，包含 Claude Code 在需要时可以使用的指令和脚本。与 [MCP 服务器版本](https://github.com/PleasePrompto/notebooklm-mcp) 不同，这直接在 Claude Code 中运行，无需单独的服务器。

### 与 MCP 服务器的关键区别

| 特性 | 此技能 | MCP 服务器 |
|------|--------|------------|
| **协议** | Claude 技能 | 模型上下文协议 |
| **安装** | 克隆到 `~/.claude/skills` | `claude mcp add ...` |
| **会话** | 每个问题都是新浏览器 | 持久聊天会话 |
| **兼容性** | 仅限 Claude Code（本地） | Claude Code、Codex、Cursor 等 |
| **语言** | Python | TypeScript |
| **分发** | Git 克隆 | npm 包 |

### 架构

```
~/.claude/skills/notebooklm/
├── SKILL.md              # Claude 的指令
├── scripts/              # Python 自动化脚本
│   ├── ask_question.py   # 查询 NotebookLM
│   ├── notebook_manager.py # 库管理
│   └── auth_manager.py   # Google 认证
├── .venv/                # 隔离的 Python 环境（自动创建）
└── data/                 # 本地笔记本库
```

当您提到 NotebookLM 或发送笔记本 URL 时，Claude：
1. 加载技能指令
2. 运行适当的 Python 脚本
3. 打开浏览器，提出您的问题
4. 直接返回答案给您
5. 使用该知识帮助您完成任务

---

## 核心功能

### **有来源依据的响应**
NotebookLM 通过仅基于您上传的文档回答，显著减少幻觉。如果信息不可用，它会表示不确定性而不是编造内容。

### **直接集成**
无需在浏览器和编辑器之间复制粘贴。Claude 以编程方式提问和接收答案。

### **智能库管理**
保存带标签和描述的 NotebookLM 链接。Claude 自动为您的任务选择正确的笔记本。

### **自动认证**
一次性 Google 登录，然后认证在会话之间持久化。

### **自包含**
所有内容都在带有隔离 Python 环境的技能文件夹中运行。没有全局安装。

### **类人自动化**
使用逼真的打字速度和交互模式以避免检测。

---

## 常用命令

| 您说的话 | 会发生什么 |
|--------------|--------------|
| *"设置 NotebookLM 认证"* | 打开 Chrome 进行 Google 登录 |
| *"将 [link] 添加到我的 NotebookLM 库"* | 保存带元数据的笔记本 |
| *"显示我的 NotebookLM 笔记本"* | 列出所有保存的笔记本 |
| *"询问我的 API 文档关于 [topic]"* | 查询相关笔记本 |
| *"使用 React 笔记本"* | 设置活动笔记本 |
| *"清除 NotebookLM 数据"* | 全新开始（保留库） |

---

## 真实示例

### 示例 1：车间手册查询

**用户询问**："查看我的 Suzuki GSR 600 车间手册，了解制动液类型、发动机油规格和后轴扭矩。"

**Claude 自动**：
- 与 NotebookLM 认证
- 询问关于每个规格的综合性问题
- 在提示"这就是您需要知道的全部吗？"时跟进
- 提供准确的规格：DOT 4 制动液、SAE 10W-40 油、100 N·m 后轴扭矩

![NotebookLM 聊天示例](images/example_notebookchat.png)

### 示例 2：无幻觉构建

**您**："我需要为 Gmail 垃圾邮件过滤构建一个 n8n 工作流。使用我的 n8n 笔记本。"

**Claude 的内部过程：**
```
→ 加载 NotebookLM 技能
→ 激活 n8n 笔记本
→ 询问综合性问题并跟进
→ 综合来自多个查询的完整答案
```

**结果**：第一次就获得可用的工作流，无需调试幻觉 API。

---

## 技术细节

### 核心技术
- **Patchright**：浏览器自动化库（基于 Playwright）
- **Python**：此技能的实现语言
- **隐身技术**：类人打字和交互模式

注意：MCP 服务器使用相同的 Patchright 库，但通过 TypeScript/npm 生态系统。

### 依赖
- **patchright==1.55.2**：浏览器自动化
- **python-dotenv==1.0.0**：环境配置
- 首次使用时自动安装在 `.venv` 中

### 数据存储

所有数据都存储在技能目录中：

```
~/.claude/skills/notebooklm/data/
├── library.json       - 您的笔记本库及元数据
├── auth_info.json     - 认证状态信息
└── browser_state/     - 浏览器 cookie 和会话数据
```

**重要安全说明：**
- `data/` 目录包含敏感的认证数据和个人笔记本
- 它通过 `.gitignore` 自动从 git 中排除
- 永远不要手动提交或分享 `data/` 目录的内容

### 会话模型

与 MCP 服务器不同，此技能使用**无状态模型**：
- 每个问题都打开一个新浏览器
- 提问，获得答案
- 添加跟进提示以鼓励 Claude 提出更多问题
- 立即关闭浏览器

这意味着：
- 没有持久聊天上下文
- 每个问题都是独立的
- 但您的笔记本库会持久化
- **跟进机制**：每个答案都包含"这就是您需要知道的全部吗？"以提示 Claude 提出综合性跟进问题

对于多步骤研究，Claude 在需要时自动提出跟进问题。

---

## 限制

### 技能特定
- **仅限本地 Claude Code** - 不适用于 Web UI（沙箱限制）
- **没有会话持久化** - 每个问题都是独立的
- **没有跟进上下文** - 无法引用"之前的答案"

### NotebookLM
- **速率限制** - 免费版有每日查询限制
- **手动上传** - 您必须先将文档上传到 NotebookLM
- **分享要求** - 笔记本必须公开分享

---

## 常见问题

**为什么这在 Claude Web UI 中不起作用？**
Web UI 在沙箱中运行技能，没有网络访问权限。浏览器自动化需要网络访问才能到达 NotebookLM。

**这与 MCP 服务器有何不同？**
这是一个更简单的、基于 Python 的实现，直接作为 Claude 技能运行。MCP 服务器功能更丰富，具有持久会话，并与多个工具（Codex、Cursor 等）兼容。

**我可以同时使用此技能和 MCP 服务器吗？**
可以！它们服务于不同的目的。使用技能进行快速的 Claude Code 集成，使用 MCP 服务器进行持久会话和多工具支持。

**如果 Chrome 崩溃怎么办？**
运行：`"清除 NotebookLM 浏览器数据"` 然后重试。

**我的 Google 账户安全吗？**
Chrome 在您的本地机器上运行。您的凭据永远不会离开您的计算机。如果您担心，请使用专用的 Google 账户。

---

## 故障排除

### 找不到技能
```bash
# 确保它在正确的位置
ls ~/.claude/skills/notebooklm/
# 应该显示：SKILL.md、scripts/ 等
```

### 认证问题
说：`"重置 NotebookLM 认证"`

### 浏览器崩溃
说：`"清除 NotebookLM 浏览器数据"`

### 依赖问题
```bash
# 如果需要手动重新安装
cd ~/.claude/skills/notebooklm
rm -rf .venv
python -m venv .venv
source .venv/bin/activate  # 或 Windows 上的 .venv\Scripts\activate
pip install -r requirements.txt
```

---

## 免责声明

此工具自动化与 NotebookLM 的浏览器交互，使您的工作流更高效。但是，一些友好的提醒：

**关于浏览器自动化：**
虽然我内置了人性化功能（逼真的打字速度、自然延迟、鼠标移动）以使自动化行为更自然，但我不能保证 Google 不会检测或标记自动化使用。我建议使用专用的 Google 账户进行自动化，而不是您的主要账户——就像网络抓取一样：可能没问题，但安全第一！

**关于 CLI 工具和 AI 代理：**
CLI 工具如 Claude Code、Codex 和类似的 AI 驱动助手非常强大，但它们可能会犯错。请谨慎并注意使用：
- 在提交或部署之前始终审查更改
- 首先在安全环境中测试
- 保留重要工作的备份
- 记住：AI 代理是助手，不是绝对正确的神谕

我为自己构建了这个工具，因为我厌倦了在 NotebookLM 和编辑器之间的复制粘贴。我分享它希望它也能帮助其他人，但我不能对可能发生的任何问题、数据丢失或账户问题负责。请自行斟酌使用。

也就是说，如果您遇到问题或有疑问，请随时在 GitHub 上打开 issue。我很乐意帮助排除故障！

---

## 致谢

此技能受到我的 [**NotebookLM MCP 服务器**](https://github.com/PleasePrompto/notebooklm-mcp) 的启发，并作为 Claude Code 技能的替代实现：
- 两者都使用 Patchright 进行浏览器自动化（MCP 使用 TypeScript，技能使用 Python）
- 技能版本直接在 Claude Code 中运行，无需 MCP 协议
- 针对技能架构优化的无状态设计

如果您需要：
- **持久会话** → 使用 [MCP 服务器](https://github.com/PleasePrompto/notebooklm-mcp)
- **多工具支持**（Codex、Cursor）→ 使用 [MCP 服务器](https://github.com/PleasePrompto/notebooklm-mcp)
- **快速 Claude Code 集成** → 使用此技能

---

## 总结

**没有此技能**：NotebookLM 在浏览器中 → 复制答案 → 粘贴到 Claude → 复制下一个问题 → 回到浏览器...

**有此技能**：Claude 直接研究 → 立即获得答案 → 编写正确的代码

停止复制粘贴的麻烦。开始在 Claude Code 中直接获得准确、有依据的答案。

```bash
# 30 秒开始
cd ~/.claude/skills
git clone https://github.com/PleasePrompto/notebooklm-skill notebooklm
# 打开 Claude Code："我有哪些技能？"
```

---

<div align="center">

作为我的 [NotebookLM MCP 服务器](https://github.com/PleasePrompto/notebooklm-mcp) 的 Claude Code 技能改编构建

用于 Claude Code 中的有来源依据、基于文档的研究

</div>
