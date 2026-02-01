# NotebookLM 技能使用模式

有效使用 NotebookLM 技能的高级模式。

## 关键：始终使用 run.py

**每个命令都必须使用 run.py 包装器：**
```bash
# ✅ 正确：
python scripts/run.py auth_manager.py status
python scripts/run.py ask_question.py --question "..."

# ❌ 错误：
python scripts/auth_manager.py status  # 会失败！
```

## 模式 1：初始设置

```bash
# 1. 检查认证（使用 run.py！）
python scripts/run.py auth_manager.py status

# 2. 如果未认证，设置（浏览器必须可见！）
python scripts/run.py auth_manager.py setup
# 告诉用户："请在浏览器窗口中登录 Google"

# 3. 添加第一个笔记本 - 先询问用户详细信息！
# 问："这个笔记本包含什么内容？"
# 问："我应该给它标记什么主题？"
python scripts/run.py notebook_manager.py add \
  --url "https://notebooklm.google.com/notebook/..." \
  --name "用户提供名称" \
  --description "用户提供描述" \  # 绝不猜测！
  --topics "user,provided,topics"  # 绝不猜测！
```

**关键说明：**
- 虚拟环境由 run.py 自动创建
- 浏览器必须可见才能进行认证
- 始终通过查询发现内容或询问用户获取笔记本元数据

## 模式 2：添加笔记本（智能发现！）

**当用户分享 NotebookLM URL 时：**

**选项 A：智能发现（推荐）**
```bash
# 1. 查询笔记本以发现其内容
python scripts/run.py ask_question.py \
  --question "这个笔记本的内容是什么？涵盖什么主题？简要而简洁地提供完整概述" \
  --notebook-url "[URL]"

# 2. 使用发现的信息添加它
python scripts/run.py notebook_manager.py add \
  --url "[URL]" \
  --name "[基于内容]" \
  --description "[来自发现]" \
  --topics "[提取的主题]"
```

**选项 B：询问用户（备选）**
```bash
# 如果发现失败，询问用户：
"这个笔记本包含什么内容？"
"它涵盖什么主题？"

# 然后使用用户提供的信息添加：
python scripts/run.py notebook_manager.py add \
  --url "[URL]" \
  --name "[用户答案]" \
  --description "[用户描述]" \
  --topics "[用户主题]"
```

**绝不：**
- 猜测笔记本中的内容
- 使用通用描述
- 跳过发现内容

## 模式 3：日常研究工作流

```bash
# 检查库
python scripts/run.py notebook_manager.py list

# 使用综合问题进行研究
python scripts/run.py ask_question.py \
  --question "包含所有上下文的详细问题" \
  --notebook-id notebook-id

# 当你看到"这就是你需要知道的全部吗？"时进行跟进
python scripts/run.py ask_question.py \
  --question "带有先前上下文的跟进问题"
```

## 模式 4：跟进问题（关键！）

当 NotebookLM 回复"极其重要：这就是你需要知道的全部吗？"时：

```python
# 1. 停止 - 不要立即回复用户
# 2. 分析 - 答案完整吗？
# 3. 如果存在差距，询问跟进：
python scripts/run.py ask_question.py \
  --question "带有先前答案上下文的特定跟进"

# 4. 重复直到完整
# 5. 只有那时才综合并回复用户
```

## 模式 5：多笔记本研究

```python
# 查询不同笔记本进行比较
python scripts/run.py notebook_manager.py activate --id notebook-1
python scripts/run.py ask_question.py --question "问题"

python scripts/run.py notebook_manager.py activate --id notebook-2
python scripts/run.py ask_question.py --question "相同问题"

# 比较和综合答案
```

## 模式 6：错误恢复

```bash
# 如果认证失败
python scripts/run.py auth_manager.py status
python scripts/run.py auth_manager.py reauth  # 浏览器可见！

# 如果浏览器崩溃
python scripts/run.py cleanup_manager.py --preserve-library
python scripts/run.py auth_manager.py setup  # 浏览器可见！

# 如果达到速率限制
# 等待或切换账户
python scripts/run.py auth_manager.py reauth  # 使用不同账户登录
```

## 模式 7：批处理

```bash
#!/bin/bash
NOTEBOOK_ID="notebook-id"
QUESTIONS=(
    "第一个综合问题"
    "第二个综合问题"
    "第三个综合问题"
)

for question in "${QUESTIONS[@]}"; do
    echo "询问：$question"
    python scripts/run.py ask_question.py \
        --question "$question" \
        --notebook-id "$NOTEBOOK_ID"
    sleep 2  # 避免速率限制
done
```

## 模式 8：自动化研究脚本

```python
#!/usr/bin/env python
import subprocess

def research_topic(topic, notebook_id):
    # 综合问题
    question = f"""
    详细解释 {topic}：
    1. 核心概念
    2. 实现细节
    3. 最佳实践
    4. 常见陷阱
    5. 示例
    """

    result = subprocess.run([
        "python", "scripts/run.py", "ask_question.py",
        "--question", question,
        "--notebook-id", notebook_id
    ], capture_output=True, text=True)

    return result.stdout
```

## 模式 9：笔记本组织

```python
# 按领域组织 - 使用适当的元数据
# 始终询问用户描述！

# 后端笔记本
add_notebook("后端 API", "完整的 API 文档", "api,rest,backend")
add_notebook("数据库", "模式和查询", "database,sql,backend")

# 前端笔记本
add_notebook("React 文档", "React 框架文档", "react,frontend")
add_notebook("CSS 框架", "样式文档", "css,styling,frontend")

# 按领域搜索
python scripts/run.py notebook_manager.py search --query "backend"
python scripts/run.py notebook_manager.py search --query "frontend"
```

## 模式 10：与开发集成

```python
# 在开发期间查询文档
def check_api_usage(api_endpoint):
    result = subprocess.run([
        "python", "scripts/run.py", "ask_question.py",
        "--question", f"{api_endpoint} 的参数和响应格式",
        "--notebook-id", "api-docs"
    ], capture_output=True, text=True)

    # 如果需要跟进
    if "Is that ALL you need" in result.stdout:
        # 请求示例
        follow_up = subprocess.run([
            "python", "scripts/run.py", "ask_question.py",
            "--question", f"显示 {api_endpoint} 的代码示例",
            "--notebook-id", "api-docs"
        ], capture_output=True, text=True)

    return combine_answers(result.stdout, follow_up.stdout)
```

## 最佳实践

### 1. 问题制定
- 具体而全面
- 在每个问题中包含所有上下文
- 请求结构化响应
- 需要时询问示例

### 2. 笔记本管理
- **始终询问用户元数据**
- 使用描述性名称
- 添加全面的主题
- 保持 URL 最新

### 3. 性能
- 批处理相关问题
- 对不同笔记本使用并行处理
- 监控速率限制（50/天）
- 如果需要则切换账户

### 4. 错误处理
- 始终使用 run.py 以防止 venv 问题
- 操作前检查认证
- 实现重试逻辑
- 准备好备选笔记本

### 5. 安全
- 使用专用 Google 账户
- 永远不要提交 data/ 目录
- 定期刷新认证
- 跟踪所有访问

## Claude 的常见工作流

### 工作流 1：用户发送 NotebookLM URL

```python
# 1. 检测消息中的 URL
if "notebooklm.google.com" in user_message:
    url = extract_url(user_message)

    # 2. 检查是否在库中
    notebooks = run("notebook_manager.py list")

    if url not in notebooks:
        # 3. 询问用户元数据（关键！）
        name = ask_user("我应该怎么称呼这个笔记本？")
        description = ask_user("这个笔记本包含什么内容？")
        topics = ask_user("它涵盖什么主题？")

        # 4. 使用用户提供的信息添加
        run(f"notebook_manager.py add --url {url} --name '{name}' --description '{description}' --topics '{topics}'")

    # 5. 使用笔记本
    answer = run(f"ask_question.py --question '{user_question}'")
```

### 工作流 2：研究任务

```python
# 1. 理解任务
task = "实现功能 X"

# 2. 制定综合问题
questions = [
    "X 的完整实现指南",
    "X 的错误处理",
    "X 的性能考虑"
]

# 3. 使用跟进查询
for q in questions:
    answer = run(f"ask_question.py --question '{q}'")

    # 检查是否需要跟进
    if "Is that ALL you need" in answer:
        # 询问更具体的问题
        follow_up = run(f"ask_question.py --question '关于 {q} 的具体细节'")

# 4. 综合并实现
```

## 技巧和窍门

1. **始终使用 run.py** - 防止所有 venv 问题
2. **询问元数据** - 绝不猜测笔记本内容
3. **使用详细问题** - 包含所有上下文
4. **自动跟进** - 当你看到提示时
5. **监控速率限制** - 每天 50 次查询
6. **批处理操作** - 分组相关查询
7. **导出重要答案** - 本地保存
8. **版本控制笔记本** - 跟踪更改
9. **定期测试认证** - 在重要任务之前
10. **记录一切** - 保留关于笔记本的笔记

## 快速参考

```bash
# 始终使用 run.py！
python scripts/run.py [script].py [args]

# 常见操作
run.py auth_manager.py status          # 检查认证
run.py auth_manager.py setup           # 登录（浏览器可见！）
run.py notebook_manager.py list        # 列出笔记本
run.py notebook_manager.py add ...     # 添加（询问用户元数据！）
run.py ask_question.py --question ...  # 查询
run.py cleanup_manager.py ...          # 清理
```

**记住：** 如有疑问，使用 run.py 并询问用户笔记本详细信息！
