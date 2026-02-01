# LLM 评估的指标选择指南

本参考为不同评估场景提供选择适当指标的指导。

## 指标类别

### 分类指标

用于二元或多类别评估任务（通过/失败、正确/错误）。

#### 精确率

```
精确率 = 真正例 / (真正例 + 假正例)
```

**解释**：在评判者说良好的所有响应中，实际良好的比例是多少？

**何时使用**：假正例代价高昂时（例如，批准不安全内容）

```python
def precision(predictions, ground_truth):
    true_positives = sum(1 for p, g in zip(predictions, ground_truth) if p == 1 and g == 1)
    predicted_positives = sum(predictions)
    return true_positives / predicted_positives if predicted_positives > 0 else 0
```

#### 召回率

```
召回率 = 真正例 / (真正例 + 假反例)
```

**解释**：在所有实际良好的响应中，评判者识别出的比例是多少？

**何时使用**：假反例代价高昂时（例如，在过滤中遗漏良好内容）

```python
def recall(predictions, ground_truth):
    true_positives = sum(1 for p, g in zip(predictions, ground_truth) if p == 1 and g == 1)
    actual_positives = sum(ground_truth)
    return true_positives / actual_positives if actual_positives > 0 else 0
```

#### F1 分数

```
F1 = 2 * (精确率 * 召回率) / (精确率 + 召回率)
```

**解释**：精确率和召回率的调和平均值

**何时使用**：您需要一个平衡两者的单一数字

```python
def f1_score(predictions, ground_truth):
    p = precision(predictions, ground_truth)
    r = recall(predictions, ground_truth)
    return 2 * p * r / (p + r) if (p + r) > 0 else 0
```

### 一致性指标

用于比较自动评估与人类判断。

#### Cohen's Kappa (κ)

```
κ = (观察到的一致性 - 期望的一致性) / (1 - 期望的一致性)
```

**解释**：调整偶然因素后的一致性
- κ > 0.8：几乎完美的一致性
- κ 0.6-0.8：实质性一致性
- κ 0.4-0.6：中等一致性
- κ < 0.4：一般到较差的一致性

**用于**：二元或分类判断

```python
def cohens_kappa(judge1, judge2):
    from sklearn.metrics import cohen_kappa_score
    return cohen_kappa_score(judge1, judge2)
```

#### 加权 Kappa

用于不一致严重程度重要的序数尺度：

```python
def weighted_kappa(judge1, judge2):
    from sklearn.metrics import cohen_kappa_score
    return cohen_kappa_score(judge1, judge2, weights='quadratic')
```

**解释**：对大的不一致比对小的不一致惩罚更重

### 相关性指标

用于序数/连续分数。

#### Spearman 秩相关系数 (ρ)

**解释**：排名之间的相关性，而非绝对值
- ρ > 0.9：非常强相关
- ρ 0.7-0.9：强相关
- ρ 0.5-0.7：中等相关
- ρ < 0.5：弱相关

**何时使用**：顺序比精确值更重要

```python
def spearmans_rho(scores1, scores2):
    from scipy.stats import spearmanr
    rho, p_value = spearmanr(scores1, scores2)
    return {'rho': rho, 'p_value': p_value}
```

#### Kendall's Tau (τ)

**解释**：与 Spearman 类似但基于成对一致性

**何时使用**：您有很多并列值

```python
def kendalls_tau(scores1, scores2):
    from scipy.stats import kendalltau
    tau, p_value = kendalltau(scores1, scores2)
    return {'tau': tau, 'p_value': p_value}
```

#### Pearson 相关系数 (r)

**解释**：分数之间的线性相关性

**何时使用**：精确的分数值很重要，而不仅仅是顺序

```python
def pearsons_r(scores1, scores2):
    from scipy.stats import pearsonr
    r, p_value = pearsonr(scores1, scores2)
    return {'r': r, 'p_value': p_value}
```

### 成对比较指标

#### 一致率

```
一致率 = (匹配的决策) / (总比较数)
```

**解释**：一致的简单百分比

```python
def pairwise_agreement(decisions1, decisions2):
    matches = sum(1 for d1, d2 in zip(decisions1, decisions2) if d1 == d2)
    return matches / len(decisions1)
```

#### 位置一致性

```
一致性 = (跨位置交换一致) / (总比较数)
```

**解释**：交换位置多久改变一次决策？

```python
def position_consistency(results):
    consistent = sum(1 for r in results if r['position_consistent'])
    return consistent / len(results)
```

## 选择决策树

```
评估任务类型是什么？
│
├── 二元分类（通过/失败）
│   └── 使用：精确率、召回率、F1、Cohen's κ
│
├── 序数尺度（1-5 评分）
│   ├── 与人类判断比较？
│   │   └── 使用：Spearman's ρ、加权 κ
│   └── 比较两个自动评判者？
│       └── 使用：Kendall's τ、Spearman's ρ
│
├── 成对偏好
│   └── 使用：一致率、位置一致性
│
└── 多标签分类
    └── 使用：Macro-F1、Micro-F1、每标签指标
```

## 按用例选择指标

### 用例 1：验证自动评估

**目标**：确保自动评估与人类判断相关

**推荐指标**：
- Spearman's ρ（排名相关性）
- Cohen's κ（分类一致性）
- 加权 κ（序数尺度）

**阈值**：
- ρ > 0.7 表示强相关性
- κ > 0.6 表示实质性一致性

### 用例 2：比较两个 LLM 评判者

**目标**：确定哪个评判者更好

**推荐指标**：
- 与人类判断的成对一致率
- 位置一致性（对于成对比较）
- Kendall's τ（对于排名）

**阈值**：
- > 80% 一致率表示优秀
- > 90% 位置一致性表示无偏见

### 用例 3：监控评估质量

**目标**：随时间跟踪评估系统性能

**推荐指标**：
- 每标准分数分布
- 置信度校准误差
- 人类-评判者分歧率

**阈值**：
- 分歧率 < 10% 表示良好校准
- 分数分布不过度偏斜

### 用例 4：高风险的通过/失败决策

**目标**：对关键决策进行二元分类

**推荐指标**：
- F1 分数（平衡精确率和召回率）
- 精确率（如果假正例代价高昂）
- 召回率（如果假反例代价高昂）

**阈值**：
- F1 > 0.85 表示生产就绪
- 精确率 > 0.95 用于安全关键场景
