# 上下文组件：技术参考

本文档提供智能体系统中每个上下文组件的详细技术参考。

## 系统提示工程

### 章节结构

将系统提示组织成具有清晰边界的不同章节。推荐结构：

```
<BACKGROUND_INFORMATION>
关于领域、用户偏好或项目特定细节的背景信息
</BACKGROUND_INFORMATION>

<INSTRUCTIONS>
核心行为准则和任务指令
</INSTRUCTIONS>

<TOOL_GUIDANCE>
何时以及如何使用可用工具
</TOOL_GUIDANCE>

<OUTPUT_DESCRIPTION>
预期输出格式和质量标准
</OUTPUT_DESCRIPTION>
```

这种结构使智能体能够快速定位相关信息，并在高级实现中实现选择性上下文加载。

### 高度校准

指令的"高度"指的是抽象级别。考虑以下示例：

**太低（脆弱）：**
```
如果用户询问定价，检查 docs/pricing.md 中的定价表。
如果表格显示 USD，使用 config/exchange_rates.json 中的汇率转换为 EUR。
如果用户在欧盟，从 config/vat_rates.json 中添加适用的增值税率。
使用货币符号、两位小数和关于增值税的说明格式化响应。
```

**太高（模糊）：**
```
帮助用户解决定价问题。要有帮助且准确。
```

**最优（启发式驱动）：**
```
对于定价查询：
1. 从 docs/pricing.md 检索当前费率
2. 应用用户位置调整（参见 config/location_defaults.json）
3. 使用适当的货币和税务考虑进行格式化

优先选择精确数字而非估算。当费率不可用时，
明确说明而不是进行预测。
```

最优高度在执行中提供清晰的步骤，同时保持灵活性。

## 工具定义规范

### 模式结构

每个工具应定义：

```python
{
    "name": "tool_function_name",
    "description": "工具做什么以及何时使用的清晰描述",
    "parameters": {
        "type": "object",
        "properties": {
            "param_name": {
                "type": "string",
                "description": "此参数控制什么",
                "default": "reasonable_default_value"
            }
        },
        "required": ["param_name"]
    },
    "returns": {
        "type": "object",
        "description": "工具返回什么及其结构"
    }
}
```

### 描述工程

工具描述应回答：工具做什么、何时使用它以及它产生什么。包括使用上下文、示例和边缘情况。

**弱描述：**
```
在数据库中搜索客户信息。
```

**强描述：**
```
通过 ID 或电子邮件检索客户信息。

在以下情况使用：
- 用户询问特定客户的详细信息、历史或状态
- 用户提供客户标识符并需要相关信息

返回客户对象，包含：
- 基本信息（姓名、电子邮件、账户状态）
- 订单历史摘要
- 支持工单数量

如果客户未找到则返回 null。如果数据库不可达则返回错误。
```

## 检索文档管理

### 标识符设计

设计传达意义并支持高效检索的标识符：

**差的标识符：**
- `data/file1.json`
- `ref/ref.md`
- `2024/q3/report`

**强的标识符：**
- `customer_pricing_rates.json`
- `engineering_onboarding_checklist.md`
- `2024_q3_revenue_report.pdf`

强的标识符使智能体即使没有搜索工具也能定位相关文件。

### 文档分块策略

对于大型文档，策略性地分块以保持语义连贯性：

```python
# 语义分块的伪代码
def chunk_document(content):
    """在自然语义边界处分割文档。"""
    boundaries = find_section_headers(content)
    boundaries += find_paragraph_breaks(content)
    boundaries += find_logical_breaks(content)
    
    chunks = []
    for i in range(len(boundaries) - 1):
        chunk = content[boundaries[i]:boundaries[i+1]]
        if len(chunk) > MIN_CHUNK_SIZE and len(chunk) < MAX_CHUNK_SIZE:
            chunks.append(chunk)
    
    return chunks
```

避免在句子或概念中间分割的任意字符限制。

## 消息历史管理

### 轮次表示

构建消息历史以保留关键信息：

```python
{
    "role": "user" | "assistant" | "tool",
    "content": "消息文本",
    "reasoning": "可选的思维链",
    "tool_calls": [如果 role="assistant" 则为列表],
    "tool_output": "如果 role="tool" 则为输出",
    "summary": "如果对话很长则为紧凑摘要"
}
```

### 摘要注入模式

对于长对话，在间隔处注入摘要：

```python
def inject_summaries(messages, summary_interval=20):
    """在常规间隔处注入摘要以保留上下文。"""
    summarized = []
    for i, msg in enumerate(messages):
        summarized.append(msg)
        if i > 0 and i % summary_interval == 0:
            summary = generate_summary(summarized[-summary_interval:])
            summarized.append({
                "role": "system",
                "content": f"对话摘要：{summary}",
                "is_summary": True
            })
    return summarized
```

## 工具输出优化

### 响应格式

提供响应格式选项以控制 token 使用：

```python
def get_customer_response_format():
    return {
        "format": "concise | detailed",
        "fields": ["id", "name", "email", "status", "history_summary"]
    }
```

简洁格式仅返回基本字段；详细格式返回完整对象。

### 观察掩码

对于冗长的工具输出，考虑掩码模式：

```python
def mask_observation(output, max_length=500):
    """用紧凑引用替换长观察。"""
    if len(output) <= max_length:
        return output
    
    reference_id = store_observation(output)
    return f"[之前的观察已省略。完整内容存储在引用 {reference_id}]"
```

这在减少 token 使用的同时保留了信息访问。

## 上下文预算估算

### Token 计数近似

为规划目的，将英文文本估算为每个 token 约 4 个字符：

```
1000 词 ≈ 7500 字符 ≈ 1800-2000 token
```

这是一个粗略的近似；实际 tokenization 因模型和内容类型而异。

### 上下文预算分配

跨组件分配上下文预算：

| 组件 | 典型范围 | 说明 |
|-----------|---------------|-------|
| 系统提示 | 500-2000 token | 跨会话稳定 |
| 工具定义 | 每个工具 100-500 | 随工具数量增长 |
| 检索文档 | 可变 | 通常是最大的消费者 |
| 消息历史 | 可变 | 随对话增长 |
| 工具输出 | 可变 | 可以主导上下文 |

在开发期间监控实际使用情况以建立基线分配。

## 渐进式披露实现

### 技能激活模式

```python
def activate_skill_context(skill_name, task_description):
    """当任务与技能描述匹配时加载技能上下文。"""
    skill_metadata = load_all_skill_metadata()
    
    relevant_skills = []
    for skill in skill_metadata:
        if skill_matches_task(skill, task_description):
            relevant_skills.append(skill)
    
    # 仅加载最相关技能的完整内容
    for skill in relevant_skills[:MAX_CONCURRENT_SKILLS]:
        skill_context = load_skill_content(skill)
        inject_into_context(skill_context)
```

### 引用加载模式

```python
def get_reference(file_reference):
    """仅在显式需要时加载引用文件。"""
    if not file_reference.is_loaded:
        file_reference.content = read_file(file_reference.path)
        file_reference.is_loaded = True
    return file_reference.content
```

这种模式确保文件只加载一次，并在会话期间缓存。
