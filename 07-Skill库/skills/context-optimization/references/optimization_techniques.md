# 上下文优化参考

本文档提供上下文优化技术和策略的详细技术参考。

## 压缩策略

### 基于摘要的压缩

基于摘要的压缩用简洁的摘要替换冗长的内容，同时保留关键信息。该方法通过识别可以压缩的部分，生成捕捉要点的摘要，并用摘要替换完整内容来工作。

压缩的有效性取决于保留了哪些信息。关键决策、用户偏好和当前任务状态不应被压缩。中间结果和支持证据可以更积极地总结。样板、重复信息和探索性推理通常可以完全移除。

### Token 预算分配

有效的上下文预算需要了解不同上下文组件如何消耗 token 并战略性地分配预算：

| 组件 | 典型范围 | 说明 |
|-----------|---------------|-------|
| 系统提示 | 500-2000 tokens | 跨会话稳定 |
| 工具定义 | 每个工具 100-500 | 随工具数量增长 |
| 检索的文档 | 可变 | 通常是最大消费者 |
| 消息历史 | 可变 | 随对话增长 |
| 工具输出 | 可变 | 可能主导上下文 |

### 压缩阈值

在适当的阈值触发压缩以保持性能：

- 在有效上下文限制的 70% 处设置警告阈值
- 在有效上下文限制的 80% 处触发压缩
- 在有效上下文限制的 90% 处进行激进压缩

确切的阈值取决于模型行为和任务特征。一些模型表现出优雅降级，而其他模型则表现出急剧的性能悬崖。

## 观察掩码模式

### 选择性掩码

并非所有观察都应该被同等掩码。考虑掩码那些已经发挥作用且不再需要用于主动推理的观察。保留对当前任务至关重要的观察。保留最近一轮的观察。保留可能再次被引用的观察。

### 掩码实现

```python
def selective_mask(observations: List[Dict], current_task: Dict) -> List[Dict]:
    """
    基于相关性选择性掩码观察。
    
    返回带有指示掩码内容的 mask 字段的观察。
    """
    masked = []
    
    for obs in observations:
        relevance = calculate_relevance(obs, current_task)
        
        if relevance < 0.3 and obs["age"] > 3:
            # 低相关性和旧 - 掩码
            masked.append({
                **obs,
                "masked": True,
                "reference": store_for_reference(obs["content"]),
                "summary": summarize_content(obs["content"])
            })
        else:
            masked.append({
                **obs,
                "masked": False
            })
    
    return masked
```

## KV-Cache 优化

### 前缀稳定性

KV-cache 命中率取决于前缀稳定性。稳定的前缀支持跨请求缓存重用。动态前缀使缓存失效并强制重新计算。

应保持稳定的元素包括系统提示、工具定义和常用模板。可能变化的元素包括时间戳、会话标识符和查询特定内容。

### 缓存友好设计

设计提示以最大化缓存命中率：

1. 将稳定内容放在开头
2. 跨请求使用一致的格式
3. 尽可能避免提示中的动态内容
4. 对动态内容使用占位符

```python
# 缓存不友好：提示中的动态时间戳
system_prompt = f"""
当前时间：{datetime.now().isoformat()}
你是一个有帮助的助手。
"""

# 缓存友好：稳定提示，动态时间作为变量
system_prompt = """
你是一个有帮助的助手。
相关时单独提供当前时间。
"""
```

## 上下文分区策略

### 子代理隔离

跨子代理分区工作，以防止任何单个上下文变得过大。每个子代理在专注于其子任务的干净上下文中运行。

### 分区规划

```python
def plan_partitioning(task: Dict, context_limit: int) -> Dict:
    """
    基于上下文限制规划如何分区任务。
    
    返回分区策略和子任务定义。
    """
    estimated_context = estimate_task_context(task)
    
    if estimated_context <= context_limit:
        return {
            "strategy": "single_agent",
            "subtasks": [task]
        }
    
    # 规划多代理方法
    subtasks = decompose_task(task)
    
    return {
        "strategy": "multi_agent",
        "subtasks": subtasks,
        "coordination": "hierarchical"
    }
```

## 优化决策框架

### 何时优化

当上下文利用率超过 70%、响应质量随对话延长而下降、由于长上下文导致成本增加或延迟随对话长度增加时，考虑上下文优化。

### 应用什么优化

基于上下文组成选择优化策略：

如果工具输出主导上下文，应用观察掩码。如果检索的文档主导上下文，应用摘要或分区。如果消息历史主导上下文，应用带摘要的压缩。如果多个组件贡献，结合策略。

### 优化评估

应用优化后，评估有效性：

- 测量实现的 token 减少
- 测量质量保留（输出质量不应下降）
- 测量延迟改进
- 测量成本降低

基于评估结果迭代优化策略。

## 常见陷阱

### 过度激进压缩

过于激进地压缩可能会移除关键信息。始终保留任务目标、用户偏好和最近的对话上下文。在增加激进程度级别测试压缩以找到最佳平衡。

### 掩码关键观察

掩码仍然需要的观察可能会导致错误。跟踪观察使用情况，仅掩码不再引用的内容。考虑保留对掩码内容的引用，以便在需要时可以检索。

### 忽略注意力分布

"迷失在中间"现象意味着信息放置很重要。将关键信息放在注意力偏好的位置（上下文的开头和结尾）。使用显式标记突出重要内容。

### 过早优化

并非所有上下文都需要优化。添加优化机制有开销。仅当上下文限制实际约束代理性能时才进行优化。

## 监控和告警

### 关键指标

跟踪这些指标以了解优化需求：

- 随时间的上下文 token 计数
- 重复模式的缓存命中率
- 按上下文大小的响应质量指标
- 按上下文长度的每次对话成本
- 按上下文大小的延迟

### 告警阈值

为以下情况设置告警：

- 上下文利用率超过 80%
- 缓存命中率低于 50%
- 质量分数下降超过 10%
- 成本超过基线

## 集成模式

### 与代理框架集成

将优化集成到代理工作流中：

```python
class OptimizingAgent:
    def __init__(self, context_limit: int = 80000):
        self.context_limit = context_limit
        self.optimizer = ContextOptimizer()
    
    def process(self, user_input: str, context: Dict) -> Dict:
        # 检查是否需要优化
        if self.optimizer.should_compact(context):
            context = self.optimizer.compact(context)
        
        # 使用优化的上下文处理
        response = self._call_model(user_input, context)
        
        # 跟踪指标
        self.optimizer.record_metrics(context, response)
        
        return response
```

### 与记忆系统集成

将优化与记忆系统连接：

```python
class MemoryAwareOptimizer:
    def __init__(self, memory_system, context_limit: int):
        self.memory = memory_system
        self.limit = context_limit
    
    def optimize_context(self, current_context: Dict, task: str) -> Dict:
        # 检查信息是否在记忆中
        relevant_memories = self.memory.retrieve(task)
        
        # 如果不需要在上下文中，将信息移动到记忆
        for mem in relevant_memories:
            if mem["importance"] < threshold:
                current_context = remove_from_context(current_context, mem)
                # 保留可以检索记忆的引用
        
        return current_context
```

## 性能基准

### 压缩性能

压缩应减少 token 计数同时保留质量。目标：

- 激进压缩减少 50-70% 的 token
- 压缩导致的质量下降小于 5%
- 压缩开销导致的延迟增加小于 10%

### 掩码性能

观察掩码应显著减少 token 计数：

- 掩码观察减少 60-80%
- 掩码导致的质量影响小于 2%
- 接近零的延迟开销

### 缓存性能

KV-cache 优化应改善成本和延迟：

- 稳定工作负载的缓存命中率 70%+
- 缓存命中带来的成本降低 50%+
- 缓存命中带来的延迟降低 40%+
