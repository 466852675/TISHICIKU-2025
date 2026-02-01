# 上下文退化模式：技术参考

本文档提供诊断和测量上下文退化的技术细节。

## 注意力分布分析

### U 型曲线测量

测量跨上下文位置的注意力分布：

```python
def measure_attention_distribution(model, context_tokens, query):
    """
    测量注意力如何随上下文位置变化。
    
    返回显示按位置的注意力权重的分布。
    """
    attention_by_position = []
    
    for position in range(len(context_tokens)):
        # 测量模型对该位置的注意力
        attention = get_attention_weights(model, context_tokens, query, position)
        attention_by_position.append({
            "position": position,
            "attention": attention,
            "is_beginning": position < len(context_tokens) * 0.1,
            "is_end": position > len(context_tokens) * 0.9,
            "is_middle": True  # 将被覆盖
        })
    
    # 分类位置
    for item in attention_by_position:
        if item["is_beginning"] or item["is_end"]:
            item["region"] = "attention_favored"
        else:
            item["region"] = "attention_degraded"
    
    return attention_by_position
```

### 迷失在中间检测

检测关键信息何时落入退化的注意力区域：

```python
def detect_lost_in_middle(critical_positions, attention_distribution):
    """
    检查关键信息是否在注意力偏好的位置。
    
    参数：
        critical_positions: 包含关键信息的位置列表
        attention_distribution: 来自 measure_attention_distribution 的输出
    
    返回：
        包含检测结果和建议的字典
    """
    results = {
        "at_risk": [],
        "safe": [],
        "recommendations": []
    }
    
    for pos in critical_positions:
        region = attention_distribution[pos]["region"]
        if region == "attention_degraded":
            results["at_risk"].append(pos)
        else:
            results["safe"].append(pos)
    
    # 生成建议
    if results["at_risk"]:
        results["recommendations"].extend([
            "将关键信息移动到注意力偏好的位置",
            "使用显式标记突出关键信息",
            "考虑拆分上下文以减少中间部分"
        ])
    
    return results
```

## 上下文污染检测

### 幻觉追踪

跨对话轮次追踪潜在幻觉：

```python
class HallucinationTracker:
    def __init__(self):
        self.claims = []
        self.verifications = []
    
    def add_claims(self, text):
        """从文本中提取声明以供后续验证。"""
        claims = extract_claims(text)
        self.claims.extend([{"text": c, "verified": None} for c in claims])
    
    def verify_claims(self, ground_truth):
        """根据事实验证声明。"""
        for claim in self.claims:
            if claim["verified"] is None:
                claim["verified"] = check_claim(claim["text"], ground_truth)
    
    def get_poisoning_indicators(self):
        """
        返回潜在上下文污染的指标。
        
        高比例的未验证声明表明污染风险。
        """
        unverified = sum(1 for c in self.claims if not c["verified"])
        verified_false = sum(1 for c in self.claims if c["verified"] == False)
        
        return {
            "unverified_count": unverified,
            "false_count": verified_false,
            "poisoning_risk": verified_false > 0 or unverified > len(self.claims) * 0.3
        }
```

### 错误传播分析

追踪错误如何通过上下文流动：

```python
def analyze_error_propagation(context, error_points):
    """
    分析特定点的错误如何影响下游上下文。

    返回错误传播的可视化和影响评估。
    """
    impact_map = {}

    for error_point in error_points:
        # 查找对错误点之后内容的所有引用
        downstream_refs = find_references(context, after=error_point)

        for ref in downstream_refs:
            if ref not in impact_map:
                impact_map[ref] = []
            impact_map[ref].append({
                "source": error_point,
                "type": classify_error_type(context[error_point])
            })

    # 评估严重性
    high_impact_areas = [k for k, v in impact_map.items() if len(v) > 3]

    return {
        "impact_map": impact_map,
        "high_impact_areas": high_impact_areas,
        "requires_intervention": len(high_impact_areas) > 0
    }
```

## 干扰指标

### 相关性评分

对上下文元素与当前任务的相关性进行评分：

```python
def score_context_relevance(context_elements, task_description):
    """
    对每个上下文元素与当前任务的相关性进行评分。
    
    返回分数并识别高干扰元素。
    """
    task_embedding = embed(task_description)
    
    scored_elements = []
    for i, element in enumerate(context_elements):
        element_embedding = embed(element)
        relevance = cosine_similarity(task_embedding, element_embedding)
        scored_elements.append({
            "index": i,
            "content_preview": element[:100],
            "relevance_score": relevance
        })
    
    # 按相关性排序
    scored_elements.sort(key=lambda x: x["relevance_score"], reverse=True)
    
    # 识别潜在干扰物
    threshold = calculate_relevance_threshold(scored_elements)
    distractors = [e for e in scored_elements if e["relevance_score"] < threshold]
    
    return {
        "scored_elements": scored_elements,
        "distractors": distractors,
        "recommendation": f"考虑移除 {len(distractors)} 个低相关性元素"
    }
```

## 退化监控系统

### 上下文健康仪表板

实施上下文健康的持续监控：

```python
class ContextHealthMonitor:
    def __init__(self, model, context_window_limit):
        self.model = model
        self.limit = context_window_limit
        self.metrics = []
    
    def assess_health(self, context, task):
        """
        评估当前任务的总体上下文健康。
        
        返回综合分数和组件指标。
        """
        metrics = {
            "token_count": len(context),
            "utilization_ratio": len(context) / self.limit,
            "attention_distribution": measure_attention_distribution(self.model, context, task),
            "relevance_scores": score_context_relevance(context, task),
            "age_tokens": count_recent_tokens(context)
        }
        
        # 计算综合健康分数
        health_score = self._calculate_composite(metrics)
        
        result = {
            "health_score": health_score,
            "metrics": metrics,
            "status": self._interpret_score(health_score),
            "recommendations": self._generate_recommendations(metrics)
        }
        
        self.metrics.append(result)
        return result
    
    def _calculate_composite(self, metrics):
        """从组件计算综合健康分数。"""
        # 指标的加权组合
        utilization_penalty = min(metrics["utilization_ratio"] * 0.5, 0.3)
        attention_penalty = self._calculate_attention_penalty(metrics["attention_distribution"])
        relevance_penalty = self._calculate_relevance_penalty(metrics["relevance_scores"])
        
        base_score = 1.0
        score = base_score - utilization_penalty - attention_penalty - relevance_penalty
        return max(0, score)
    
    def _interpret_score(self, score):
        """解释健康分数并返回状态。"""
        if score > 0.8:
            return "healthy"
        elif score > 0.6:
            return "warning"
        elif score > 0.4:
            return "degraded"
        else:
            return "critical"
```

### 告警阈值

配置适当的告警阈值：

```python
CONTEXT_ALERTS = {
    "utilization_warning": 0.7,      # 上下文限制的 70%
    "utilization_critical": 0.9,     # 上下文限制的 90%
    "attention_degraded_ratio": 0.3, # 中间区域的 30%
    "relevance_threshold": 0.3,      # 低于 30% 相关性
    "consecutive_warnings": 3        # 三次警告触发告警
}
```

## 恢复程序

### 上下文截断策略

当上下文退化到无法恢复时，进行战略性截断：

```python
def truncate_context_for_recovery(context, preserved_elements, target_size):
    """
    在保留关键元素的同时截断上下文。
    
    策略：
    1. 保留系统提示和工具定义
    2. 保留最近的对话轮次
    3. 保留关键检索的文档
    4. 如果需要，总结旧内容
    5. 如果仍然超过目标，从中间截断
    """
    truncated = []
    
    # 类别 1：关键系统元素（始终保留）
    system_elements = extract_system_elements(context)
    truncated.extend(system_elements)
    
    # 类别 2：最近对话（保留更多）
    recent_turns = extract_recent_turns(context, num_turns=10)
    truncated.extend(recent_turns)
    
    # 类别 3：关键文档（保留关键文档）
    critical_docs = extract_critical_documents(context, preserved_elements)
    truncated.extend(critical_docs)
    
    return truncated
```
