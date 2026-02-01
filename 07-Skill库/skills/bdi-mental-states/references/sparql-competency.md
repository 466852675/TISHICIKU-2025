# SPARQL 能力查询

基于能力问题的 BDI 本体实现验证查询。

## 心理实体查询

### CQ1：所有心理实体是什么？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?entity ?type WHERE {
    ?entity rdf:type ?type .
    ?type rdfs:subClassOf* bdi:MentalEntity .
}
```

### CQ2：代理持有什么信念？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?belief ?label WHERE {
    ?agent bdi:hasMentalState ?belief .
    ?belief a bdi:Belief .
    OPTIONAL { ?belief rdfs:label ?label }
}
```

### CQ3：代理有什么欲望？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?desire ?label WHERE {
    ?agent bdi:hasDesire ?desire .
    ?desire a bdi:Desire .
    OPTIONAL { ?desire rdfs:label ?label }
}
```

### CQ4：代理承诺了什么意图？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?intention ?label WHERE {
    ?agent bdi:hasIntention ?intention .
    ?intention a bdi:Intention .
    OPTIONAL { ?intention rdfs:label ?label }
}
```

## 动机链查询

### CQ5：什么信念促成了给定欲望的形成？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?belief ?beliefLabel WHERE {
    ?desire bdi:isMotivatedBy ?belief .
    ?belief a bdi:Belief .
    OPTIONAL { ?belief rdfs:label ?beliefLabel }
}
```

### CQ6：特定意图实现了哪个欲望？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?desire ?desireLabel WHERE {
    ?intention bdi:fulfils ?desire .
    ?desire a bdi:Desire .
    OPTIONAL { ?desire rdfs:label ?desireLabel }
}
```

### CQ7：什么信念支持给定的意图？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?belief ?label WHERE {
    ?intention bdi:isSupportedBy ?belief .
    ?belief a bdi:Belief .
    OPTIONAL { ?belief rdfs:label ?label }
}
```

### CQ8：追踪意图的完整认知链

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?intention ?desire ?belief ?worldState WHERE {
    ?intention a bdi:Intention ;
               bdi:fulfils ?desire ;
               bdi:isSupportedBy ?belief .
    ?desire bdi:isMotivatedBy ?belief .
    ?belief bdi:refersTo ?worldState .
}
```

## 心理过程查询

### CQ9：哪个心理过程生成了信念？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?process ?processType WHERE {
    ?process bdi:generates ?belief .
    ?belief a bdi:Belief .
    ?process a ?processType .
    FILTER(?processType != owl:NamedIndividual)
}
```

### CQ10：什么触发了心理过程？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?process ?trigger ?triggerType WHERE {
    ?process a bdi:MentalProcess ;
             bdi:isTriggeredBy ?trigger .
    ?trigger a ?triggerType .
}
```

### CQ11：心理过程推理了什么？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?process ?input WHERE {
    ?process a bdi:MentalProcess ;
             bdi:reasonsUpon ?input .
}
```

## 计划和目标查询

### CQ12：意图指定了什么计划？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?intention ?plan ?goal WHERE {
    ?intention bdi:specifies ?plan .
    ?plan a bdi:Plan ;
          bdi:addresses ?goal .
}
```

### CQ13：计划中任务的有序序列是什么？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?plan ?task ?nextTask WHERE {
    ?plan a bdi:Plan ;
          bdi:hasComponent ?task .
    OPTIONAL { ?task bdi:precedes ?nextTask }
}
ORDER BY ?task
```

### CQ14：计划的第一个和最后一个任务是什么？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?plan ?firstTask ?lastTask WHERE {
    ?plan a bdi:Plan ;
          bdi:beginsWith ?firstTask ;
          bdi:endsWith ?lastTask .
}
```

### CQ15：哪些动作执行了哪些任务？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?action ?task ?time WHERE {
    ?action bdi:isExecutionOf ?task ;
            bdi:atTime ?time .
}
ORDER BY ?time
```

## 时间查询

### CQ16：特定时间有哪些心理状态有效？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?mentalState ?type WHERE {
    ?mentalState bdi:hasValidity ?interval .
    ?interval bdi:hasStartTime ?start ;
              bdi:hasEndTime ?end .
    ?mentalState a ?type .
    FILTER(?start <= "2026-01-04T10:00:00"^^xsd:dateTime && 
           ?end >= "2026-01-04T10:00:00"^^xsd:dateTime)
}
```

### CQ17：信念是什么时候形成的？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?belief ?formationTime WHERE {
    ?process bdi:generates ?belief ;
             bdi:atTime ?formationTime .
    ?belief a bdi:Belief .
}
```

### CQ18：意图的时间有效性是什么？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?intention ?start ?end WHERE {
    ?intention a bdi:Intention ;
               bdi:hasValidity ?interval .
    ?interval bdi:hasStartTime ?start ;
              bdi:hasEndTime ?end .
}
```

## 正当性查询

### CQ19：什么正当化了信念？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?belief ?justification ?justLabel WHERE {
    ?belief a bdi:Belief ;
            bdi:isJustifiedBy ?justification .
    OPTIONAL { ?justification rdfs:label ?justLabel }
}
```

### CQ20：什么正当化了意图？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?intention ?justification ?justLabel WHERE {
    ?intention a bdi:Intention ;
               bdi:isJustifiedBy ?justification .
    OPTIONAL { ?justification rdfs:label ?justLabel }
}
```

## 组合查询

### CQ21：复杂信念的组成部分是什么？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?belief ?part ?partLabel WHERE {
    ?belief a bdi:Belief ;
            bdi:hasPart ?part .
    OPTIONAL { ?part rdfs:label ?partLabel }
}
```

### CQ22：查找组合心理实体

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?composite (COUNT(?part) AS ?partCount) WHERE {
    ?composite bdi:hasPart ?part .
}
GROUP BY ?composite
HAVING (COUNT(?part) > 1)
```

## 世界状态查询

### CQ23：信念指的是什么世界状态？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?belief ?worldState ?wsComment WHERE {
    ?belief a bdi:Belief ;
            bdi:refersTo ?worldState .
    OPTIONAL { ?worldState rdfs:comment ?wsComment }
}
```

### CQ24：什么动作带来了世界状态？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?action ?worldState WHERE {
    ?action bdi:bringsAbout ?worldState .
    ?worldState a bdi:WorldState .
}
```

### CQ25：代理感知到了哪些世界状态？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?agent ?worldState ?time WHERE {
    ?agent bdi:perceives ?worldState .
    OPTIONAL { ?worldState bdi:atTime ?time }
}
```

## 验证查询（OWLUnit 风格）

### V1：每个意图必须实现恰好一个欲望

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?intention WHERE {
    ?intention a bdi:Intention .
    FILTER NOT EXISTS { ?intention bdi:fulfils ?desire }
}
# 预期：空结果集
```

### V2：每个信念必须引用一个世界状态

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?belief WHERE {
    ?belief a bdi:Belief .
    FILTER NOT EXISTS { ?belief bdi:refersTo ?worldState }
}
# 预期：空结果集（或仅抽象信念）
```

### V3：心理过程必须推理某些东西

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?process WHERE {
    ?process a bdi:MentalProcess .
    FILTER NOT EXISTS { ?process bdi:reasonsUpon ?input }
}
# 预期：空结果集
```

### V4：信念过程必须只生成信念

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?process ?generated WHERE {
    ?process a bdi:BeliefProcess ;
             bdi:generates ?generated .
    FILTER NOT EXISTS { ?generated a bdi:Belief }
}
# 预期：空结果集
```

### V5：计划必须有开始和结束任务

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?plan WHERE {
    ?plan a bdi:Plan .
    FILTER NOT EXISTS { 
        ?plan bdi:beginsWith ?first ;
              bdi:endsWith ?last 
    }
}
# 预期：空结果集
```

## 多代理查询

### CQ26：哪些信念在代理之间共享？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?belief (COUNT(DISTINCT ?agent) AS ?agentCount) WHERE {
    ?agent bdi:hasMentalState ?belief .
    ?belief a bdi:Belief .
}
GROUP BY ?belief
HAVING (COUNT(DISTINCT ?agent) > 1)
```

### CQ27：哪些代理共享相同的欲望？

```sparql
PREFIX bdi: <https://w3id.org/fossr/ontology/bdi/>

SELECT ?desire ?agent1 ?agent2 WHERE {
    ?agent1 bdi:hasDesire ?desire .
    ?agent2 bdi:hasDesire ?desire .
    FILTER(?agent1 != ?agent2)
}
```
