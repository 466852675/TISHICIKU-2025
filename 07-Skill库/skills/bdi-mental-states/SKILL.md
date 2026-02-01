---
name: bdi-mental-states
description: 当用户要求"建模代理心理状态"、"实现BDI架构"、"创建信念-欲望-意图模型"、"将RDF转换为信念"、"构建认知代理"，或提及BDI本体、心理状态建模、理性代理或神经符号AI集成时使用此技能。
---

# BDI心理状态建模

将外部RDF上下文转换为代理心理状态（信念、欲望、意图），使用正式的BDI本体模式。此技能使代理能够通过认知架构对上下文进行推理，支持多代理系统中的审慎推理、可解释性和语义互操作性。

## 何时激活

在以下情况下激活此技能：

- 将外部RDF上下文处理为代理对世界状态的信念
- 使用感知、审议和行动周期建模理性代理
- 通过可追溯的推理链实现可解释性
- 实现BDI框架（SEMAS、JADE、JADEX）
- 用正式认知结构增强LLM（逻辑增强生成）
- 跨多代理平台协调心理状态
- 跟踪信念、欲望和意图的时间演变
- 将动机状态链接到行动计划

## 核心概念

### 心理现实架构

**心理状态（Endurants）**：持久的认知属性
- `Belief`：代理相信为真的关于世界的内容
- `Desire`：代理希望实现的内容
- `Intention`：代理承诺实现的内容

**心理过程（Perdurants）**：修改心理状态的事件
- `BeliefProcess`：从感知形成/更新信念
- `DesireProcess`：从信念生成欲望
- `IntentionProcess`：将欲望承诺为可行动的意图

### 认知链模式

```turtle
:Belief_store_open a bdi:Belief ;
    rdfs:comment "商店营业" ;
    bdi:motivates :Desire_buy_groceries .

:Desire_buy_groceries a bdi:Desire ;
    rdfs:comment "我想买杂货" ;
    bdi:isMotivatedBy :Belief_store_open .

:Intention_go_shopping a bdi:Intention ;
    rdfs:comment "我要去买杂货" ;
    bdi:fulfils :Desire_buy_groceries ;
    bdi:isSupportedBy :Belief_store_open ;
    bdi:specifies :Plan_shopping .
```

### 世界状态基础

心理状态引用环境的结构化配置：

```turtle
:Agent_A a bdi:Agent ;
    bdi:perceives :WorldState_WS1 ;
    bdi:hasMentalState :Belief_B1 .

:WorldState_WS1 a bdi:WorldState ;
    rdfs:comment "上午10点在5号房间安排会议" ;
    bdi:atTime :TimeInstant_10am .

:Belief_B1 a bdi:Belief ;
    bdi:refersTo :WorldState_WS1 .
```

### 目标导向规划

意图指定通过任务序列解决目标的计划：

```turtle
:Intention_I1 bdi:specifies :Plan_P1 .

:Plan_P1 a bdi:Plan ;
    bdi:addresses :Goal_G1 ;
    bdi:beginsWith :Task_T1 ;
    bdi:endsWith :Task_T3 .

:Task_T1 bdi:precedes :Task_T2 .
:Task_T2 bdi:precedes :Task_T3 .
```

## T2B2T范式

Triples-to-Beliefs-to-Triples实现了RDF知识图谱与内部心理状态之间的双向流动：

**阶段1：Triples-to-Beliefs**
```turtle
# 外部RDF上下文触发信念形成
:WorldState_notification a bdi:WorldState ;
    rdfs:comment "推送通知：付款请求$250" ;
    bdi:triggers :BeliefProcess_BP1 .

:BeliefProcess_BP1 a bdi:BeliefProcess ;
    bdi:generates :Belief_payment_request .
```

**阶段2：Beliefs-to-Triples**
```turtle
# 心理审议产生新的RDF输出
:Intention_pay a bdi:Intention ;
    bdi:specifies :Plan_payment .

:PlanExecution_PE1 a bdi:PlanExecution ;
    bdi:satisfies :Plan_payment ;
    bdi:bringsAbout :WorldState_payment_complete .
```

## 按级别选择表示法

| C4级别 | 表示法 | 心理状态表示 |
|----------|----------|----------------------------|
| L1 上下文 | ArchiMate | 代理边界、外部感知源 |
| L2 容器 | ArchiMate | BDI推理引擎、信念存储、计划执行器 |
| L3 组件 | UML | 心理状态管理器、过程处理器 |
| L4 代码 | UML/RDF | 信念/欲望/意图类、本体实例 |

## 正当性与可解释性

心理实体链接到支持证据以实现可追溯的推理：

```turtle
:Belief_B1 a bdi:Belief ;
    bdi:isJustifiedBy :Justification_J1 .

:Justification_J1 a bdi:Justification ;
    rdfs:comment "通过电子邮件收到的官方公告" .

:Intention_I1 a bdi:Intention ;
    bdi:isJustifiedBy :Justification_J2 .

:Justification_J2 a bdi:Justification ;
    rdfs:comment "位置前提条件已满足" .
```

## 时间维度

心理状态在有限时间段内持续：

```turtle
:Belief_B1 a bdi:Belief ;
    bdi:hasValidity :TimeInterval_TI1 .

:TimeInterval_TI1 a bdi:TimeInterval ;
    bdi:hasStartTime :TimeInstant_9am ;
    bdi:hasEndTime :TimeInstant_11am .
```

在特定时刻查询活跃的心理状态：

```sparql
SELECT ?mentalState WHERE {
    ?mentalState bdi:hasValidity ?interval .
    ?interval bdi:hasStartTime ?start ;
              bdi:hasEndTime ?end .
    FILTER(?start <= "2025-01-04T10:00:00"^^xsd:dateTime && 
           ?end >= "2025-01-04T10:00:00"^^xsd:dateTime)
}
```

## 组合心理实体

复杂心理实体分解为组成部分以进行选择性更新：

```turtle
:Belief_meeting a bdi:Belief ;
    rdfs:comment "上午10点在5号房间开会" ;
    bdi:hasPart :Belief_meeting_time , :Belief_meeting_location .

# 仅更新位置组件
:BeliefProcess_update a bdi:BeliefProcess ;
    bdi:modifies :Belief_meeting_location .
```

## 集成模式

### 逻辑增强生成（LAG）

用本体约束增强LLM输出：

```python
def augment_llm_with_bdi_ontology(prompt, ontology_graph):
    ontology_context = serialize_ontology(ontology_graph, format='turtle')
    augmented_prompt = f"{ontology_context}\n\n{prompt}"
    
    response = llm.generate(augmented_prompt)
    triples = extract_rdf_triples(response)
    
    is_consistent = validate_triples(triples, ontology_graph)
    return triples if is_consistent else retry_with_feedback()
```

### SEMAS规则转换

将BDI本体映射到可执行的产生式规则：

```prolog
% 信念触发欲望形成
[HEAD: belief(agent_a, store_open)] / 
[CONDITIONALS: time(weekday_afternoon)] » 
[TAIL: generate_desire(agent_a, buy_groceries)].

% 欲望触发意图承诺
[HEAD: desire(agent_a, buy_groceries)] / 
[CONDITIONALS: belief(agent_a, has_shopping_list)] » 
[TAIL: commit_intention(agent_a, buy_groceries)].
```

## 指南

1. 将世界状态建模为独立于代理视角的配置，为心理状态提供指称基础。

2. 区分endurants（持久心理状态）与perdurants（时间性心理过程），与DOLCE本体保持一致。

3. 将目标视为描述而非心理状态，保持认知层与规划层之间的分离。

4. 对使能选择性信念更新的部分结构使用`hasPart`关系。

5. 通过`atTime`或`hasValidity`将每个心理实体与时间构造关联。

6. 对灵活查询使用双向属性对（`motivates`/`isMotivatedBy`、`generates`/`isGeneratedBy`）。

7. 将心理实体链接到`Justification`实例以实现可解释性和信任。

8. 通过以下方式实现T2B2T：(1) 将RDF转换为信念，(2) 执行BDI推理，(3) 将心理状态投射回RDF。

9. 对心理过程定义存在限制（例如，`BeliefProcess ⊑ ∃generates.Belief`）。

10. 为互操作性重用已建立的ODP（EventCore、Situation、TimeIndexedSituation、BasicPlan、Provenance）。

## 能力问题

使用这些SPARQL查询验证实现：

```sparql
# CQ1：什么信念促成了给定欲望的形成？
SELECT ?belief WHERE {
    :Desire_D1 bdi:isMotivatedBy ?belief .
}

# CQ2：特定意图实现了哪个欲望？
SELECT ?desire WHERE {
    :Intention_I1 bdi:fulfils ?desire .
}

# CQ3：哪个心理过程生成了信念？
SELECT ?process WHERE {
    ?process bdi:generates :Belief_B1 .
}

# CQ4：计划中任务的有序序列是什么？
SELECT ?task ?nextTask WHERE {
    :Plan_P1 bdi:hasComponent ?task .
    OPTIONAL { ?task bdi:precedes ?nextTask }
} ORDER BY ?task
```

## 反模式

1. **混淆心理状态与世界状态**：心理状态引用世界状态，它们本身不是世界状态。

2. **缺少时间边界**：每个心理状态应该有有效区间以进行历时推理。

3. **扁平信念结构**：对复杂信念使用具有`hasPart`的组合建模。

4. **隐含的正当性**：始终将心理实体链接到明确的正当性实例。

5. **直接的意图到行动映射**：意图指定包含任务的计划；行动执行任务。

## 集成

- **RDF处理**：在解析外部RDF上下文以构建认知表示后应用
- **语义推理**：与本体推理结合以推断隐式心理状态关系
- **多代理通信**：与FIPA ACL集成以进行跨平台信念共享
- **时间上下文**：与时间推理协调以进行心理状态演变
- **可解释AI**：输入追溯从感知到审议再到行动的推理的解释系统
- **神经符号AI**：在LAG流程中应用以用认知结构约束LLM输出

## 参考

参见`references/`文件夹以获取详细文档：
- `bdi-ontology-core.md` - 核心本体模式和类定义
- `rdf-examples.md` - 完整的RDF/Turtle示例
- `sparql-competency.md` - 完整的能力问题SPARQL查询
- `framework-integration.md` - SEMAS、JADE、LAG集成模式

主要来源：
- Zuppiroli等人"The Belief-Desire-Intention Ontology"（2025）
- Rao & Georgeff "BDI agents: From theory to practice"（1995）
- Bratman "Intention, plans, and practical reason"（1987）
