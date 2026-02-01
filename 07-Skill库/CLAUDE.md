# 07-Skill库

## 模块定位

本模块把仓库内的资产整理为"可组合Skill条目"，提供统一的触发方式、参数与交付结构，方便在对话中快速调用。Skill是AI编程IDE的高级功能，可以执行复杂的文档处理、设计、开发等任务。

## 核心功能

### 1. 文档处理类（4个）
| Skill | 功能 | 支持IDE |
|-------|------|---------|
| [docx](skills/docx/SKILL.md) | Word文档创建、编辑和分析 | Trae/Cursor |
| [pptx](skills/pptx/SKILL.md) | PPT演示文稿创建、编辑和分析 | Trae/Cursor |
| [pdf](skills/pdf/SKILL.md) | PDF处理（提取、创建、合并、表单） | Trae/Cursor |
| [xlsx](skills/xlsx/SKILL.md) | 电子表格创建、编辑和数据分析 | Trae/Cursor |

### 2. 设计工具类（7个）
| Skill | 功能 | 支持IDE |
|-------|------|---------|
| [canvas-design](skills/canvas-design/SKILL.md) | 创建海报、艺术设计和静态视觉作品 | Trae优先 |
| [ui-ux-pro-max](skills/ui-ux-pro-max/SKILL.md) | UI/UX设计智能（50种样式、21种配色、50种字体） | Trae优先 |
| [frontend-design](skills/frontend-design/SKILL.md) | 创建生产级前端界面 | Trae优先 |
| [theme-factory](skills/theme-factory/SKILL.md) | 为工件设置主题样式（10个预设主题） | Trae优先 |
| [brand-guidelines](skills/brand-guidelines/SKILL.md) | 应用Anthropic官方品牌颜色和排版 | Trae优先 |
| [algorithmic-art](skills/algorithmic-art/SKILL.md) | 使用p5.js创建算法艺术 | Trae优先 |
| [slack-gif-creator](skills/slack-gif-creator/SKILL.md) | 创建针对Slack优化的动画GIF | Trae优先 |

### 3. 开发工作流类（8个）
| Skill | 功能 | 支持IDE |
|-------|------|---------|
| [planning-with-files](skills/planning-with-files/SKILL.md) | Manus风格的基于文件规划 | Trae优先 |
| [executing-plans](skills/executing-plans/SKILL.md) | 在单独会话中执行实施计划 | Trae优先 |
| [subagent-driven-development](skills/subagent-driven-development/SKILL.md) | 在当前会话中执行独立任务 | Trae优先 |
| [dispatching-parallel-agents](skills/dispatching-parallel-agents/SKILL.md) | 并行调度多个独立代理 | Trae优先 |
| [writing-plans](skills/writing-plans/SKILL.md) | 在接触代码前编写实施计划 | Trae优先 |
| [using-git-worktrees](skills/using-git-worktrees/SKILL.md) | 创建隔离的git工作树 | Trae优先 |
| [finishing-a-development-branch](skills/finishing-a-development-branch/SKILL.md) | 完成开发分支的集成决策 | Trae优先 |
| [project-development](skills/project-development/SKILL.md) | LLM项目开发 | Trae优先 |

### 4. 代码质量类（6个）
| Skill | 功能 | 支持IDE |
|-------|------|---------|
| [test-driven-development](skills/test-driven-development/SKILL.md) | 测试驱动开发 | Trae优先 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 系统性调试 | Trae优先 |
| [requesting-code-review](skills/requesting-code-review/SKILL.md) | 请求代码审查 | Trae优先 |
| [receiving-code-review](skills/receiving-code-review/SKILL.md) | 接收代码审查反馈 | Trae优先 |
| [webapp-testing](skills/webapp-testing/SKILL.md) | 使用Playwright测试Web应用 | Trae优先 |
| [verification-before-completion](skills/verification-before-completion/SKILL.md) | 完成前验证 | Trae优先 |

### 5. 上下文管理类（4个）
| Skill | 功能 | 支持IDE |
|-------|------|---------|
| [context-fundamentals](skills/context-fundamentals/SKILL.md) | 上下文基础原理 | Trae优先 |
| [context-optimization](skills/context-optimization/SKILL.md) | 上下文优化技术 | Trae优先 |
| [context-compression](skills/context-compression/SKILL.md) | 上下文压缩 | Trae优先 |
| [context-degradation](skills/context-degradation/SKILL.md) | 上下文退化诊断 | Trae优先 |

### 6. 多代理系统类（3个）
| Skill | 功能 | 支持IDE |
|-------|------|---------|
| [multi-agent-patterns](skills/multi-agent-patterns/SKILL.md) | 多代理设计模式 | Trae优先 |
| [hosted-agents](skills/hosted-agents/SKILL.md) | 托管代理和沙箱执行 | Trae优先 |
| [memory-systems](skills/memory-systems/SKILL.md) | 代理记忆系统 | Trae优先 |

### 7. 评估与优化类（3个）
| Skill | 功能 | 支持IDE |
|-------|------|---------|
| [evaluation](skills/evaluation/SKILL.md) | 代理性能评估 | Trae优先 |
| [advanced-evaluation](skills/advanced-evaluation/SKILL.md) | 高级评估技术 | Trae优先 |
| [skill-creator](skills/skill-creator/SKILL.md) | 创建和验证Skill | Trae优先 |

### 8. 工具与集成类（5个）
| Skill | 功能 | 支持IDE |
|-------|------|---------|
| [mcp-builder](skills/mcp-builder/SKILL.md) | 构建MCP服务器 | Trae优先 |
| [notebooklm](skills/notebooklm/SKILL.md) | NotebookLM集成 | Trae优先 |
| [tool-design](skills/tool-design/SKILL.md) | 设计代理工具 | Trae优先 |
| [internal-comms](skills/internal-comms/SKILL.md) | 内部沟通写作 | Trae优先 |
| [web-artifacts-builder](skills/web-artifacts-builder/SKILL.md) | 构建复杂Web工件 | Trae优先 |

### 9. 专业领域类（7个）
| Skill | 功能 | 支持IDE |
|-------|------|---------|
| [bdi-mental-states](skills/bdi-mental-states/SKILL.md) | BDI心理状态建模 | Trae优先 |
| [using-superpowers](skills/using-superpowers/SKILL.md) | 使用超级能力 | Trae优先 |
| [brainstorming](skills/brainstorming/SKILL.md) | 头脑风暴 | Trae优先 |
| [writing-skills](skills/writing-skills/SKILL.md) | 写作技能 | Trae优先 |
| [doc-coauthoring](skills/doc-coauthoring/SKILL.md) | 文档协作编写 | Trae优先 |
| [auto-trigger-rules](skills/auto-trigger-rules/SKILL.md) | 自动触发规则 | Trae优先 |
| [filesystem-context](skills/filesystem-context/SKILL.md) | 文件系统上下文 | Trae优先 |

## 使用方法

### Trae

**方式1：MCP服务（推荐）**

在对话中直接调用Skill：
```
@Builder with MCP 请使用docx Skill将PRD转换为Word格式
```

**方式2：Python脚本**

在Trae终端中运行Skill脚本：
```bash
python 07-Skill库/skills/docx/scripts/document.py --input input.md --output output.docx
```

**方式3：智能体集成**

创建专用智能体，集成Skill能力：
1. 创建智能体"文档生成专家"
2. 在提示词中说明可调用docx/pptx/pdf Skill
3. 在对话中直接请求使用Skill

### Cursor

**方式1：Python脚本（推荐）**

Cursor用户主要通过Python脚本使用Skill：
```bash
# 生成Word文档
python 07-Skill库/skills/docx/scripts/document.py --input PRD.md --output PRD.docx

# 生成PPT
python 07-Skill库/skills/pptx/scripts/generate.py --input PRD.md --output 汇报.pptx

# 生成PDF
python 07-Skill库/skills/pdf/scripts/convert.py --input report.md --output report.pdf
```

**方式2：终端命令**

在Cursor终端中直接运行命令行工具。

### 其他IDE

其他IDE用户同样通过Python脚本或命令行使用Skill：
```bash
# 安装依赖
cd 07-Skill库/skills/docx
pip install -r requirements.txt

# 运行脚本
python scripts/document.py --help
```

## Skill使用场景示例

### 场景1：生成需求文档

```bash
# 使用docx Skill生成Word文档
python 07-Skill库/skills/docx/scripts/document.py --input PRD.md --output PRD.docx
```

### 场景2：生成汇报PPT

```bash
# 使用pptx Skill生成PPT
python 07-Skill库/skills/pptx/scripts/generate.py --input PRD.md --theme 科技蓝 --output 汇报.pptx
```

### 场景3：UI设计

```
@Builder with MCP 请使用ui-ux-pro-max Skill为我的电商APP设计首页
```

### 场景4：代码审查

```
@Builder with MCP 请使用requesting-code-review Skill审查这段代码
```

### 场景5：NotebookLM分析

```bash
# 使用notebooklm Skill分析文档
python 07-Skill库/skills/notebooklm/scripts/analyze.py --input document.md
```

## IDE支持矩阵

| Skill类别 | Trae | Cursor | Windsurf | Copilot |
|-----------|------|--------|----------|---------|
| 文档处理 | ✅ 完整 | ✅ 完整 | ⚠️ 脚本 | ⚠️ 脚本 |
| 设计工具 | ✅ 完整 | ⚠️ 部分 | ⚠️ 部分 | ❌ |
| 开发工作流 | ✅ 完整 | ⚠️ 部分 | ⚠️ 部分 | ⚠️ 部分 |
| 代码质量 | ✅ 完整 | ✅ 完整 | ⚠️ 部分 | ⚠️ 部分 |
| 上下文管理 | ✅ 完整 | ⚠️ 部分 | ⚠️ 部分 | ⚠️ 部分 |
| 多代理系统 | ✅ 完整 | ⚠️ 部分 | ❌ | ❌ |
| 评估优化 | ✅ 完整 | ⚠️ 部分 | ⚠️ 部分 | ⚠️ 部分 |
| 工具集成 | ✅ 完整 | ⚠️ 部分 | ⚠️ 部分 | ⚠️ 部分 |

## 最佳实践

### 1. 选择合适的Skill

根据任务类型选择对应的Skill：
- **文档生成** → docx/pptx/pdf
- **UI设计** → ui-ux-pro-max/frontend-design/canvas-design
- **代码开发** → project-development/test-driven-development
- **调试优化** → systematic-debugging/context-optimization
- **团队协作** → internal-comms/doc-coauthoring

### 2. 组合使用多个Skill

复杂任务可以组合多个Skill：
```
1. 使用planning-with-files制定计划
2. 使用project-development执行开发
3. 使用test-driven-development编写测试
4. 使用docx生成项目文档
```

### 3. 自定义Skill

参考[skill-creator](skills/skill-creator/SKILL.md)创建自定义Skill：
1. 复制现有Skill模板
2. 修改SKILL.md描述
3. 添加自定义脚本
4. 测试验证

### 4. 版本管理

- 定期更新Skill到最新版本
- 在团队内统一Skill版本
- 记录自定义修改

## 常见问题

### Q1: 为什么某些Skill在我的IDE中不可用？

**A**: 不同IDE对Skill的支持程度不同。Trae支持最完整，其他IDE可能只支持部分Skill。建议：
- 查看IDE支持矩阵
- 使用Python脚本方式
- 考虑切换IDE

### Q2: 如何知道某个Skill是否被正确调用？

**A**: 
- Trae：查看对话中的工具调用提示
- Cursor：查看终端输出
- 其他IDE：查看命令行输出

### Q3: Skill执行失败怎么办？

**A**: 
1. 检查输入文件格式是否正确
2. 确认依赖已安装（pip install -r requirements.txt）
3. 查看错误日志
4. 参考Skill文档的故障排除章节

### Q4: 可以修改Skill的行为吗？

**A**: 可以，但建议：
1. 先复制原Skill
2. 在副本上修改
3. 保留原始Skill作为备份
4. 记录修改内容

## 相关资源

- [README.md](README.md) - Skill库导航
- [06-提示词库](../06-提示词库/) - 专家提示词
- [08-实战案例](../08-实战案例/) - 实战案例

---

> 💡 **提示**: Skill功能目前Trae支持最完整（MCP+脚本），其他IDE主要通过Python脚本使用。建议根据实际使用的IDE选择合适的使用方式。
