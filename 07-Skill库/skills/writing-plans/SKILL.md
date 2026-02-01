---
name: writing-plans
description: 当你有规范或多步骤任务的需求时，在接触代码之前使用
---

# 编写计划

## 概述

编写全面的实施计划，假设工程师对我们的代码库一无所知，品味也有问题。记录他们需要知道的一切：每个任务要接触哪些文件、代码、测试、他们可能需要检查的文档、如何测试它。将整个计划作为小任务给他们。DRY。YAGNI。TDD。频繁提交。

假设他们是有技能的开发人员，但几乎不了解我们的工具集或问题领域。假设他们不太了解良好的测试设计。

**开始时宣布：** "我正在使用 writing-plans 技能来创建实施计划。"

**上下文：** 这应该在专用工作树中运行（由头脑风暴技能创建）。

**保存计划到：** `docs/plans/YYYY-MM-DD-<feature-name>.md`

## 小任务粒度

**每个步骤是一个动作（2-5 分钟）：**
- "编写失败的测试" - 步骤
- "运行它以确保失败" - 步骤
- "实施最小代码使测试通过" - 步骤
- "运行测试并确保通过" - 步骤
- "提交" - 步骤

## 计划文档头部

**每个计划必须以这个头部开始：**

```markdown
# [功能名称] 实施计划

> **对于 Claude：** 必需子技能：使用 superpowers:executing-plans 逐任务实施此计划。

**目标：** [一句话描述构建什么]

**架构：** [关于方法的 2-3 句话]

**技术栈：** [关键技术/库]

---
```

## 任务结构

```markdown
### 任务 N：[组件名称]

**文件：**
- 创建：`exact/path/to/file.py`
- 修改：`exact/path/to/existing.py:123-145`
- 测试：`tests/exact/path/to/test.py`

**步骤 1：编写失败的测试**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**步骤 2：运行测试以验证失败**

运行：`pytest tests/path/test.py::test_name -v`
预期：失败并显示 "function not defined"

**步骤 3：编写最小实现**

```python
def function(input):
    return expected
```

**步骤 4：运行测试以验证通过**

运行：`pytest tests/path/test.py::test_name -v`
预期：通过

**步骤 5：提交**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
```

## 记住
- 始终使用确切的文件路径
- 计划中包含完整代码（不是 "添加验证"）
- 确切的命令和预期输出
- 使用 @ 语法引用相关技能
- DRY、YAGNI、TDD、频繁提交

## 执行交接

保存计划后，提供执行选择：

**"计划完成并保存到 `docs/plans/<filename>.md`。两种执行选项：**

**1. 子代理驱动（本会话）** - 我每个任务分派新的子代理，任务之间审查，快速迭代

**2. 并行会话（单独）** - 使用 executing-plans 打开新会话，批量执行并设置检查点

**哪种方法？"**

**如果选择子代理驱动：**
- **必需子技能：** 使用 superpowers:subagent-driven-development
- 保持在本会话中
- 每个任务新的子代理 + 代码审查

**如果选择并行会话：**
- 引导他们在工作树中打开新会话
- **必需子技能：** 新会话使用 superpowers:executing-plans
