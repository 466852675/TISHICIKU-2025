# BDI 本体核心模式

用于信念-愿望-意图心理状态建模的核心本体设计模式。

## 类层次结构

### 心理实体（Endurants）

```
bdi:MentalEntity
├── bdi:Belief          # 信息维度
├── bdi:Desire          # 动机维度  
├── bdi:Intention       # 审议维度
├── bdi:Goal            # 期望终态的描述
└── bdi:Plan            # 结构化动作序列
```

### 心理过程（Perdurants）

```
bdi:MentalProcess
├── bdi:BeliefProcess      # 从感知形成/更新信念
├── bdi:DesireProcess      # 从信念生成愿望
├── bdi:IntentionProcess   # 将愿望承诺为意图
├── bdi:Planning           # 将意图转化为计划
└── bdi:PlanExecution      # 执行计划动作
```

### 支持实体

```
bdi:WorldState        # 环境配置
bdi:Justification     # 心理状态的证据基础
bdi:Task              # 计划动作的原子单元
bdi:Action            # 任务的执行
bdi:TimeInterval      # 时间有效性边界
bdi:TimeInstant       # 时间点参考
```

## 对象属性

### 动机关系

| 属性 | 域 | 范围 | 描述 |
|----------|--------|-------|-------------|
| `motivates` | 信念 | 愿望 | 信念为愿望提供理由 |
| `isMotivatedBy` | 愿望 | 信念 | motivates 的逆关系 |
| `fulfils` | 意图 | 愿望 | 意图承诺实现愿望 |
| `isFulfilledBy` | 愿望 | 意图 | fulfils 的逆关系 |
| `isSupportedBy` | 意图 | 信念 | 支持意图可行性的信念 |

### 生成关系

| 属性 | 域 | 范围 | 描述 |
|----------|--------|-------|-------------|
| `generates` | 心理过程 | 心理实体 | 过程创建心理状态 |
| `isGeneratedBy` | 心理实体 | 心理过程 | generates 的逆关系 |
| `modifies` | 心理过程 | 心理实体 | 过程更新现有状态 |
| `suppresses` | 心理过程 | 心理实体 | 过程停用状态 |
| `isTriggeredBy` | 心理过程 | 心理实体 | 状态启动过程 |

### 指称关系

| 属性 | 域 | 范围 | 描述 |
|----------|--------|-------|-------------|
| `refersTo` | 心理实体 | 世界状态 | 关于世界的心理状态 |
| `perceives` | 智能体 | 世界状态 | 智能体观察世界 |
| `bringsAbout` | 动作 | 世界状态 | 动作导致世界变化 |
| `reasonsUpon` | 心理过程 | 心理实体 | 推理的输入 |

### 结构关系

| 属性 | 域 | 范围 | 描述 |
|----------|--------|-------|-------------|
| `hasPart` | 心理实体 | 心理实体 | 部分-整体构成 |
| `specifies` | 意图 | 计划 | 意图定义计划 |
| `addresses` | 计划 | 目标 | 计划实现目标 |
| `hasComponent` | 计划 | 任务 | 计划包含任务 |
| `precedes` | 任务 | 任务 | 任务排序 |

### 时间关系

| 属性 | 域 | 范围 | 描述 |
|----------|--------|-------|-------------|
| `atTime` | 实体 | 时间点 | 点发生 |
| `hasValidity` | 心理实体 | 时间间隔 | 持续性边界 |
| `hasStartTime` | 时间间隔 | 时间点 | 间隔开始 |
| `hasEndTime` | 时间间隔 | 时间点 | 间隔结束 |

### 论证关系

| 属性 | 域 | 范围 | 描述 |
|----------|--------|-------|-------------|
| `isJustifiedBy` | 心理实体 | 论证 | 证据支持 |
| `justifies` | 论证 | 心理实体 | 逆关系 |

## 本体限制

### 信念限制

```turtle
bdi:Belief rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty bdi:refersTo ;
    owl:someValuesFrom bdi:WorldState
] .

bdi:Belief rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty bdi:hasValidity ;
    owl:maxCardinality 1
] .
```

### 愿望限制

```turtle
bdi:Desire rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty bdi:isMotivatedBy ;
    owl:someValuesFrom bdi:Belief
] .
```

### 意图限制

```turtle
bdi:Intention rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty bdi:fulfils ;
    owl:cardinality 1
] .

bdi:Intention rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty bdi:isSupportedBy ;
    owl:someValuesFrom bdi:Belief
] .
```

### 心理过程限制

```turtle
bdi:BeliefProcess rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty bdi:generates ;
    owl:allValuesFrom bdi:Belief
] .

bdi:DesireProcess rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty bdi:generates ;
    owl:allValuesFrom bdi:Desire
] .

bdi:IntentionProcess rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty bdi:generates ;
    owl:allValuesFrom bdi:Intention
] .
```

## DOLCE 对齐

BDI 本体与 DOLCE Ultra Lite (DUL) 基础本体对齐：

| BDI 类 | DUL 超类 | 理由 |
|-----------|----------------|-----------|
| `Agent` | `dul:Agent` | 能够执行动作的意向实体 |
| `Belief` | `dul:InformationObject` | 承载信息的实体 |
| `Desire` | `dul:Description` | 描述期望状态 |
| `Intention` | `dul:Description` | 描述承诺的行动路线 |
| `Goal` | `dul:Goal` | 期望终态的描述 |
| `Plan` | `dul:Plan` | 有组织的动作序列 |
| `WorldState` | `dul:Situation` | 实体配置 |
| `MentalProcess` | `dul:Event` | 时间上延伸的事件 |
| `Task` | `dul:Task` | 计划工作单元 |
| `Action` | `dul:Action` | 已执行的任务实例 |

## 重用的本体设计模式

### EventCore 模式
用于具有时间方面和参与者角色的心理过程。

### Situation 模式  
用于心理状态引用的世界状态配置。

### TimeIndexedSituation 模式
用于将心理状态与有效性间隔关联。

### BasicPlan 模式
用于将意图链接到动作的目标-计划-任务结构。

### Provenance 模式
用于论证跟踪和证据链。

## 命名空间声明

```turtle
@prefix bdi: <https://w3id.org/fossr/ontology/bdi/> .
@prefix dul: <http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
```
