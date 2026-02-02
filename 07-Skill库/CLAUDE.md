# Skill 库

本目录包含 50+ 个专业 Skill，用于扩展 Claude 的能力。每个 Skill 都是一个自包含的知识包，提供特定领域的工作流程、最佳实践和工具集成。

## 什么是 Skill

Skill 是模块化的能力扩展包，将 Claude 从通用智能体转变为特定领域的专家。每个 Skill 包含：

- **SKILL.md** - 核心指导文档，包含元数据和详细说明
- **scripts/** - 可执行脚本（Python、Bash 等）
- **references/** - 参考资料和文档
- **assets/** - 模板、字体、图标等资源文件

## Skill 分类

### 核心工作流程
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [using-superpowers](using-superpowers/) | Skill 使用基础规则 | 每次对话开始时 |
| [brainstorming](brainstorming/) | 创意构思与设计 | 任何创造性工作之前 |
| [writing-plans](writing-plans/) | 编写实施计划 | 有多步骤任务规范时 |
| [executing-plans](executing-plans/) | 执行书面计划 | 有书面实施计划时 |

### 开发方法论
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [test-driven-development](test-driven-development/) | 测试驱动开发 | 实现功能或修复 bug 之前 |
| [systematic-debugging](systematic-debugging/) | 系统化调试 | 遇到任何 bug 或测试失败时 |
| [requesting-code-review](requesting-code-review/) | 请求代码审查 | 完成任务或实现主要功能时 |
| [receiving-code-review](receiving-code-review/) | 接收代码审查 | 收到代码审查反馈时 |
| [finishing-a-development-branch](finishing-a-development-branch/) | 完成开发分支 | 实施完成、测试通过时 |
| [verification-before-completion](verification-before-completion/) | 完成前验证 | 声称工作完成之前 |
| [using-git-worktrees](using-git-worktrees/) | 使用 Git Worktrees | 开始需要隔离的功能工作时 |

### 上下文工程
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [context-fundamentals](context-fundamentals/) | 上下文工程基础 | 理解上下文窗口、设计智能体架构时 |
| [context-optimization](context-optimization/) | 上下文优化 | 优化上下文、降低 token 成本时 |
| [context-compression](context-compression/) | 上下文压缩 | 实现压缩、总结对话历史时 |
| [context-degradation](context-degradation/) | 上下文退化诊断 | 诊断上下文问题、修复失败时 |
| [filesystem-context](filesystem-context/) | 文件系统上下文 | 卸载上下文到文件、动态上下文发现时 |
| [memory-systems](memory-systems/) | 智能体内存系统 | 实现跨会话持久化、构建知识图谱时 |

### 多智能体架构
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [multi-agent-patterns](multi-agent-patterns/) | 多智能体架构模式 | 设计多智能体系统、实现协调模式时 |
| [dispatching-parallel-agents](dispatching-parallel-agents/) | 并行智能体调度 | 面对 2+ 个独立可并行任务时 |
| [subagent-driven-development](subagent-driven-development/) | 子智能体驱动开发 | 执行包含独立任务的实施计划时 |
| [hosted-agents](hosted-agents/) | 托管智能体 | 构建后台智能体、沙盒执行环境时 |
| [bdi-mental-states](bdi-mental-states/) | BDI 心理状态建模 | 建模智能体心理状态、实现 BDI 架构时 |

### 工具设计与 MCP
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [tool-design](tool-design/) | 智能体工具设计 | 设计智能体工具、创建工具描述时 |
| [mcp-builder](mcp-builder/) | MCP 服务器开发 | 构建 MCP 服务器、集成外部 API 时 |
| [project-development](project-development/) | LLM 项目开发 | 启动 LLM 项目、设计批处理管道时 |

### 评估与质量
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [evaluation](evaluation/) | 智能体评估 | 评估智能体性能、构建测试框架时 |
| [advanced-evaluation](advanced-evaluation/) | 高级评估技术 | 实现 LLM-as-judge、比较模型输出时 |

### 文件格式处理
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [docx](docx/) | Word 文档处理 | 创建、编辑、分析 .docx 文件时 |
| [xlsx](xlsx/) | Excel 表格处理 | 创建、编辑、分析电子表格时 |
| [pptx](pptx/) | PowerPoint 演示文稿 | 创建、编辑演示文稿时 |
| [pdf](pdf/) | PDF 处理 | 提取文本、创建、合并 PDF 时 |

### 前端与设计
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [frontend-design](frontend-design/) | 前端设计 | 构建网页组件、页面、应用时 |
| [ui-ux-pro-max](ui-ux-pro-max/) | UI/UX 专业设计 | 设计 UI/UX、实现界面元素时 |
| [theme-factory](theme-factory/) | 主题工厂 | 为工件应用主题样式时 |
| [canvas-design](canvas-design/) | Canvas 视觉设计 | 创建海报、艺术作品、静态设计时 |
| [algorithmic-art](algorithmic-art/) | 算法艺术 | 使用代码创建生成艺术时 |

### 内容创作
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [doc-coauthoring](doc-coauthoring/) | 文档协作编写 | 编写文档、提案、技术规范时 |
| [internal-comms](internal-comms/) | 内部沟通 | 编写内部通讯、状态报告时 |
| [writing-skills](writing-skills/) | Skill 编写 | 创建新 Skill、编辑现有 Skill 时 |
| [skill-creator](skill-creator/) | Skill 创建指南 | 创建有效 Skill 时 |

### 特定平台集成
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [obsidian-markdown](obsidian-markdown/) | Obsidian Markdown | 创建、编辑 Obsidian 风格 Markdown 时 |
| [obsidian-bases](obsidian-bases/) | Obsidian Bases | 创建、编辑 .base 数据库文件时 |
| [json-canvas](json-canvas/) | JSON Canvas | 创建、编辑 .canvas 可视化文件时 |
| [notebooklm](notebooklm/) | NotebookLM | 查询 NotebookLM 笔记本时 |
| [slack-gif-creator](slack-gif-creator/) | Slack GIF 创建 | 为 Slack 创建动画 GIF 时 |
| [remotion](remotion/) | Remotion 视频 | 使用 Remotion 创建 React 视频时 |
| [web-artifacts-builder](web-artifacts-builder/) | Web 工件构建器 | 创建复杂多组件 HTML 工件时 |
| [brand-guidelines](brand-guidelines/) | 品牌指南 | 应用 Anthropic 品牌颜色和排版时 |

### 测试与验证
| Skill | 描述 | 触发条件 |
|-------|------|----------|
| [webapp-testing](webapp-testing/) | Web 应用测试 | 测试本地 Web 应用、调试 UI 时 |
| [planning-with-files](planning-with-files/) | 文件化规划 | 启动复杂多步骤任务、研究项目时 |

## 使用规则

### 黄金法则

**只要有 1% 的可能性某个 Skill 适用，就必须调用它。**

这不是可选项，不是可以理性化回避的。这是强制要求。

### 调用流程

```
用户消息接收
    ↓
是否有 Skill 可能适用？
    ↓ 是（即使只有 1% 可能性）
调用 Skill 工具
    ↓
宣布："使用 [skill] 来 [目的]"
    ↓
是否有检查清单？
    ↓ 是
为每个项目创建 TodoWrite 待办事项
    ↓
严格遵循 Skill 指导
```

### 危险信号

以下想法意味着你在理性化，必须停止：

| 错误想法 | 现实 |
|---------|------|
| "这只是个简单问题" | 问题也是任务，检查 Skill |
| "我需要先获取更多上下文" | Skill 检查在澄清问题之前 |
| "让我先探索代码库" | Skill 告诉你如何探索 |
| "我可以快速查看 git/文件" | 文件缺乏对话上下文，先检查 Skill |
| "这不需要正式 Skill" | 如果 Skill 存在，就用它 |
| "我记得这个 Skill" | Skill 会演进，读取当前版本 |
| "这不算任务" | 行动 = 任务，检查 Skill |
| "Skill 太过了" | 简单的事情会变复杂，用 Skill 预防 |

### Skill 优先级

当多个 Skill 可能适用时，按以下顺序：

1. **流程 Skill 优先**（brainstorming、debugging）- 决定如何接近任务
2. **实施 Skill 其次**（frontend-design、mcp-builder）- 指导执行

例如：
- "让我们构建 X" → 先 brainstorming，然后实施 Skill
- "修复这个 bug" → 先 debugging，然后领域特定 Skill

## Skill 结构规范

每个 Skill 必须包含：

```yaml
---
name: skill-name
description: 明确的触发条件描述，包含关键词和场景
---
```

### 描述编写指南

描述必须清晰说明何时使用该 Skill。例如：

```yaml
# 好的描述
"Use when implementing any feature or bugfix, before writing implementation code"

"Use when the user asks to 'design multi-agent system', 'implement supervisor pattern', 
'create swarm architecture', 'coordinate multiple agents'"

"Use when starting any conversation - establishes how to find and use skills"
```

### 内容组织

- **简洁是关键** - 上下文窗口是公共资源
- **默认假设：Claude 已经很聪明** - 只添加 Claude 没有的知识
- **设置适当的自由度** - 根据任务脆弱性和可变性调整指导级别

## 创建新 Skill

参考 [skill-creator](skill-creator/) Skill 获取详细指南。

快速检查清单：
- [ ] 创建目录 `skill-name/`
- [ ] 编写 `SKILL.md`，包含 YAML frontmatter
- [ ] 添加清晰的 `name` 和 `description`
- [ ] 组织内容：核心概念、使用时机、详细指导
- [ ] 添加必要的 `scripts/`、`references/`、`assets/`
- [ ] 测试 Skill 触发逻辑

## 许可证

各 Skill 的许可证信息见其目录中的 LICENSE.txt 文件。
