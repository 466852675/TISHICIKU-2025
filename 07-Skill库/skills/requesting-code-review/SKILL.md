---
name: requesting-code-review
description: 在完成任务、实现主要功能或合并前验证工作是否符合要求时使用
---

# 请求代码审查

派遣 superpowers:code-reviewer 子代理，在问题级联之前捕获它们。

**核心原则：** 尽早审查，频繁审查。

## 何时请求审查

**强制要求：**
- 子代理驱动开发中的每个任务完成后
- 完成主要功能后
- 合并到 main 分支之前

**可选但有价值：**
- 遇到瓶颈时（获得新视角）
- 重构之前（基线检查）
- 修复复杂 bug 后

## 如何请求

**1. 获取 git SHA：**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # 或 origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. 派遣 code-reviewer 子代理：**

使用 Task 工具，类型为 superpowers:code-reviewer，填写 `code-reviewer.md` 中的模板

**占位符：**
- `{WHAT_WAS_IMPLEMENTED}` - 你刚刚构建的内容
- `{PLAN_OR_REQUIREMENTS}` - 它应该做什么
- `{BASE_SHA}` - 起始 commit
- `{HEAD_SHA}` - 结束 commit
- `{DESCRIPTION}` - 简要摘要

**3. 根据反馈采取行动：**
- 立即修复 Critical（严重）问题
- 在继续之前修复 Important（重要）问题
- 记录 Minor（轻微）问题稍后处理
- 如果审查者错了，提出异议（附理由）

## 示例

```
[刚刚完成任务 2：添加验证函数]

You: 让我在继续之前请求代码审查。

BASE_SHA=$(git log --oneline | grep "Task 1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[派遣 superpowers:code-reviewer 子代理]
  WHAT_WAS_IMPLEMENTED: 对话索引的验证和修复函数
  PLAN_OR_REQUIREMENTS: docs/plans/deployment-plan.md 中的任务 2
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661
  DESCRIPTION: 添加了 verifyIndex() 和 repairIndex()，包含 4 种问题类型

[子代理返回]:
  Strengths: 架构清晰，测试真实
  Issues:
    Important: 缺少进度指示器
    Minor: 报告间隔使用了魔法数字 (100)
  Assessment: 可以继续

You: [修复进度指示器]
[继续任务 3]
```

## 与工作流集成

**子代理驱动开发：**
- 每个任务后都进行审查
- 在问题累积之前捕获它们
- 在进入下一个任务之前修复

**执行计划：**
- 每批任务后审查（3 个任务）
- 获取反馈，应用，继续

**临时开发：**
- 合并前审查
- 遇到瓶颈时审查

## 危险信号

**永远不要：**
- 因为"很简单"而跳过审查
- 忽略 Critical 问题
- 在 Important 问题未修复的情况下继续
- 与有效的技术反馈争论

**如果审查者错了：**
- 用技术理由提出异议
- 展示证明其有效的代码/测试
- 请求澄清

查看模板：requesting-code-review/code-reviewer.md
