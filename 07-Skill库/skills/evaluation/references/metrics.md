# 评估参考：指标和实现

本文档提供评估指标和评估系统的实现细节。

## 核心指标定义

### 事实准确性

事实准确性衡量代理输出中的声明是否与事实相符。

```
优秀 (1.0)：所有声明都经过事实验证，无错误
良好 (0.8)：不影响主要结论的小错误
可接受 (0.6)：主要声明正确，存在小不准确之处
差 (0.3)：关键声明存在重大事实错误
失败 (0.0)：根本性事实错误使输出无效
```

计算方法：
- 从输出中提取声明
- 根据事实验证每个声明
- 按重要性加权声明（主要声明权重更高）
- 计算声明准确性的加权平均值

### 完整性

完整性衡量输出是否涵盖所有请求的方面。

```
优秀 (1.0)：所有请求的方面都得到彻底涵盖
良好 (0.8)：涵盖大多数方面，有小遗漏
可接受 (0.6)：涵盖关键方面，有一些遗漏
差 (0.3)：输出中缺少主要方面
失败 (0.0)：未涉及基本方面
```

### 引用准确性

引用准确性衡量引用的来源是否与声明的来源匹配。

```
优秀 (1.0)：所有引用准确且完整
良好 (0.8)：引用格式有小问题
可接受 (0.6)：主要引用准确
差 (0.3)：引用存在重大问题
失败 (0.0)：引用缺失或完全错误
```

### 来源质量

来源质量衡量是否使用了适当的主要来源。

```
优秀 (1.0)：主要权威来源
良好 (0.8)：主要是主要来源，有一些次要来源
可接受 (0.6)：主要和次要来源的混合
差 (0.3)：主要是次要或不可靠的来源
失败 (0.0)：没有引用可信来源
```

### 工具效率

工具效率衡量代理是否合理使用了适当的工具。

```
优秀 (1.0)：工具选择和调用次数最佳
良好 (0.8)：工具选择良好，有小低效之处
可接受 (0.6)：工具适当，有一些冗余
差 (0.3)：工具错误或调用次数过多
失败 (0.0)：严重滥用工具或调用次数极多
```

## 评分标准实现

```python
EVALUATION_DIMENSIONS = {
    "factual_accuracy": {
        "weight": 0.30,
        "description": "声明与事实相符",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    },
    "completeness": {
        "weight": 0.25,
        "description": "涵盖所有请求的方面",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    },
    "citation_accuracy": {
        "weight": 0.15,
        "description": "引用与来源匹配",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    },
    "source_quality": {
        "weight": 0.10,
        "description": "使用适当的主要来源",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    },
    "tool_efficiency": {
        "weight": 0.20,
        "description": "合理使用正确的工具",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    }
}

def calculate_overall_score(dimension_scores, rubric):
    """根据维度分数计算加权总分。"""
    total_weight = 0
    weighted_sum = 0
    
    for dimension, score in dimension_scores.items():
        if dimension in rubric:
            weight = rubric[dimension]["weight"]
            weighted_sum += score * weight
            total_weight += weight
    
    return weighted_sum / total_weight if total_weight > 0 else 0
```

## 测试集管理

```python
class TestSetManager:
    """管理评估测试集。"""
    
    def __init__(self, test_set_path: str):
        self.test_set_path = Path(test_set_path)
        self.test_cases = self._load_test_cases()
    
    def _load_test_cases(self) -> List[TestCase]:
        """从文件加载测试用例。"""
        with open(self.test_set_path) as f:
            data = json.load(f)
        return [TestCase(**case) for case in data["test_cases"]]
    
    def get_test_cases(self, tags: List[str] = None) -> List[TestCase]:
        """获取带可选标签过滤的测试用例。"""
        if not tags:
            return self.test_cases
        return [tc for tc in self.test_cases if any(t in tc.tags for t in tags)]
    
    def add_test_case(self, test_case: TestCase):
        """向测试集添加新的测试用例。"""
        self.test_cases.append(test_case)
        self._save_test_cases()
    
    def _save_test_cases(self):
        """将测试用例保存到文件。"""
        data = {"test_cases": [tc.to_dict() for tc in self.test_cases]}
        with open(self.test_set_path, 'w') as f:
            json.dump(data, f, indent=2)
```

## 评估运行器

```python
class EvaluationRunner:
    """运行评估并收集结果。"""
    
    def __init__(self, evaluator: Evaluator, test_set: TestSetManager):
        self.evaluator = evaluator
        self.test_set = test_set
        self.results = []
    
    async def run_evaluation(self, tags: List[str] = None) -> EvaluationReport:
        """对测试用例运行评估。"""
        test_cases = self.test_set.get_test_cases(tags)
        
        results = []
        for test_case in test_cases:
            result = await self.evaluator.evaluate(
                response=test_case.response,
                prompt=test_case.prompt,
                ground_truth=test_case.ground_truth
            )
            results.append({
                "test_case_id": test_case.id,
                "scores": result.scores,
                "overall": result.overall_score
            })
        
        return EvaluationReport(
            total_cases=len(test_cases),
            results=results,
            aggregate_scores=self._calculate_aggregates(results)
        )
    
    def _calculate_aggregates(self, results: List[dict]) -> dict:
        """计算跨测试用例的聚合分数。"""
        if not results:
            return {}
        
        aggregates = {}
        for dimension in results[0]["scores"].keys():
            scores = [r["scores"][dimension] for r in results]
            aggregates[dimension] = {
                "mean": sum(scores) / len(scores),
                "min": min(scores),
                "max": max(scores),
                "std": statistics.stdev(scores) if len(scores) > 1 else 0
            }
        
        return aggregates
```
