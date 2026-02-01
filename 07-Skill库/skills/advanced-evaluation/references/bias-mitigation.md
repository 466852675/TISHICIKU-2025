# LLM 评估的偏见缓解技术

本参考详细介绍了在 LLM-as-a-Judge 系统中缓解已知偏见的技术。

## 位置偏见

### 问题所在

在成对比较中，LLM 系统性地偏好某些位置的响应。研究表明：
- GPT 有轻微的第一位置偏见（平局时约 55% 偏好第一位置）
- Claude 显示类似的模式
- 较小的模型通常表现出更强的偏见

### 缓解措施：位置交换协议

```python
async def position_swap_comparison(response_a, response_b, prompt, criteria):
    # 第一次：原始顺序
    result_ab = await compare(response_a, response_b, prompt, criteria)
    
    # 第二次：交换顺序
    result_ba = await compare(response_b, response_a, prompt, criteria)
    
    # 映射第二次结果（A 在第二位置 → B 在第一位置）
    result_ba_mapped = {
        'winner': {'A': 'B', 'B': 'A', 'TIE': 'TIE'}[result_ba['winner']],
        'confidence': result_ba['confidence']
    }
    
    # 一致性检查
    if result_ab['winner'] == result_ba_mapped['winner']:
        return {
            'winner': result_ab['winner'],
            'confidence': (result_ab['confidence'] + result_ba_mapped['confidence']) / 2,
            'position_consistent': True
        }
    else:
        # 分歧表明位置偏见是影响因素
        return {
            'winner': 'TIE',
            'confidence': 0.5,
            'position_consistent': False,
            'bias_detected': True
        }
```

### 替代方案：多次洗牌

为了获得更高的可靠性，使用多种位置排序：

```python
async def multi_shuffle_comparison(response_a, response_b, prompt, criteria, n_shuffles=3):
    results = []
    for i in range(n_shuffles):
        if i % 2 == 0:
            r = await compare(response_a, response_b, prompt, criteria)
        else:
            r = await compare(response_b, response_a, prompt, criteria)
            r['winner'] = {'A': 'B', 'B': 'A', 'TIE': 'TIE'}[r['winner']]
        results.append(r)
    
    # 多数投票
    winners = [r['winner'] for r in results]
    final_winner = max(set(winners), key=winners.count)
    agreement = winners.count(final_winner) / len(winners)
    
    return {
        'winner': final_winner,
        'confidence': agreement,
        'n_shuffles': n_shuffles
    }
```

## 长度偏见

### 问题所在

LLM 倾向于给更长的响应打更高的分数，无论质量如何。这表现为：
- 冗长的响应获得虚高的分数
- 简洁但完整的响应受到惩罚
- 填充和重复被奖励

### 缓解措施：显式提示

在提示中包含反长度偏见指令：

```
关键评估指南：
- 不要因为响应更长而偏好它们
- 简洁、完整的答案与详细的答案一样有价值
- 惩罚不必要的冗长或重复
- 关注信息密度，而不是字数
```

### 缓解措施：长度归一化评分

```python
def length_normalized_score(score, response_length, target_length=500):
    """根据响应长度调整分数。"""
    length_ratio = response_length / target_length
    
    if length_ratio > 2.0:
        # 惩罚过长的响应
        penalty = (length_ratio - 2.0) * 0.1
        return max(score - penalty, 1)
    elif length_ratio < 0.3:
        # 惩罚过短的响应
        penalty = (0.3 - length_ratio) * 0.5
        return max(score - penalty, 1)
    else:
        return score
```

### 缓解措施：单独的长度标准

将长度作为一个单独的、明确的标准，这样它就不会被隐式奖励：

```python
criteria = [
    {"name": "Accuracy", "description": "事实正确性", "weight": 0.4},
    {"name": "Completeness", "description": "涵盖关键点", "weight": 0.3},
    {"name": "Conciseness", "description": "无不必要内容", "weight": 0.3}  # 显式
]
```

## 自我增强偏见

### 问题所在

模型对自己（或类似模型）生成的输出的评分高于来自不同模型的输出。

### 缓解措施：跨模型评估

对评估使用与生成不同的模型系列：

```python
def get_evaluator_model(generator_model):
    """选择评估器以避免自我增强偏见。"""
    if 'gpt' in generator_model.lower():
        return 'claude-4-5-sonnet'
    elif 'claude' in generator_model.lower():
        return 'gpt-5.2'
    else:
        return 'gpt-5.2'  # 默认
```

### 缓解措施：盲评

在评估前从响应中移除模型归属：

```python
def anonymize_response(response, model_name):
    """移除模型识别模式。"""
    patterns = [
        f"As {model_name}",
        "I am an AI",
        "I don't have personal opinions",
        # 模型特定模式
    ]
    anonymized = response
    for pattern in patterns:
        anonymized = anonymized.replace(pattern, "[REDACTED]")
    return anonymized
```

## 冗长偏见

### 问题所在

详细的解释获得更高的分数，即使额外的细节不相关或不正确。

### 缓解措施：相关性加权评分

```python
async def relevance_weighted_evaluation(response, prompt, criteria):
    # 首先，评估每个段的相关性
    relevance_scores = await assess_relevance(response, prompt)
    
    # 按相关性加权评估
    segments = split_into_segments(response)
    weighted_scores = []
    for segment, relevance in zip(segments, relevance_scores):
        if relevance > 0.5:  # 只计算相关段
            score = await evaluate_segment(segment, prompt, criteria)
            weighted_scores.append(score * relevance)
    
    return sum(weighted_scores) / len(weighted_scores)
```

### 缓解措施：带冗长惩罚的评分标准

在评分标准中包含显式的冗长惩罚：

```python
rubric_levels = [
    {
        "score": 5,
        "description": "完整且简洁。所有必要信息，无不必要内容。",
        "characteristics": ["每句话都有价值", "无重复", "范围适当"]
    },
    {
        "score": 3,
        "description": "完整但冗长。包含不必要的细节或重复。",
        "characteristics": ["主要观点已涵盖", "有些离题", "可以更简洁"]
    },
    # ... 等等
]
```

## 权威偏见

### 问题所在

自信、权威的语气无论准确性如何都会获得更高的评分。

### 缓解措施：证据要求

要求对声明提供明确的证据：

```
对于响应中的每个声明：
1. 识别它是否是事实声明
2. 注意是否提供了证据或来源
3. 基于可验证性而不是自信度评分

重要：没有证据的自信声明不应该比有证据的谨慎声明获得更高的分数。
```

### 缓解措施：事实核查层

在评分前添加事实核查步骤：

```python
async def fact_checked_evaluation(response, prompt, criteria):
    # 提取声明
    claims = await extract_claims(response)
    
    # 事实核查每个声明
    fact_check_results = await asyncio.gather(*[
        verify_claim(claim) for claim in claims
    ])
    
    # 基于事实核查结果调整分数
    accuracy_factor = sum(r['verified'] for r in fact_check_results) / len(fact_check_results)
    
    base_score = await evaluate(response, prompt, criteria)
    return base_score * (0.7 + 0.3 * accuracy_factor)  # 至少 70% 的分数
```

## 聚合偏见检测

监控生产中的系统性偏见：

```python
class BiasMonitor:
    def __init__(self):
        self.evaluations = []
    
    def record(self, evaluation):
        self.evaluations.append(evaluation)
    
    def detect_position_bias(self):
        """检测第一位置是否比预期更频繁获胜。"""
        first_wins = sum(1 for e in self.evaluations if e['first_position_winner'])
        expected = len(self.evaluations) * 0.5
        z_score = (first_wins - expected) / (expected * 0.5) ** 0.5
        return {'bias_detected': abs(z_score) > 2, 'z_score': z_score}
    
    def detect_length_bias(self):
        """检测较长的响应是否得分更高。"""
        from scipy.stats import spearmanr
        lengths = [e['response_length'] for e in self.evaluations]
        scores = [e['score'] for e in self.evaluations]
        corr, p_value = spearmanr(lengths, scores)
        return {'bias_detected': corr > 0.3 and p_value < 0.05, 'correlation': corr}
```

## 总结表

| 偏见 | 主要缓解措施 | 次要缓解措施 | 检测方法 |
|------|-------------|-------------|---------|
| 位置 | 位置交换 | 多次洗牌 | 一致性检查 |
| 长度 | 显式提示 | 长度归一化 | 长度-分数相关性 |
| 自我增强 | 跨模型评估 | 匿名化 | 模型比较研究 |
| 冗长 | 相关性加权 | 评分标准惩罚 | 相关性评分 |
| 权威 | 证据要求 | 事实核查层 | 自信度-准确性相关性 |
