# Skill 编写最佳实践

> 学习如何编写有效的 Skill，让 Claude 能够成功发现和使用。

好的 Skill 简洁、结构良好，并经过实际使用测试。本指南提供实用的编写决策，帮助你编写 Claude 能够有效发现和使用的 Skill。

关于 Skill 工作原理的概念背景，请参阅 [Skill 概述](/en/docs/agents-and-tools/agent-skills/overview)。

## 核心原则

### 简洁是关键

[上下文窗口](https://platform.claude.com/docs/en/build-with-claude/context-windows) 是一种公共资源。你的 Skill 与 Claude 需要知道的所有其他内容共享上下文窗口，包括：

* 系统提示词
* 对话历史
* 其他 Skill 的元数据
* 你的实际请求

并非 Skill 中的每个 token 都有即时成本。启动时，只有所有 Skill 的元数据（名称和描述）会被预加载。Claude 仅在 Skill 变得相关时才会读取 SKILL.md，并仅在需要时读取其他文件。然而，在 SKILL.md 中保持简洁仍然很重要：一旦 Claude 加载了它，每个 token 都会与对话历史和其他上下文竞争。

**默认假设**：Claude 已经非常聪明

只添加 Claude 尚不了解的上下文。质疑每条信息：

* "Claude 真的需要这个解释吗？"
* "我可以假设 Claude 知道这个吗？"
* "这段文字是否证明了它的 token 成本是合理的？"

**好例子：简洁**（大约 50 个 token）：

````markdown  theme={null}
## 提取 PDF 文本

使用 pdfplumber 进行文本提取：

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**坏例子：过于冗长**（大约 150 个 token）：

```markdown  theme={null}
## 提取 PDF 文本

PDF（便携式文档格式）文件是一种常见的文件格式，包含
文本、图像和其他内容。要从 PDF 中提取文本，你需要
使用一个库。有许多可用于 PDF 处理的库，但我们
推荐 pdfplumber，因为它易于使用且能处理大多数情况。
首先，你需要使用 pip 安装它。然后你可以使用下面的代码...
```

简洁版本假设 Claude 知道什么是 PDF 以及库如何工作。

### 设置适当的自由度

将特定程度与任务的脆弱性和可变性相匹配。

**高自由度**（基于文本的指令）：

在以下情况使用：

* 多种方法都是有效的
* 决策取决于上下文
* 启发式方法指导方法

示例：

```markdown  theme={null}
## 代码审查流程

1. 分析代码结构和组织
2. 检查潜在的 bug 或边缘情况
3. 建议改进可读性和可维护性
4. 验证是否符合项目约定
```

**中等自由度**（带参数的伪代码或脚本）：

在以下情况使用：

* 存在首选模式
* 一些变化是可以接受的
* 配置影响行为

示例：

````markdown  theme={null}
## 生成报告

使用此模板并根据需要进行自定义：

```python
def generate_report(data, format="markdown", include_charts=True):
    # 处理数据
    # 以指定格式生成输出
    # 可选地包含可视化
```
````

**低自由度**（特定脚本，很少或没有参数）：

在以下情况使用：

* 操作是脆弱且容易出错的
* 一致性至关重要
* 必须遵循特定序列

示例：

````markdown  theme={null}
## 数据库迁移

完全运行此脚本：

```bash
python scripts/migrate.py --verify --backup
```

不要修改命令或添加额外的标志。
````

**类比**：将 Claude 想象成一个探索路径的机器人：

* **两侧是悬崖的窄桥**：只有一种安全的前进方式。提供特定的护栏和精确指令（低自由度）。示例：必须按确切顺序运行的数据库迁移。
* **没有障碍的开阔地**：许多路径都能成功。给出大致方向，相信 Claude 能找到最佳路线（高自由度）。示例：代码审查，其中上下文决定最佳方法。

### 测试你计划使用的所有模型

Skill 作为模型的补充，因此有效性取决于底层模型。用你计划使用的所有模型测试你的 Skill。

**按模型的测试考虑**：

* **Claude Haiku**（快速、经济）：Skill 是否提供了足够的指导？
* **Claude Sonnet**（平衡）：Skill 是否清晰高效？
* **Claude Opus**（强大的推理）：Skill 是否避免了过度解释？

对 Opus 完美的东西可能需要为 Haiku 提供更多细节。如果你计划在多个模型中使用你的 Skill，目标是适用于所有模型的指令。

## Skill 结构

<Note>
  **YAML Frontmatter**：SKILL.md frontmatter 支持两个字段：

  * `name` - Skill 的人类可读名称（最多 64 个字符）
  * `description` - Skill 的作用和使用时机的一行描述（最多 1024 个字符）

  有关完整的 Skill 结构详情，请参阅 [Skill 概述](/en/docs/agents-and-tools/agent-skills/overview#skill-structure)。
</Note>

### 命名约定

使用一致的命名模式，使 Skill 更易于引用和讨论。我们建议使用**动名词形式**（动词 + -ing）作为 Skill 名称，因为这清楚地描述了 Skill 提供的活动或能力。

**好的命名示例（动名词形式）**：

* "处理 PDF"
* "分析电子表格"
* "管理数据库"
* "测试代码"
* "编写文档"

**可接受的替代方案**：

* 名词短语："PDF 处理"、"电子表格分析"
* 面向行动："处理 PDF"、"分析电子表格"

**避免**：

* 模糊的名称："助手"、"工具"、"工具集"
* 过于通用的："文档"、"数据"、"文件"
* Skill 集合中不一致的模式

一致的命名使以下操作更容易：

* 在文档和对话中引用 Skill
* 一眼就能理解 Skill 的作用
* 组织和搜索多个 Skill
* 维护专业、连贯的 Skill 库

### 编写有效的描述

`description` 字段启用 Skill 发现，应包括 Skill 的作用以及何时使用它。

<Warning>
  **始终使用第三人称**。描述被注入到系统提示词中，不一致的人称视角可能导致发现问题。

  * **好：**"处理 Excel 文件并生成报告"
  * **避免：**"我可以帮助你处理 Excel 文件"
  * **避免：**"你可以使用这个来处理 Excel 文件"
</Warning>

**具体并包含关键词**。包括 Skill 的作用以及何时使用它的具体触发器/上下文。

每个 Skill 只有一个描述字段。描述对 Skill 选择至关重要：Claude 使用它从可能 100+ 个可用 Skill 中选择正确的 Skill。你的描述必须提供足够的细节，让 Claude 知道何时选择此 Skill，而 SKILL.md 的其余部分提供实现细节。

有效示例：

**PDF 处理 Skill：**

```yaml  theme={null}
description: 从 PDF 文件中提取文本和表格，填写表单，合并文档。在处理 PDF 文件或当用户提到 PDF、表单或文档提取时使用。
```

**Excel 分析 Skill：**

```yaml  theme={null}
description: 分析 Excel 电子表格，创建数据透视表，生成图表。在分析 Excel 文件、电子表格、表格数据或 .xlsx 文件时使用。
```

**Git 提交助手 Skill：**

```yaml  theme={null}
description: 通过分析 git diff 生成描述性提交消息。当用户请求帮助编写提交消息或审查暂存更改时使用。
```

避免模糊描述，如：

```yaml  theme={null}
description: 帮助处理文档
```

```yaml  theme={null}
description: 处理数据
```

```yaml  theme={null}
description: 对文件做一些操作
```

### 渐进式披露模式

SKILL.md 作为概述，根据需要指向 Claude 到详细材料，就像入职指南中的目录一样。关于渐进式披露工作原理的解释，请参阅概述中的 [Skill 工作原理](/en/docs/agents-and-tools/agent-skills/overview#how-skills-work)。

**实用指导：**

* 为获得最佳性能，保持 SKILL.md 正文在 500 行以下
* 当接近此限制时，将内容拆分为单独的文件
* 使用以下模式有效组织指令、代码和资源

#### 视觉概述：从简单到复杂

基本 Skill 从仅包含元数据和指令的 SKILL.md 文件开始：

<img src="https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-simple-file.png?fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=87782ff239b297d9a9e8e1b72ed72db9" alt="显示 YAML frontmatter 和 markdown 正文的简单 SKILL.md 文件" data-og-width="2048" width="2048" data-og-height="1153" height="1153" data-path="images/agent-skills-simple-file.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-simple-file.png?w=280&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=c61cc33b6f5855809907f7fda94cd80e 280w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-simple-file.png?w=560&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=90d2c0c1c76b36e8d485f49e0810dbfd 560w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-simple-file.png?w=840&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=ad17d231ac7b0bea7e5b4d58fb4aeabb 840w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-simple-file.png?w=1100&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=f5d0a7a3c668435bb0aee9a3a8f8c329 1100w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-simple-file.png?w=1650&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=0e927c1af9de5799cfe557d12249f6e6 1650w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-simple-file.png?w=2500&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=46bbb1a51dd4c8202a470ac8c80a893d 2500w" />

随着 Skill 的增长，你可以捆绑额外的内容，Claude 仅在需要时加载：

<img src="https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-bundling-content.png?fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=a5e0aa41e3d53985a7e3e43668a33ea3" alt="捆绑额外的参考文件，如 reference.md 和 forms.md。" data-og-width="2048" width="2048" data-og-height="1327" height="1327" data-path="images/agent-skills-bundling-content.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-bundling-content.png?w=280&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=f8a0e73783e99b4a643d79eac86b70a2 280w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-bundling-content.png?w=560&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=dc510a2a9d3f14359416b706f067904a 560w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-bundling-content.png?w=840&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=82cd6286c966303f7dd914c28170e385 840w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-bundling-content.png?w=1100&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=56f3be36c77e4fe4b523df209a6824c6 1100w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-bundling-content.png?w=1650&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=d22b5161b2075656417d56f41a74f3dd 1650w, https://mintcdn.com/anthropic-claude-docs/4Bny2bjzuGBK7o00/images/agent-skills-bundling-content.png?w=2500&fit=max&auto=format&n=4Bny2bjzuGBK7o00&q=85&s=3dd4bdd6850ffcc96c6c45fcb0acd6eb 2500w" />

完整的 Skill 目录结构可能如下所示：

```
pdf/
├── SKILL.md              # 主要指令（触发时加载）
├── FORMS.md              # 表单填写指南（按需加载）
├── reference.md          # API 参考（按需加载）
├── examples.md           # 使用示例（按需加载）
└── scripts/
    ├── analyze_form.py   # 实用脚本（执行，不加载）
    ├── fill_form.py      # 表单填写脚本
    └── validate.py       # 验证脚本
```

#### 模式 1：带参考的高级指南

````markdown  theme={null}
---
name: PDF 处理
description: 从 PDF 文件中提取文本和表格，填写表单，合并文档。在处理 PDF 文件或当用户提到 PDF、表单或文档提取时使用。
---

# PDF 处理

## 快速开始

使用 pdfplumber 提取文本：
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## 高级功能

**表单填写**：完整的指南请参阅 [FORMS.md](FORMS.md)
**API 参考**：所有方法请参阅 [REFERENCE.md](REFERENCE.md)
**示例**：常见模式请参阅 [EXAMPLES.md](EXAMPLES.md)
````

Claude 仅在需要时加载 FORMS.md、REFERENCE.md 或 EXAMPLES.md。

#### 模式 2：按领域组织

对于具有多个领域的 Skill，按领域组织内容以避免加载不相关的上下文。当用户询问销售指标时，Claude 只需要阅读与销售相关的模式，而不是财务或营销数据。这保持 token 使用率低且上下文集中。

```
bigquery-skill/
├── SKILL.md (概述和导航)
└── reference/
    ├── finance.md (收入、账单指标)
    ├── sales.md (机会、管道)
    ├── product.md (API 使用、功能)
    └── marketing.md (活动、归因)
```

````markdown SKILL.md theme={null}
# BigQuery 数据分析

## 可用数据集

**财务**：收入、ARR、账单 → 请参阅 [reference/finance.md](reference/finance.md)
**销售**：机会、管道、账户 → 请参阅 [reference/sales.md](reference/sales.md)
**产品**：API 使用、功能、采用 → 请参阅 [reference/product.md](reference/product.md)
**营销**：活动、归因、电子邮件 → 请参阅 [reference/marketing.md](reference/marketing.md)

## 快速搜索

使用 grep 查找特定指标：

```bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
```
````

#### 模式 3：条件细节

显示基本内容，链接到高级内容：

```markdown  theme={null}
# DOCX 处理

## 创建文档

使用 docx-js 创建新文档。请参阅 [DOCX-JS.md](DOCX-JS.md)。

## 编辑文档

对于简单编辑，直接修改 XML。

**对于修订跟踪**：请参阅 [REDLINING.md](REDLINING.md)
**对于 OOXML 详情**：请参阅 [OOXML.md](OOXML.md)
```

Claude 仅在用户需要这些功能时才读取 REDLINING.md 或 OOXML.md。

### 避免深度嵌套引用

当从其他引用文件引用文件时，Claude 可能会部分读取文件。当遇到嵌套引用时，Claude 可能会使用 `head -100` 等命令预览内容，而不是读取整个文件，导致信息不完整。

**保持引用从 SKILL.md 只有一级深度**。所有引用文件应直接从 SKILL.md 链接，以确保 Claude 在需要时读取完整文件。

**坏例子：太深**：

```markdown  theme={null}
# SKILL.md
请参阅 [advanced.md](advanced.md)...

# advanced.md
请参阅 [details.md](details.md)...

# details.md
这是实际信息...
```

**好例子：只有一级**：

```markdown  theme={null}
# SKILL.md

**基本用法**：[SKILL.md 中的说明]
**高级功能**：请参阅 [advanced.md](advanced.md)
**API 参考**：请参阅 [reference.md](reference.md)
**示例**：请参阅 [examples.md](examples.md)
```

### 为较长的参考文件构建目录

对于超过 100 行的参考文件，在顶部包含目录。这确保即使在使用部分读取预览时，Claude 也能看到可用信息的完整范围。

**示例**：

```markdown  theme={null}
# API 参考

## 目录
- 认证和设置
- 核心方法（创建、读取、更新、删除）
- 高级功能（批处理操作、webhooks）
- 错误处理模式
- 代码示例

## 认证和设置
...

## 核心方法
...
```

然后 Claude 可以根据需要读取完整文件或跳转到特定部分。

有关此基于文件的架构如何启用渐进式披露的详细信息，请参阅下面的 [运行时环境](#runtime-environment) 部分。

## 工作流和反馈循环

### 为复杂任务使用工作流

将复杂操作分解为清晰、顺序的步骤。对于特别复杂的工作流，提供一个清单，Claude 可以复制到其响应中并在进行时勾选。

**示例 1：研究综合工作流**（适用于没有代码的 Skill）：

````markdown  theme={null}
## 研究综合工作流

复制此清单并跟踪你的进度：

```
研究进度：
- [ ] 步骤 1：阅读所有源文档
- [ ] 步骤 2：识别关键主题
- [ ] 步骤 3：交叉引用声明
- [ ] 步骤 4：创建结构化摘要
- [ ] 步骤 5：验证引用
```

**步骤 1：阅读所有源文档**

审查 `sources/` 目录中的每个文档。注意主要论点和支持证据。

**步骤 2：识别关键主题**

寻找跨来源的模式。哪些主题反复出现？来源在哪些方面达成一致或分歧？

**步骤 3：交叉引用声明**

对于每个主要声明，验证它是否出现在源材料中。注意哪个来源支持每个观点。

**步骤 4：创建结构化摘要**

按主题组织发现。包括：
- 主要声明
- 来源的支持证据
- 冲突的观点（如果有）

**步骤 5：验证引用**

检查每个声明是否引用了正确的源文档。如果引用不完整，返回步骤 3。
````

此示例展示了工作流如何应用于不需要代码的分析任务。清单模式适用于任何复杂的多步骤过程。

**示例 2：PDF 表单填写工作流**（适用于带代码的 Skill）：

````markdown  theme={null}
## PDF 表单填写工作流

复制此清单并在完成项目时勾选：

```
任务进度：
- [ ] 步骤 1：分析表单（运行 analyze_form.py）
- [ ] 步骤 2：创建字段映射（编辑 fields.json）
- [ ] 步骤 3：验证映射（运行 validate_fields.py）
- [ ] 步骤 4：填写表单（运行 fill_form.py）
- [ ] 步骤 5：验证输出（运行 verify_output.py）
```

**步骤 1：分析表单**

运行：`python scripts/analyze_form.py input.pdf`

这会提取表单字段及其位置，保存到 `fields.json`。

**步骤 2：创建字段映射**

编辑 `fields.json` 为每个字段添加值。

**步骤 3：验证映射**

运行：`python scripts/validate_fields.py fields.json`

在继续之前修复任何验证错误。

**步骤 4：填写表单**

运行：`python scripts/fill_form.py input.pdf fields.json output.pdf`

**步骤 5：验证输出**

运行：`python scripts/verify_output.py output.pdf`

如果验证失败，返回步骤 2。
````

清晰的步骤防止 Claude 跳过关键验证。清单帮助 Claude 和你跟踪多步骤工作流的进度。

### 实现反馈循环

**常见模式**：运行验证器 → 修复错误 → 重复

这种模式大大提高了输出质量。

**示例 1：风格指南合规性**（适用于没有代码的 Skill）：

```markdown  theme={null}
## 内容审查流程

1. 按照 STYLE_GUIDE.md 中的指南起草你的内容
2. 根据清单审查：
   - 检查术语一致性
   - 验证示例遵循标准格式
   - 确认所有必需部分都存在
3. 如果发现问题：
   - 记录每个问题并附上具体部分引用
   - 修改内容
   - 再次审查清单
4. 仅在满足所有要求时继续
5. 最终确定并保存文档
```

这展示了使用参考文档而不是脚本的验证循环模式。"验证器"是 STYLE_GUIDE.md，Claude 通过阅读和比较来执行检查。

**示例 2：文档编辑流程**（适用于带代码的 Skill）：

```markdown  theme={null}
## 文档编辑流程

1. 对 `word/document.xml` 进行编辑
2. **立即验证**：`python ooxml/scripts/validate.py unpacked_dir/`
3. 如果验证失败：
   - 仔细查看错误消息
   - 修复 XML 问题
   - 再次运行验证
4. 仅在验证通过时继续
5. 重新打包文档
```

**实现提示**：使验证脚本具有详细的特定错误消息，如"找不到字段 'signature_date'。可用字段：customer_name, order_total, signature_date_signed"，以帮助 Claude 修复问题。

### 包依赖

Skill 在代码执行环境中运行，具有平台特定的限制：

* **claude.ai**：可以从 npm 和 PyPI 安装包并从 GitHub 仓库拉取
* **Anthropic API**：没有网络访问权限，也没有运行时包安装

在你的 SKILL.md 中列出所需的包，并验证它们在 [代码执行工具文档](/en/docs/agents-and-tools/tool-use/code-execution-tool) 中可用。

### 运行时环境

Skill 在具有文件系统访问权限、bash 命令和代码执行能力的代码执行环境中运行。有关此架构的概念解释，请参阅概述中的 [Skill 架构](/en/docs/agents-and-tools/agent-skills/overview#the-skills-architecture)。

**这如何影响你的编写：**

**Claude 如何访问 Skill：**

1. **元数据预加载**：启动时，所有 Skill 的 YAML frontmatter 中的名称和描述被加载到系统提示词中
2. **按需读取文件**：Claude 使用 bash Read 工具在需要时从文件系统访问 SKILL.md 和其他文件
3. **高效执行脚本**：可以通过 bash 执行实用脚本，而无需将其完整内容加载到上下文中。只有脚本的输出消耗 token
4. **大文件没有上下文惩罚**：参考文件、数据或文档在实际读取之前不会消耗上下文 token

* **文件路径很重要**：Claude 像文件系统一样导航你的 Skill 目录。使用正斜杠（`reference/guide.md`），而不是反斜杠
* **文件名要描述性**：使用表明内容的名称：`form_validation_rules.md`，而不是 `doc2.md`
* **为发现组织**：按领域或功能构建目录结构
  * 好：`reference/finance.md`、`reference/sales.md`
  * 坏：`docs/file1.md`、`docs/file2.md`
* **捆绑全面的资源**：包含完整的 API 文档、广泛的示例、大型数据集；在访问之前没有上下文惩罚
* **优先为确定性操作编写脚本**：编写 `validate_form.py` 而不是要求 Claude 生成验证代码
* **明确执行意图**：
  * "运行 `analyze_form.py` 提取字段"（执行）
  * "查看 `analyze_form.py` 了解提取算法"（作为参考阅读）
* **测试文件访问模式**：通过使用真实请求测试来验证 Claude 可以导航你的目录结构

**示例：**

```
bigquery-skill/
├── SKILL.md (概述，指向参考文件)
└── reference/
    ├── finance.md (收入指标)
    ├── sales.md (管道数据)
    └── product.md (使用分析)
```

当用户询问收入时，Claude 读取 SKILL.md，看到对 `reference/finance.md` 的引用，并调用 bash 仅读取该文件。sales.md 和 product.md 文件保留在文件系统上，在需要之前消耗零上下文 token。这种基于文件的模型正是启用渐进式披露的原因。Claude 可以导航并选择性加载每个任务所需的确切内容。

有关技术架构的完整详情，请参阅 Skill 概述中的 [Skill 工作原理](/en/docs/agents-and-tools/agent-skills/overview#how-skills-work)。

### MCP 工具引用

如果你的 Skill 使用 MCP（模型上下文协议）工具，始终使用完全限定的工具名称以避免"找不到工具"错误。

**格式**：`ServerName:tool_name`

**示例**：

```markdown  theme={null}
使用 BigQuery:bigquery_schema 工具检索表模式。
使用 GitHub:create_issue 工具创建问题。
```

其中：

* `BigQuery` 和 `GitHub` 是 MCP 服务器名称
* `bigquery_schema` 和 `create_issue` 是这些服务器内的工具名称

没有服务器前缀，Claude 可能无法找到工具，尤其是在有多个 MCP 服务器可用时。

### 避免假设工具已安装

不要假设包可用：

````markdown  theme={null}
**坏例子：假设安装**：
"使用 pdf 库处理文件。"

**好例子：明确依赖**：
"安装所需包：`pip install pypdf`

然后使用它：
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```"
````

## 技术说明

### YAML frontmatter 要求

SKILL.md frontmatter 只包括 `name`（最多 64 个字符）和 `description`（最多 1024 个字符）字段。有关完整的结构详情，请参阅 [Skill 概述](/en/docs/agents-and-tools/agent-skills/overview#skill-structure)。

### Token 预算

为获得最佳性能，保持 SKILL.md 正文在 500 行以下。如果你的内容超过此限制，使用前面描述的渐进式披露模式将其拆分为单独的文件。有关架构详情，请参阅 [Skill 概述](/en/docs/agents-and-tools/agent-skills/overview#how-skills-work)。

## 有效 Skill 的清单

在分享 Skill 之前，验证：

### 核心质量

* [ ] 描述具体并包含关键词
* [ ] 描述包括 Skill 的作用和何时使用它
* [ ] SKILL.md 正文在 500 行以下
* [ ] 额外的细节在单独的文件中（如果需要）
* [ ] 没有时间敏感信息（或在"旧模式"部分）
* [ ] 整个术语一致
* [ ] 示例具体，不是抽象的
* [ ] 文件引用只有一级深度
* [ ] 适当使用渐进式披露
* [ ] 工作流有清晰的步骤

### 代码和脚本

* [ ] 脚本解决问题而不是推给 Claude
* [ ] 错误处理是明确的且有帮助的
* [ ] 没有"巫毒常量"（所有值都有理由）
* [ ] 所需的包在说明中列出并验证为可用
* [ ] 脚本有清晰的文档
* [ ] 没有 Windows 风格的路径（所有正斜杠）
* [ ] 关键操作的验证/验证步骤
* [ ] 为质量关键任务包含反馈循环

### 测试

* [ ] 至少创建了三个评估
* [ ] 使用 Haiku、Sonnet 和 Opus 测试
* [ ] 使用真实使用场景测试
* [ ] 纳入团队反馈（如果适用）

## 下一步

<CardGroup cols={2}>
  <Card title="开始使用 Agent Skill" icon="rocket" href="/en/docs/agents-and-tools/agent-skills/quickstart">
    创建你的第一个 Skill
  </Card>

  <Card title="在 Claude Code 中使用 Skill" icon="terminal" href="/en/docs/claude-code/skills">
    在 Claude Code 中创建和管理 Skill
  </Card>

  <Card title="使用 API 使用 Skill" icon="code" href="/en/api/skills-guide">
    以编程方式上传和使用 Skill
  </Card>
</CardGroup>
