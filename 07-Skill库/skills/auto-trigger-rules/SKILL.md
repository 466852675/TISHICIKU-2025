---
name: auto-trigger-rules
description: |
  根据用户输入自动判断并触发最合适的技能。
  使用场景：
  - 用户提到"项目启动"、"立项"、"Kickoff" → 触发 project-development + planning-with-files + brainstorming
  - 用户提到"需求规划"、"需求分析"、"PRD" → 触发 project-development + doc-coauthoring + brainstorming
  - 用户提到"技术方案"、"架构设计"、"技术选型" → 触发 project-development + planning-with-files + context-fundamentals
  - 用户提到"任务拆解"、"WBS"、"排期" → 触发 planning-with-files + executing-plans
  - 用户提到"项目复盘"、"总结"、"回顾" → 触发 evaluation + advanced-evaluation + doc-coauthoring
  - 用户提到"UI设计"、"界面设计"、"交互设计" → 触发 ui-ux-pro-max + canvas-design + frontend-design
  - 用户提到"UI重构"、"改版"、"界面优化" → 触发 frontend-design + ui-ux-pro-max + executing-plans
  - 用户提到"前端开发"、"页面实现"、"前端功能" → 触发 frontend-design + ui-ux-pro-max + test-driven-development
  - 用户提到"后端开发"、"API开发"、"服务端" → 触发 project-development + test-driven-development + executing-plans
  - 用户提到"数据库设计"、"表结构"、"Schema设计" → 触发 context-fundamentals + planning-with-files
  - 用户提到"代码重构"、"重构"、"代码优化" → 触发 test-driven-development + systematic-debugging
  - 用户提到"单元测试"、"测试用例"、"Jest" → 触发 test-driven-development + webapp-testing
  - 用户提到"集成测试"、"E2E测试"、"自动化测试" → 触发 webapp-testing + test-driven-development
  - 用户提到"性能测试"、"压测"、"负载测试" → 触发 evaluation + advanced-evaluation + webapp-testing
  - 用户提到"代码审查"、"Code Review"、"CR" → 触发 requesting-code-review + receiving-code-review + evaluation
  - 用户提到"Bug修复"、"问题排查"、"调试" → 触发 systematic-debugging + test-driven-development
  - 用户提到"启动服务"、"运行项目"、"启动应用" → 触发 project-development + executing-plans + hosted-agents
  - 用户提到"CI/CD"、"流水线"、"自动化部署" → 触发 executing-plans + project-development + using-git-worktrees
  - 用户提到"Docker"、"容器化"、"Kubernetes" → 触发 hosted-agents + executing-plans + project-development
  - 用户提到"监控"、"告警"、"日志" → 触发 systematic-debugging + evaluation + hosted-agents
  - 用户提到"故障处理"、"应急响应"、"OnCall" → 触发 systematic-debugging + executing-plans + project-development
  - 用户提到"技术文档"、"API文档"、"开发文档" → 触发 doc-coauthoring + writing-skills + docx
  - 用户提到"PPT"、"演示"、"汇报" → 触发 pptx + canvas-design + theme-factory
  - 用户提到"技术分享"、"Tech Talk"、"培训" → 触发 writing-skills + doc-coauthoring + pptx
  - 用户提到"会议纪要"、"会议记录" → 触发 doc-coauthoring + writing-plans
  - 用户提到"跨团队"、"协调"、"沟通" → 触发 internal-comms + doc-coauthoring
  - 用户提到"AI开发"、"模型接入"、"智能功能" → 触发 mcp-builder + project-development + frontend-design
  - 用户提到"Prompt工程"、"提示词优化" → 触发 writing-skills + context-optimization + evaluation
  - 用户提到"数据分析"、"报表"、"BI" → 触发 xlsx + evaluation + context-fundamentals
  - 用户提到"数据可视化"、"图表"、"Dashboard" → 触发 canvas-design + frontend-design
---

# 自动触发规则

本技能定义了根据用户输入自动匹配和触发相关技能的规则，覆盖软件开发生命周期的核心场景。

## 核心场景映射表（30个）

### 一、项目启动与规划（5个）

| 场景 | 触发关键词 | 技能组合 | 核心目的 |
|-----|-----------|---------|---------|
| 项目启动 | 项目启动、立项、Kickoff | project-development + planning-with-files + brainstorming | 确定项目目标、范围、里程碑 |
| 需求规划 | 需求规划、需求分析、PRD | project-development + doc-coauthoring + brainstorming | 收集整理产品需求 |
| 技术方案设计 | 技术方案、架构设计、技术选型 | project-development + planning-with-files + context-fundamentals | 设计系统架构和技术方案 |
| 任务拆解 | 任务拆解、WBS、排期 | planning-with-files + executing-plans | 分解任务并制定执行计划 |
| 项目复盘 | 项目复盘、总结、回顾 | evaluation + advanced-evaluation + doc-coauthoring | 项目结束后的总结复盘 |

### 二、产品设计与开发（6个）

| 场景 | 触发关键词 | 技能组合 | 核心目的 |
|-----|-----------|---------|---------|
| UI/UX设计 | UI设计、界面设计、交互设计 | ui-ux-pro-max + canvas-design + frontend-design | 用户界面和交互设计 |
| UI重构 | UI重构、改版、界面优化 | frontend-design + ui-ux-pro-max + executing-plans | 现有UI重构优化 |
| 前端开发 | 前端开发、页面实现、前端功能 | frontend-design + ui-ux-pro-max + test-driven-development | 前端功能开发实现 |
| 后端开发 | 后端开发、API开发、服务端 | project-development + test-driven-development + executing-plans | 后端服务开发 |
| 数据库设计 | 数据库设计、表结构、Schema设计 | context-fundamentals + planning-with-files | 数据库架构设计 |
| 代码重构 | 代码重构、重构、代码优化 | test-driven-development + systematic-debugging | 代码重构优化 |

### 三、测试与质量（5个）

| 场景 | 触发关键词 | 技能组合 | 核心目的 |
|-----|-----------|---------|---------|
| 单元测试 | 单元测试、测试用例、Jest | test-driven-development + webapp-testing | 编写单元测试 |
| 集成/E2E测试 | 集成测试、E2E测试、自动化测试 | webapp-testing + test-driven-development | 集成和端到端测试 |
| 性能测试 | 性能测试、压测、负载测试 | evaluation + advanced-evaluation + webapp-testing | 系统性能测试 |
| 代码审查 | 代码审查、Code Review、CR | requesting-code-review + receiving-code-review + evaluation | 代码质量审查 |
| Bug修复 | Bug修复、问题排查、调试 | systematic-debugging + test-driven-development | 问题排查和修复 |

### 四、部署与运维（5个）

| 场景 | 触发关键词 | 技能组合 | 核心目的 |
|-----|-----------|---------|---------|
| 服务启动 | 启动服务、运行项目、启动应用 | project-development + executing-plans + hosted-agents | 启动项目服务 |
| CI/CD配置 | CI/CD、流水线、自动化部署 | executing-plans + project-development + using-git-worktrees | 配置持续集成部署 |
| 容器化部署 | Docker、容器化、Kubernetes | hosted-agents + executing-plans + project-development | 容器化部署 |
| 监控告警 | 监控、告警、日志 | systematic-debugging + evaluation + hosted-agents | 系统监控配置 |
| 故障处理 | 故障处理、应急响应、OnCall | systematic-debugging + executing-plans + project-development | 生产故障处理 |

### 五、文档与协作（5个）

| 场景 | 触发关键词 | 技能组合 | 核心目的 |
|-----|-----------|---------|---------|
| 技术文档 | 技术文档、API文档、开发文档 | doc-coauthoring + writing-skills + docx | 编写技术文档 |
| 演示汇报 | PPT、演示、汇报 | pptx + canvas-design + theme-factory | 制作演示文稿 |
| 技术分享 | 技术分享、Tech Talk、培训 | writing-skills + doc-coauthoring + pptx | 准备技术分享 |
| 会议记录 | 会议纪要、会议记录 | doc-coauthoring + writing-plans | 编写会议纪要 |
| 跨团队沟通 | 跨团队、协调、沟通 | internal-comms + doc-coauthoring | 跨团队协作沟通 |

### 六、AI与数据分析（4个）

| 场景 | 触发关键词 | 技能组合 | 核心目的 |
|-----|-----------|---------|---------|
| AI功能开发 | AI开发、模型接入、智能功能 | mcp-builder + project-development + frontend-design | 开发AI应用功能 |
| Prompt工程 | Prompt工程、提示词优化 | writing-skills + context-optimization + evaluation | 设计和优化提示词 |
| 数据分析 | 数据分析、报表、BI | xlsx + evaluation + context-fundamentals | 业务数据分析 |
| 数据可视化 | 数据可视化、图表、Dashboard | canvas-design + frontend-design | 数据可视化展示 |

## 使用流程

### 1. 意图识别
分析用户输入，识别属于哪个核心场景：
- 提取关键词
- 匹配上述映射表
- 确定主要场景

### 2. 技能触发
根据识别的场景，触发对应的技能组合：
- 先触发**流程类技能**（planning-with-files、brainstorming）
- 再触发**实现类技能**（frontend-design、docx）
- 最后触发**辅助类技能**（evaluation、verification-before-completion）

### 3. 执行顺序
```
用户输入
  ↓
意图识别 → 匹配场景 → 确定技能组合
  ↓
按优先级排序技能
  ↓
依次触发技能
  ↓
整合各技能指导，形成完整方案
  ↓
告知用户已加载的技能及执行计划
```

## 技能优先级

当多个技能同时触发时，按以下优先级执行：

1. **规划类**（最高优先级）
   - planning-with-files
   - brainstorming

2. **流程类**
   - project-development
   - executing-plans
   - test-driven-development

3. **领域类**
   - frontend-design
   - ui-ux-pro-max
   - docx / pptx / xlsx

4. **辅助类**
   - evaluation
   - systematic-debugging
   - verification-before-completion

## 组合场景处理

当用户输入涉及多个场景时，组合相应的技能：

### 示例："我要做一个新项目，先规划需求，然后设计UI，最后开发"
→ 触发技能组合：
1. planning-with-files（规划）
2. project-development（项目管理）
3. doc-coauthoring + brainstorming（需求文档）
4. ui-ux-pro-max + canvas-design（UI设计）
5. frontend-design（前端实现）
6. test-driven-development（开发）
7. executing-plans（执行）

### 示例："帮我审查代码并修复bug"
→ 触发技能组合：
1. requesting-code-review（代码审查）
2. systematic-debugging（调试）
3. test-driven-development（测试修复）
4. verification-before-completion（验证）

## 输出格式

触发技能后，向用户说明：

```
检测到您需要进行【场景名称】，已自动加载以下技能：

1. 【技能1名称】- 【作用说明】
2. 【技能2名称】- 【作用说明】
...

执行计划：
- 步骤1：...
- 步骤2：...
- 步骤3：...

让我们开始吧！
```
