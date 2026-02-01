# 07-Skill库

## 简介

本模块提供47个可复用的Skill功能，覆盖文档处理、设计工具、开发工作流、代码质量、上下文管理、多代理系统、评估优化、工具集成、专业领域等9大类别。

## 快速导航

### 按类别

| 类别 | Skill数量 | 主要用途 |
|------|----------|---------|
| [文档处理](#文档处理类) | 4个 | Word/PPT/PDF/Excel生成 |
| [设计工具](#设计工具类) | 7个 | UI/UX设计、视觉设计 |
| [开发工作流](#开发工作流类) | 8个 | 项目规划、代码开发 |
| [代码质量](#代码质量类) | 6个 | 测试、调试、代码审查 |
| [上下文管理](#上下文管理类) | 4个 | 上下文优化、压缩 |
| [多代理系统](#多代理系统类) | 3个 | 多代理协作、记忆系统 |
| [评估优化](#评估优化类) | 3个 | 性能评估、Skill创建 |
| [工具集成](#工具集成类) | 5个 | MCP、NotebookLM等 |
| [专业领域](#专业领域类) | 7个 | BDI、写作、头脑风暴 |

## 文档处理类

| Skill | 功能 | 使用方式 |
|-------|------|---------|
| [docx](skills/docx/SKILL.md) | Word文档处理 | `python 07-Skill库/skills/docx/scripts/document.py` |
| [pptx](skills/pptx/SKILL.md) | PPT演示文稿 | `python 07-Skill库/skills/pptx/scripts/generate.py` |
| [pdf](skills/pdf/SKILL.md) | PDF处理 | `python 07-Skill库/skills/pdf/scripts/convert.py` |
| [xlsx](skills/xlsx/SKILL.md) | Excel处理 | 脚本调用 |

## 设计工具类

| Skill | 功能 | 使用方式 |
|-------|------|---------|
| [canvas-design](skills/canvas-design/SKILL.md) | 海报/视觉设计 | Trae MCP |
| [ui-ux-pro-max](skills/ui-ux-pro-max/SKILL.md) | UI/UX设计 | Trae MCP |
| [frontend-design](skills/frontend-design/SKILL.md) | 前端界面设计 | Trae MCP |
| [theme-factory](skills/theme-factory/SKILL.md) | 主题样式 | Trae MCP |
| [brand-guidelines](skills/brand-guidelines/SKILL.md) | 品牌规范 | Trae MCP |
| [algorithmic-art](skills/algorithmic-art/SKILL.md) | 算法艺术 | Trae MCP |
| [slack-gif-creator](skills/slack-gif-creator/SKILL.md) | GIF生成 | Trae MCP |

## 开发工作流类

| Skill | 功能 | 使用方式 |
|-------|------|---------|
| [planning-with-files](skills/planning-with-files/SKILL.md) | 文件规划 | Trae MCP |
| [executing-plans](skills/executing-plans/SKILL.md) | 计划执行 | Trae MCP |
| [subagent-driven-development](skills/subagent-driven-development/SKILL.md) | 子代理开发 | Trae MCP |
| [dispatching-parallel-agents](skills/dispatching-parallel-agents/SKILL.md) | 并行代理 | Trae MCP |
| [writing-plans](skills/writing-plans/SKILL.md) | 编写计划 | Trae MCP |
| [using-git-worktrees](skills/using-git-worktrees/SKILL.md) | Git工作树 | Trae MCP |
| [finishing-a-development-branch](skills/finishing-a-development-branch/SKILL.md) | 分支完成 | Trae MCP |
| [project-development](skills/project-development/SKILL.md) | 项目开发 | Trae MCP |

## 代码质量类

| Skill | 功能 | 使用方式 |
|-------|------|---------|
| [test-driven-development](skills/test-driven-development/SKILL.md) | TDD | Trae MCP |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 系统调试 | Trae MCP |
| [requesting-code-review](skills/requesting-code-review/SKILL.md) | 请求代码审查 | Trae MCP |
| [receiving-code-review](skills/receiving-code-review/SKILL.md) | 接收代码审查 | Trae MCP |
| [webapp-testing](skills/webapp-testing/SKILL.md) | Web测试 | Trae MCP |
| [verification-before-completion](skills/verification-before-completion/SKILL.md) | 完成前验证 | Trae MCP |

## 上下文管理类

| Skill | 功能 | 使用方式 |
|-------|------|---------|
| [context-fundamentals](skills/context-fundamentals/SKILL.md) | 上下文基础 | Trae MCP |
| [context-optimization](skills/context-optimization/SKILL.md) | 上下文优化 | Trae MCP |
| [context-compression](skills/context-compression/SKILL.md) | 上下文压缩 | Trae MCP |
| [context-degradation](skills/context-degradation/SKILL.md) | 上下文退化 | Trae MCP |

## 多代理系统类

| Skill | 功能 | 使用方式 |
|-------|------|---------|
| [multi-agent-patterns](skills/multi-agent-patterns/SKILL.md) | 多代理模式 | Trae MCP |
| [hosted-agents](skills/hosted-agents/SKILL.md) | 托管代理 | Trae MCP |
| [memory-systems](skills/memory-systems/SKILL.md) | 记忆系统 | Trae MCP |

## 评估优化类

| Skill | 功能 | 使用方式 |
|-------|------|---------|
| [evaluation](skills/evaluation/SKILL.md) | 性能评估 | Trae MCP |
| [advanced-evaluation](skills/advanced-evaluation/SKILL.md) | 高级评估 | Trae MCP |
| [skill-creator](skills/skill-creator/SKILL.md) | Skill创建 | Trae MCP |

## 工具集成类

| Skill | 功能 | 使用方式 |
|-------|------|---------|
| [mcp-builder](skills/mcp-builder/SKILL.md) | MCP构建 | Trae MCP |
| [notebooklm](skills/notebooklm/SKILL.md) | NotebookLM | `python 07-Skill库/skills/notebooklm/scripts/analyze.py` |
| [tool-design](skills/tool-design/SKILL.md) | 工具设计 | Trae MCP |
| [internal-comms](skills/internal-comms/SKILL.md) | 内部沟通 | Trae MCP |
| [web-artifacts-builder](skills/web-artifacts-builder/SKILL.md) | Web工件构建 | Trae MCP |

## 专业领域类

| Skill | 功能 | 使用方式 |
|-------|------|---------|
| [bdi-mental-states](skills/bdi-mental-states/SKILL.md) | BDI建模 | Trae MCP |
| [using-superpowers](skills/using-superpowers/SKILL.md) | 超级能力 | Trae MCP |
| [brainstorming](skills/brainstorming/SKILL.md) | 头脑风暴 | Trae MCP |
| [writing-skills](skills/writing-skills/SKILL.md) | 写作技能 | Trae MCP |
| [doc-coauthoring](skills/doc-coauthoring/SKILL.md) | 文档协作 | Trae MCP |
| [auto-trigger-rules](skills/auto-trigger-rules/SKILL.md) | 自动触发 | Trae MCP |
| [filesystem-context](skills/filesystem-context/SKILL.md) | 文件系统上下文 | Trae MCP |

## 使用示例

### 生成Word文档

```bash
python 07-Skill库/skills/docx/scripts/document.py --input PRD.md --output PRD.docx
```

### 生成PPT

```bash
python 07-Skill库/skills/pptx/scripts/generate.py --input PRD.md --output 汇报.pptx
```

### 生成PDF

```bash
python 07-Skill库/skills/pdf/scripts/convert.py --input report.md --output report.pdf
```

### NotebookLM分析

```bash
python 07-Skill库/skills/notebooklm/scripts/analyze.py --input document.md
```

## IDE支持

| IDE | 支持程度 | 使用方式 |
|-----|---------|---------|
| **Trae** | ✅ 47/47 | MCP + 脚本 |
| **Cursor** | ⚠️ ~35/47 | 脚本为主 |
| **Windsurf** | ⚠️ ~25/47 | 脚本为主 |
| **Copilot** | ⚠️ ~20/47 | 脚本为主 |

## 快速开始

1. **查看详细文档**: [CLAUDE.md](CLAUDE.md)
2. **选择Skill**: 根据任务类型选择对应Skill
3. **查看SKILL.md**: 每个Skill目录下的SKILL.md文件
4. **执行使用**: 按文档说明使用

## 相关资源

- [CLAUDE.md](CLAUDE.md) - 模块详细说明
- [06-提示词库](../06-提示词库/) - 专家提示词
- [08-实战案例](../08-实战案例/) - 实战案例

---

> 💡 **提示**: Skill功能目前Trae支持最完整（MCP+脚本），Cursor等其他IDE主要通过Python脚本使用。建议根据实际使用的IDE选择合适的使用方式。
