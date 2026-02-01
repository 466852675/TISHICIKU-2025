# LLM 项目的流水线模式

本参考提供构建 LLM 处理流水线的详细模式。这些模式适用于批处理、数据分析、内容生成和类似的工作负载。

## 规范流水线

```
acquire → prepare → process → parse → render
```

### 阶段特性

| 阶段 | 确定性 | 昂贵 | 可并行化 | 幂等性 |
|------|--------|------|----------|--------|
| Acquire | 是 | 低 | 是 | 是 |
| Prepare | 是 | 低 | 是 | 是 |
| Process | 否 | 高 | 是 | 是（带缓存） |
| Parse | 是 | 低 | 是 | 是 |
| Render | 是 | 低 | 部分 | 是 |

关键洞察：只有 Process 阶段涉及 LLM 调用。所有其他阶段都是确定性转换，可以独立调试、测试和迭代。

## 文件系统状态管理

### 目录结构模式

```
project/
├── data/
│   └── {batch_id}/
│       └── {item_id}/
│           ├── raw.json         # Acquire 输出
│           ├── prompt.md        # Prepare 输出
│           ├── response.md      # Process 输出
│           └── parsed.json      # Parse 输出
├── output/
│   └── {batch_id}/
│       └── index.html           # Render 输出
└── config/
    └── prompts/
        └── template.md          # 提示模板
```

### 状态检查模式

```python
def needs_processing(item_dir: Path, stage: str) -> bool:
    """检查项目是否需要给定阶段的处理。"""
    stage_outputs = {
        "acquire": ["raw.json"],
        "prepare": ["prompt.md"],
        "process": ["response.md"],
        "parse": ["parsed.json"],
    }
    
    for output_file in stage_outputs[stage]:
        if not (item_dir / output_file).exists():
            return True
    return False
```

### 清理/重试模式

```python
def clean_from_stage(item_dir: Path, stage: str):
    """从阶段及所有下游阶段移除输出。"""
    stage_order = ["acquire", "prepare", "process", "parse", "render"]
    stage_outputs = {
        "acquire": ["raw.json"],
        "prepare": ["prompt.md"],
        "process": ["response.md"],
        "parse": ["parsed.json"],
    }
    
    start_idx = stage_order.index(stage)
    for s in stage_order[start_idx:]:
        for output_file in stage_outputs.get(s, []):
            filepath = item_dir / output_file
            if filepath.exists():
                filepath.unlink()
```

## 并行执行模式

### 用于 LLM 调用的 ThreadPoolExecutor

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def process_batch(items: list, max_workers: int = 10):
    """带进度跟踪的并行处理项目。"""
    results = []
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(process_item, item): item for item in items}
        
        for future in as_completed(futures):
            item = futures[future]
            try:
                result = future.result()
                results.append((item, result, None))
            except Exception as e:
                results.append((item, None, str(e)))
    
    return results
```

### 批大小考虑

- **小批（1-10）**：顺序处理即可；并行化开销不值得
- **中批（10-100）**：根据 API 速率限制使用 5-15 个工作线程并行化
- **大批（100+）**：考虑分块并设置检查点；实现恢复能力

### 速率限制

```python
import time
from functools import wraps

def rate_limited(calls_per_second: float):
    """速率限制函数调用的装饰器。"""
    min_interval = 1.0 / calls_per_second
    last_call = [0.0]
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_call[0]
            if elapsed < min_interval:
                time.sleep(min_interval - elapsed)
            result = func(*args, **kwargs)
            last_call[0] = time.time()
            return result
        return wrapper
    return decorator
```

## 结构化输出模式

### 提示模板结构

```markdown
[指令块]
分析以下内容并严格按照此格式提供你的响应。

[格式规范]
## 第 1 节：摘要
[你的摘要 - 2-3 句话]

## 第 2 节：分析
- 要点 1
- 要点 2
- 要点 3

## 第 3 节：评分
评分：[1-10]
置信度：[低/中/高]

[格式强制]
严格遵循此格式，因为我将通过编程方式解析它。

---

[内容块]
# 标题：{title}

## 内容
{content}

## 附加上下文
{context}
```

### 解析模式

**章节提取**

```python
import re

def extract_section(text: str, section_name: str) -> str | None:
    """提取章节标题之间的内容。"""
    # 匹配带可选 markdown 格式的章节标题
    pattern = rf'(?:^|\n)(?:#+ *)?{re.escape(section_name)}[:\s]*\n(.*?)(?=\n(?:#+ |\Z))'
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else None
```

**结构化字段提取**

```python
def extract_field(text: str, field_name: str) -> str | None:
    """提取字段标签后的值。"""
    # 处理："Field: value" 或 "Field - value" 或 "**Field**: value"
    pattern = rf'(?:\*\*)?{re.escape(field_name)}(?:\*\*)?[\s:\-]+([^\n]+)'
    match = re.search(pattern, text, re.IGNORECASE)
    return match.group(1).strip() if match else None
```

**列表提取**

```python
def extract_list_items(text: str, section_name: str) -> list[str]:
    """从章节提取项目符号。"""
    section = extract_section(text, section_name)
    if not section:
        return []
    
    # 匹配以 -、* 或数字开头的行
    items = re.findall(r'^[\-\*\d\.]+\s*(.+)$', section, re.MULTILINE)
    return [item.strip() for item in items]
```

**带验证的评分提取**

```python
def extract_score(text: str, field_name: str, min_val: int, max_val: int) -> int | None:
    """提取并验证数值评分。"""
    raw = extract_field(text, field_name)
    if not raw:
        return None
    
    # 从值中提取第一个数字
    match = re.search(r'\d+', raw)
    if not match:
        return None
    
    score = int(match.group())
    return max(min_val, min(max_val, score))  # 限制在有效范围内
```

### 优雅降级

```python
@dataclass
class ParseResult:
    summary: str = ""
    score: int | None = None
    items: list[str] = field(default_factory=list)
    parse_errors: list[str] = field(default_factory=list)

def parse_response(text: str) -> ParseResult:
    """带优雅错误处理的解析 LLM 响应。"""
    result = ParseResult()
    
    # 尝试每个字段，记录错误但继续
    try:
        result.summary = extract_section(text, "Summary") or ""
    except Exception as e:
        result.parse_errors.append(f"摘要提取失败：{e}")
    
    try:
        result.score = extract_score(text, "Rating", 1, 10)
    except Exception as e:
        result.parse_errors.append(f"评分提取失败：{e}")
    
    try:
        result.items = extract_list_items(text, "Analysis")
    except Exception as e:
        result.parse_errors.append(f"项目提取失败：{e}")
    
    return result
```

## 错误处理模式

### 带指数退避的重试

```python
import time
from functools import wraps

def retry_with_backoff(max_retries: int = 3, base_delay: float = 1.0):
    """带指数退避的重试装饰器。"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_retries - 1:
                        delay = base_delay * (2 ** attempt)
                        time.sleep(delay)
            raise last_exception
        return wrapper
    return decorator
```

### 错误日志模式

```python
import json
from datetime import datetime

def log_error(item_dir: Path, stage: str, error: str, context: dict = None):
    """将错误记录到文件以供后续分析。"""
    error_file = item_dir / "errors.jsonl"
    
    error_record = {
        "timestamp": datetime.now().isoformat(),
        "stage": stage,
        "error": error,
        "context": context or {},
    }
    
    with open(error_file, "a") as f:
        f.write(json.dumps(error_record) + "\n")
```

### 部分成功处理

```python
def process_batch_with_partial_success(items: list) -> tuple[list, list]:
    """处理批次，分离成功和失败。"""
    successes = []
    failures = []
    
    for item in items:
        try:
            result = process_item(item)
            successes.append((item, result))
        except Exception as e:
            failures.append((item, str(e)))
            log_error(item.directory, "process", str(e))
    
    # 报告摘要
    print(f"处理了 {len(items)} 个项目：{len(successes)} 成功，{len(failures)} 失败")
    
    return successes, failures
```

## 成本估算模式

### Token 计数

```python
import tiktoken

def count_tokens(text: str, model: str = "gpt-4") -> int:
    """用于成本估算的 token 计数。"""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    
    return len(encoding.encode(text))

def estimate_cost(
    input_tokens: int,
    output_tokens: int,
    input_price_per_mtok: float,
    output_price_per_mtok: float,
) -> float:
    """以美元估算成本。"""
    input_cost = (input_tokens / 1_000_000) * input_price_per_mtok
    output_cost = (output_tokens / 1_000_000) * output_price_per_mtok
    return input_cost + output_cost
```

### 批次成本估算

```python
def estimate_batch_cost(
    items: list,
    prompt_template: str,
    avg_output_tokens: int = 1000,
    model_pricing: dict = None,
) -> dict:
    """估算批次的总成本。"""
    model_pricing = model_pricing or {
        "input_price_per_mtok": 3.00,   # 示例：GPT-4 Turbo 输入
        "output_price_per_mtok": 15.00,  # 示例：GPT-4 Turbo 输出
    }
    
    total_input_tokens = 0
    for item in items:
        prompt = format_prompt(prompt_template, item)
        total_input_tokens += count_tokens(prompt)
    
    total_output_tokens = len(items) * avg_output_tokens
    
    estimated_cost = estimate_cost(
        total_input_tokens,
        total_output_tokens,
        **model_pricing,
    )
    
    return {
        "item_count": len(items),
        "total_input_tokens": total_input_tokens,
        "total_output_tokens": total_output_tokens,
        "estimated_cost_usd": estimated_cost,
        "avg_input_tokens_per_item": total_input_tokens / len(items),
        "cost_per_item_usd": estimated_cost / len(items),
    }
```

## CLI 模式

### 标准 CLI 结构

```python
import argparse
from datetime import date

def main():
    parser = argparse.ArgumentParser(description="LLM 处理流水线")
    
    parser.add_argument(
        "stage",
        choices=["acquire", "prepare", "process", "parse", "render", "all", "clean"],
        help="要运行的流水线阶段",
    )
    parser.add_argument(
        "--batch-id",
        default=None,
        help="批次标识符（默认：今天的日期）",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="限制项目数量（用于测试）",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=10,
        help="用于处理的并行工作线程数",
    )
    parser.add_argument(
        "--model",
        default="gpt-4-turbo",
        help="用于处理的模型",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="估算成本而不进行处理",
    )
    parser.add_argument(
        "--clean-stage",
        choices=["acquire", "prepare", "process", "parse"],
        help="对于 clean：仅清理此阶段及下游阶段",
    )
    
    args = parser.parse_args()
    
    batch_id = args.batch_id or date.today().isoformat()
    
    if args.stage == "clean":
        stage_clean(batch_id, args.clean_stage)
    elif args.dry_run:
        estimate_costs(batch_id, args.limit)
    else:
        run_pipeline(batch_id, args.stage, args.limit, args.workers, args.model)

if __name__ == "__main__":
    main()
```

## 渲染模式

### 静态 HTML 输出

```python
import html
import json

def render_html(data: list[dict], output_path: Path, template: str):
    """将数据渲染到静态 HTML 文件。"""
    # 为 JavaScript 嵌入转义数据
    data_json = json.dumps([
        {k: html.escape(str(v)) if isinstance(v, str) else v 
         for k, v in item.items()}
        for item in data
    ])
    
    html_content = template.replace("{{DATA_JSON}}", data_json)
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        f.write(html_content)
```

### 增量输出

```python
def render_incremental(items: list, output_dir: Path):
    """在完成时渲染每个项目，加上索引。"""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 渲染单个项目页面
    for item in items:
        item_html = render_item(item)
        item_path = output_dir / f"{item.id}.html"
        with open(item_path, "w") as f:
            f.write(item_html)
    
    # 渲染链接到所有项目的索引
    index_html = render_index(items)
    with open(output_dir / "index.html", "w") as f:
        f.write(index_html)
```

## 检查点和恢复模式

对于长时间运行的流水线：

```python
import json
from pathlib import Path

class PipelineCheckpoint:
    def __init__(self, checkpoint_file: Path):
        self.checkpoint_file = checkpoint_file
        self.state = self._load()
    
    def _load(self) -> dict:
        if self.checkpoint_file.exists():
            with open(self.checkpoint_file) as f:
                return json.load(f)
        return {"completed": [], "failed": [], "last_item": None}
    
    def save(self):
        with open(self.checkpoint_file, "w") as f:
            json.dump(self.state, f, indent=2)
    
    def mark_complete(self, item_id: str):
        self.state["completed"].append(item_id)
        self.state["last_item"] = item_id
        self.save()
    
    def mark_failed(self, item_id: str, error: str):
        self.state["failed"].append({"id": item_id, "error": error})
        self.save()
    
    def get_remaining(self, all_items: list[str]) -> list[str]:
        completed = set(self.state["completed"])
        return [item for item in all_items if item not in completed]
```

## 测试模式

### 阶段单元测试

```python
def test_prepare_stage():
    """独立测试提示生成。"""
    test_item = {"id": "test", "content": "示例内容"}
    prompt = prepare_prompt(test_item)
    
    assert "示例内容" in prompt
    assert "## Section 1" in prompt  # 格式标记存在

def test_parse_stage():
    """使用已知良好输出测试解析。"""
    test_response = """
    ## Summary
    这是一个测试摘要。
    
    ## Score
    Rating: 7
    """
    
    result = parse_response(test_response)
    assert result.summary == "这是一个测试摘要。"
    assert result.score == 7

def test_parse_stage_malformed():
    """测试解析处理格式错误的输出。"""
    test_response = "没有章节的随机文本"
    
    result = parse_response(test_response)
    assert result.summary == ""
    assert result.score is None
    assert len(result.parse_errors) > 0
```

### 集成测试模式

```python
def test_pipeline_end_to_end():
    """使用单个项目测试完整流水线。"""
    test_dir = Path("test_data")
    test_item = create_test_item()
    
    try:
        # 运行每个阶段
        acquire_result = stage_acquire(test_dir, [test_item])
        assert (test_dir / test_item.id / "raw.json").exists()
        
        prepare_result = stage_prepare(test_dir)
        assert (test_dir / test_item.id / "prompt.md").exists()
        
        # 在单元测试中跳过 process 阶段（花费金钱）
        # 改为创建模拟响应
        mock_response(test_dir / test_item.id)
        
        parse_result = stage_parse(test_dir)
        assert (test_dir / test_item.id / "parsed.json").exists()
        
    finally:
        # 清理
        shutil.rmtree(test_dir, ignore_errors=True)
```
