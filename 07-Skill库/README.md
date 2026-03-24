# AI 智能体 Skill 库
> 一套完整的 Claude Skill 集合，用于扩展 AI 智能体的专业能力

## 简介
本 Skill 库包含 **44 个专业 Skill**，涵盖软件开发、上下文工程、多智能体架构、文件处理、前端设计、网络搜索、自动化工具、产品管理与营销、工具与集成开发等多个领域。每个 Skill 都是自包含的知识包，为 Claude 提供特定领域的专业指导、工作流程和工具集成。

## 快速开始
### 对于 Claude

Claude 会在每次对话开始时自动读取本目录下的 `CLAUDE.md` 文件，了解 Skill 库的结构和使用规则。

**核心原则**：只要有 1% 的可能性某个 Skill 适用，就必须调用它。

### 对于用户

当你向 Claude 提出请求时，Claude 会自动：
1. 检查是否有适用的 Skill
2. 调用相关 Skill 获取专业指导
3. 按照 Skill 的最佳实践执行任务

你不需要手动指定使用哪个 Skill，Claude 会根据你的请求内容自动判断。

## Skill 目录

### 核心工作流程（6 个）

| Skill | 用途 |
|-------|------|
| **using-superpowers** | Skill 系统的基础规则，每次对话开始时使用 |
| **brainstorming** | 将想法转化为完整设计，任何创造性工作前使用 |
| **writing-plans** | 编写详细的实施计划 |
| **planning-with-files** | 使用文件进行复杂任务规划 |
| **skill-creator** | Skill 创建完整指南（官方版） |
| **write-a-prd** | 编写产品需求文档（PRD） |

### 开发方法论（7 个）

| Skill | 用途 |
|-------|------|
| **test-driven-development** | 测试驱动开发（TDD） |
| **systematic-debugging** | 系统化调试方法 |
| **requesting-code-review** | 请求代码审查 |
| **receiving-code-review** | 处理代码审查反馈 |
| **finishing-a-development-branch** | 完成开发分支 |
| **verification-before-completion** | 完成前的验证检查 |
| **using-git-worktrees** | 使用 Git Worktrees 进行隔离开发 |

### 上下文工程（2 个）

| Skill | 用途 |
|-------|------|
| **context-optimization** | 上下文优化技术 |
| **context-compression** | 上下文压缩与总结 |

### 多智能体架构（4 个）

| Skill | 用途 |
|-------|------|
| **multi-agent-patterns** | 多智能体架构设计模式 |
| **dispatching-parallel-agents** | 并行智能体调度 |
| **subagent-driven-development** | 子智能体驱动开发 |
| **hosted-agents** | 托管智能体与沙盒环境 |

### 工具设计与集成（3 个）

| Skill | 用途 |
|-------|------|
| **tool-design** | 智能体工具设计 |
| **mcp-builder** | MCP（Model Context Protocol）服务器开发 |
| **project-development** | LLM 项目开发方法论 |

### 评估与质量（1 个）

| Skill | 用途 |
|-------|------|
| **advanced-evaluation** | 高级评估技术（LLM-as-judge） |

### 文件格式处理（3 个）

| Skill | 用途 |
|-------|------|
| **file-reader** | 通用文件读取器（Excel、Word、PPT、PDF 等） |
| **pptx** | Microsoft PowerPoint 演示文稿 |
| **pdf** | PDF 文档处理 |

### 前端与设计（4 个）

| Skill | 用途 |
|-------|------|
| **frontend-design** | 前端界面设计 |
| **ui-ux-pro-max** | UI/UX 专业设计 |
| **theme-factory** | 主题样式工厂 |
| **web-artifacts-builder** | Web 工件构建器 |

### 内容创作（2 个）

| Skill | 用途 |
|-------|------|
| **doc-coauthoring** | 文档协作编写 |
| **writing-skills** | Skill 编写指南 |

### 网络搜索与信息获取（3 个）

| Skill | 用途 |
|-------|------|
| **summarize** | 总结 URL、文件和 YouTube 内容 |
| **tavily** | Tavily AI 优化搜索 API |
| **weather** | 天气信息查询 |

### 自动化与工具（3 个）

| Skill | 用途 |
|-------|------|
| **imap-smtp-email** | IMAP/SMTP 邮件收发 |
| **skill-vetter** | Skill 安全检查与审查 |
| **scrapling-skills** | 网页爬虫与数据提取 |

### 工具与集成开发（3 个）

| Skill | 用途 |
|-------|------|
| **interaction-design** | 交互设计模式与最佳实践 |
| **request-analyzer** | 请求分析与优化 |
| **github-skill-forge** | 从 GitHub 仓库创建 Skills |

### 产品管理与营销（2 个）

| Skill | 用途 |
|-------|------|
| **ab-test-setup** | A/B 测试设置与分析 |
| **analytics-tracking** | 数据分析与追踪配置 |

## Skill 结构

每个 Skill 目录包含：
```
skill-name/
├── SKILL.md              # 核心指导文档（必需）
├── LICENSE.txt           # 许可证信息（如适用）
├── scripts/              # 可执行脚本
│   ├── script.py
│   └── ...
├── references/           # 参考资料
│   ├── guide.md
│   └── ...
└── assets/               # 资源文件
    ├── templates/
    ├── fonts/
    └── ...
```

### SKILL.md 格式

```yaml
---
name: skill-name
description: 清晰的触发条件描述
---

# Skill 标题

## 何时使用

## 核心概念

## 详细指导

## 最佳实践
```

## 使用示例

### 示例 1：开发新功能

```
用户：帮我实现一个用户登录功能

Claude：
1. 调用 test-driven-development Skill
2. 调用 frontend-design Skill（如果需要 UI）
3. 按照 TDD 流程：红-绿-重构
4. 完成时调用 verification-before-completion
```

### 示例 2：调试问题

```
用户：这个 API 调用返回 500 错误

Claude：
1. 调用 systematic-debugging Skill
2. 按照系统化调试流程诊断
3. 找到根本原因并修复
```

### 示例 3：创建文档

```
用户：帮我写一份技术设计文档

Claude：
1. 调用 brainstorming Skill 探索需求
2. 调用 doc-coauthoring Skill 编写文档
3. 输出专业的设计文档
```

## 创建新 Skill

参考 [writing-skills](writing-skills/SKILL.md) 获取完整的 Skill 创建指南。

### 快速步骤
1. 创建目录 `my-skill/`
2. 编写 `SKILL.md`，包含 YAML frontmatter
3. 添加 `name` 和 `description`
4. 编写清晰的指导内容
5. 添加必要的脚本和资源

### 设计原则

- **简洁**：上下文窗口是公共资源，只添加必要信息
- **明确**：描述必须清晰说明何时使用该 Skill
- **实用**：提供可执行的工作流程，而非抽象概念
- **模块化**：每个 Skill 应该是自包含的

## 贡献指南

1. **保持简洁**：挑战每个信息片段的必要性
2. **明确触发条件**：描述应该让用户和 Claude 都能明确知道何时使用
3. **提供示例**：具体的例子比抽象的解释更有用
4. **测试验证**：确保 Skill 能够被正确触发和使用

## 许可证

各 Skill 的许可证信息见其目录中的 LICENSE.txt 文件。部分 Skill 使用专有许可证，部分使用开源许可证。

## 相关资源

- [CLAUDE.md](CLAUDE.md) - Claude 使用的完整 Skill 库参考
- [writing-skills/SKILL.md](writing-skills/SKILL.md) - Skill 创建指南
- [using-superpowers/SKILL.md](using-superpowers/SKILL.md) - Skill 使用规则

---

> **提示**：本 Skill 库持续更新中。如需新增 Skill 或改进现有 Skill，请参考 writing-skills 指南。
