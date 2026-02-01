# 架构简化：生产证据

本文档为代理工具设计的架构简化方法提供详细证据和实现模式。

## 案例研究：Text-to-SQL 代理

一个生产 text-to-SQL 代理使用架构简化原则重建。原始架构使用带有大量提示工程和仔细上下文管理的专业工具。简化架构使用单个 bash 命令执行工具。

### 原始架构（许多专业工具）

原始系统包括：
- GetEntityJoins：查找实体之间的关系
- LoadCatalog：加载数据目录信息
- RecallContext：检索先前上下文
- LoadEntityDetails：获取实体规范
- SearchCatalog：搜索数据目录
- ClarifyIntent：澄清用户意图
- SearchSchema：搜索数据库模式
- GenerateAnalysisPlan：创建查询计划
- FinalizeQueryPlan：完成查询计划
- FinalizeNoData：处理无数据情况
- JoinPathFinder：查找连接路径
- SyntaxValidator：验证 SQL 语法
- FinalizeBuild：完成查询构建
- ExecuteSQL：运行 SQL 查询
- FormatResults：格式化查询结果
- VisualizeData：创建可视化
- ExplainResults：解释查询结果

每个工具解决团队预期模型会面临的特定问题。假设是模型会在复杂模式中迷失、做出错误的连接，或产生幻觉表名。

### 简化架构（两个原始工具）

简化系统包括：
- ExecuteCommand：在沙箱中运行任意 bash 命令
- ExecuteSQL：针对数据库运行 SQL 查询

代理使用标准 Unix 工具探索语义层：

```python
from vercel_sandbox import Sandbox

sandbox = Sandbox.create()
await sandbox.write_files(semantic_layer_files)

def execute_command(command: str):
    """在沙箱中执行任意 bash 命令。"""
    result = sandbox.exec(command)
    return {
        "stdout": result.stdout,
        "stderr": result.stderr,
        "exit_code": result.exit_code
    }
```

代理现在使用 `grep`、`cat`、`find` 和 `ls` 导航包含维度定义、度量计算和连接关系的 YAML、Markdown 和 JSON 文件。

### 比较结果

| 指标 | 原始（17 个工具） | 简化（2 个工具） | 变化 |
|--------|---------------------|-------------------|--------|
| 平均执行时间 | 274.8s | 77.4s | 3.5 倍更快 |
| 成功率 | 80% (4/5) | 100% (5/5) | +20% |
| 平均 token 使用 | ~102k tokens | ~61k tokens | 减少 37% |
| 平均步骤 | ~12 步 | ~7 步 | 减少 42% |

原始架构中的最坏情况：724 秒、100 步、145,463 个 token，以及失败。简化架构在 141 秒内完成相同查询，19 步和 67,483 个 token，成功。

## 为什么简化有效

### 文件系统是强大的抽象

文件系统有 50 多年的改进。像 `grep` 这样的标准 Unix 工具文档完善、可预测，且模型理解。为 Unix 已解决的问题构建自定义工具会增加复杂性而没有价值。

### 工具正在约束推理

专业工具正在解决模型自己能处理的问题：
- 预过滤模型能导航的上下文
- 约束模型能评估的选项
- 在模型不需要的验证逻辑中包装交互

每个护栏都成为维护负担。每次模型更新都需要重新校准约束。团队花在维护脚手架上的时间比改进代理还多。

### 好的文档取代工具复杂性

语义层已经有完善的文档：
- 结构化 YAML 中的维度定义
- 命名清晰的度量计算
- 可导航文件中的连接关系

自定义工具正在总结已经可读的内容。模型需要直接访问阅读文档，而不是其上的抽象。

## 实现模式

### 文件系统代理

```python
from ai import ToolLoopAgent, tool
from sandbox import Sandbox

# 创建带有数据层的沙箱环境
sandbox = Sandbox.create()
await sandbox.write_files(data_layer_files)

# 单个原始工具
def create_execute_tool(sandbox):
    return tool(
        name="execute_command",
        description="""
        在沙箱环境中执行 bash 命令。
        
        使用标准 Unix 工具探索和理解数据层：
        - ls：列出目录内容
        - cat：读取文件内容
        - grep：搜索模式
        - find：定位文件
        
        沙箱包含语义层文档：
        - /data/entities/*.yaml：实体定义
        - /data/measures/*.yaml：度量计算  
        - /data/joins/*.yaml：连接关系
        - /docs/*.md：附加文档
        """,
        execute=lambda command: sandbox.exec(command)
    )

# 最小代理
agent = ToolLoopAgent(
    model="claude-opus-4.5",
    tools={
        "execute_command": create_execute_tool(sandbox),
        "execute_sql": sql_tool,
    }
)
```

### 成功的前提条件

此模式在以下情况下有效：

1. **文档质量高**：文件结构良好、命名一致，并包含清晰定义。

2. **模型能力足够**：模型无需手把手指导就能推理复杂性。

3. **安全约束允许**：沙箱限制代理能访问和修改的内容。

4. **领域可导航**：问题空间可通过文件检查探索。

### 何时不使用

简化在以下情况下失败：

1. **数据层混乱**：遗留命名约定、未记录的连接、不一致的结构。模型会产生更快的错误查询。

2. **需要专业知识**：无法以文件形式记录的领域专业知识。

3. **安全需要限制**：必须为安全或合规约束的操作。

4. **工作流真正复杂**：从结构化编排中受益的多步骤流程。

## 设计原则

### 减法加法

最好的代理可能是工具最少的代理。每个工具都是为模型做出的选择。有时当给予原始能力而非约束工作流时，模型会做出更好的选择。

### 信任模型推理

现代模型能处理复杂性。因为你信任模型推理而约束推理往往适得其反。在构建护栏之前测试模型实际能做什么。

### 投资于上下文，而非工具

基础比巧妙工具更重要：
- 清晰的文件命名约定
- 结构良好的文档
- 一致的数据组织
- 可读的关系定义

### 为未来模型构建

模型改进速度比工具能跟上的速度快。为今天模型限制优化的架构可能对明天模型能力过度约束。构建从模型改进中受益的最小架构。

## 评估框架

考虑架构简化时，评估：

1. **维护开销**：花在维护工具与改进结果上的时间有多少？

2. **失败分析**：失败是由模型限制还是工具约束引起的？

3. **文档质量**：如果给予访问权限，模型能否直接导航你的数据层？

4. **约束必要性**：护栏是保护免受真实风险还是假设担忧？

5. **模型能力**：自工具设计以来模型是否有所改进？

## 结论

架构简化并非普遍适用，但该原则挑战了一个常见假设：更复杂的工具会带来更好的结果。有时相反才是正确的。从尽可能简单的架构开始，仅在证明必要时添加复杂性，并不断质疑工具是在启用还是约束模型能力。

## 参考

- Vercel Engineering："我们移除了代理 80% 的工具"（2025 年 12 月）
- AI SDK ToolLoopAgent 文档
- Vercel Sandbox 文档
