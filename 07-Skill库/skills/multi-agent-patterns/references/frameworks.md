# 多智能体模式：技术参考

本文档提供跨不同框架的多智能体架构的实现细节。

## 监督者模式

### LangGraph 监督者实现

实现一个路由到工作节点的监督者：

```python
from typing import TypedDict, Union
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    task: str
    current_agent: str
    task_output: dict
    messages: list

def supervisor_node(state: AgentState) -> AgentState:
    """
    监督者决定接下来调用哪个工作者。
    
    返回路由决策并更新状态。
    """
    task = state["task"]
    messages = state.get("messages", [])
    
    # 基于任务和历史确定下一个智能体
    if "research" in task.lower():
        next_agent = "researcher"
    elif "write" in task.lower() or "create" in task.lower():
        next_agent = "writer"
    elif "review" in task.lower() or "analyze" in task.lower():
        next_agent = "reviewer"
    else:
        next_agent = "coordinator"
    
    return {
        "task": task,
        "current_agent": next_agent,
        "task_output": {},
        "messages": messages + [{"supervisor": f"Routing to {next_agent}"}]
    }

def researcher_node(state: AgentState) -> AgentState:
    """收集信息的研究工作者。"""
    # 执行研究任务
    output = perform_research(state["task"])
    
    return {
        "task": state["task"],
        "current_agent": "researcher",
        "task_output": output,
        "messages": state["messages"] + [{"researcher": "Research complete"}]
    }

def writer_node(state: AgentState) -> AgentState:
    """基于研究创建内容的写作者。"""
    output = create_content(state["task"], state["task_output"])
    
    return {
        "task": state["task"],
        "current_agent": "writer",
        "task_output": output,
        "messages": state["messages"] + [{"writer": "Content created"}]
    }

def build_supervisor_graph():
    """构建监督者工作流图。"""
    workflow = StateGraph(AgentState)
    
    # 添加节点
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("researcher", researcher_node)
    workflow.add_node("writer", writer_node)
    
    # 添加边
    workflow.add_edge("supervisor", "researcher")
    workflow.add_edge("researcher", "supervisor")
    workflow.add_edge("supervisor", "writer")
    workflow.add_edge("writer", "supervisor")
    
    # 设置入口点
    workflow.set_entry_point("supervisor")
    
    return workflow.compile()
```

### AutoGen 监督者

使用 GroupChat 模式实现监督者：

```python
from autogen import AssistantAgent, UserProxyAgent, GroupChat

# 定义专业智能体
researcher = AssistantAgent(
    name="researcher",
    system_message="""你是研究专家。
    你的目标是收集准确、全面的信息
    关于监督者分配的主题。始终引用来源
    并注明置信度。""",
    llm_config=llm_config
)

writer = AssistantAgent(
    name="writer",
    system_message="""你是内容创作专家。
    你的目标是基于
    监督者提供的研究创建结构良好的内容。遵循风格指南
    并确保事实准确性。""",
    llm_config=llm_config
)

# 定义监督者
supervisor = AssistantAgent(
    name="supervisor",
    system_message="""你是项目监督者。
    你的目标是协调研究人员和写作者
    高效完成任务。
    
    流程：
    1. 将任务分解为研究和写作阶段
    2. 路由到适当的专家
    3. 将结果综合为最终输出
    4. 在完成前确保质量""",
    llm_config=llm_config
)

# 配置群聊
group_chat = GroupChat(
    agents=[supervisor, researcher, writer],
    messages=[],
    max_round=20
)

manager = GroupChatManager(
    groupchat=group_chat,
    llm_config=llm_config
)
```

## 群体模式实现

### LangGraph 群体

实现对等移交：

```python
def create_agent(name, system_prompt, tools):
    """为群体创建智能体节点。"""
    
    def agent_node(state):
        # 使用智能体处理当前状态
        response = invoke_agent(name, system_prompt, state["input"], tools)
        
        # 检查移交
        if "handoff" in response:
            return {"next_agent": response["handoff"], "output": response["output"]}
        else:
            return {"next_agent": END, "output": response["output"]}
    
    return agent_node

def build_swarm():
    """构建对等智能体群体。"""
    workflow = StateGraph(State)
    
    # 创建智能体
    triage = create_agent("triage", TRIAGE_PROMPT, [search, read])
    research = create_agent("research", RESEARCH_PROMPT, [search, browse, read])
    analysis = create_agent("analysis", ANALYSIS_PROMPT, [calculate, compare])
    writing = create_agent("writing", WRITING_PROMPT, [write, edit])
    
    # 添加到图
    workflow.add_node("triage", triage)
    workflow.add_node("research", research)
    workflow.add_node("analysis", analysis)
    workflow.add_node("writing", writing)
    
    # 定义移交边
    workflow.add_edge("triage", "research")
    workflow.add_edge("triage", "analysis")
    workflow.add_edge("research", "writing")
    workflow.add_edge("analysis", "writing")
    
    workflow.set_entry_point("triage")
    
    return workflow.compile()
```

## 层级模式实现

### CrewAI 风格层级

```python
class ManagerAgent:
    def __init__(self, name, system_prompt, llm):
        self.name = name
        self.system_prompt = system_prompt
        self.llm = llm
        self.workers = []
    
    def add_worker(self, worker):
        """将工作者智能体添加到团队。"""
        self.workers.append(worker)
    
    def delegate(self, task):
        """
        分析任务并委托给适当的工作者。
        
        返回工作分配和预期输出格式。
        """
        # 分析任务需求
        requirements = analyze_task_requirements(task)
        
        # 选择最佳工作者
        best_worker = select_worker(self.workers, requirements)
        
        # 创建分配
        assignment = {
            "worker": best_worker.name,
            "task": task,
            "context": self.get_relevant_context(task),
            "output_format": requirements.output_format,
            "deadline": requirements.deadline
        }
        
        return assignment
    
    def review_output(self, worker_output, requirements):
        """
        根据需求审查工作者输出。
        
        返回批准或修订请求。
        """
        quality_score = assess_quality(worker_output, requirements)
        
        if quality_score >= requirements.threshold:
            return {"status": "approved", "output": worker_output}
        else:
            return {
                "status": "revision_requested",
                "feedback": generate_feedback(worker_output, requirements),
                "revise_worker": requirements.revise_worker
            }
```

## 上下文隔离模式

### 完整上下文委托

```python
def delegate_with_full_context(planner_state, subagent):
    """
    将整个规划器上下文传递给子智能体。
    
    用于需要完整理解的复杂任务。
    """
    return {
        "context": planner_state,
        "subagent": subagent,
        "isolation_mode": "full"
    }
```

### 指令传递

```python
def delegate_with_instructions(task_spec, subagent):
    """
    仅将指令传递给子智能体。
    
    用于简单、定义明确的子任务。
    """
    return {
        "instructions": {
            "objective": task_spec.objective,
            "constraints": task_spec.constraints,
            "inputs": task_spec.inputs,
            "outputs": task_spec.output_schema
        },
        "subagent": subagent,
        "isolation_mode": "minimal"
    }
```

### 文件系统协调

```python
class FileSystemCoordination:
    def __init__(self, workspace_path):
        self.workspace = workspace_path
    
    def write_shared_state(self, key, value):
        """写入所有智能体可访问的状态。"""
        path = f"{self.workspace}/{key}.json"
        with open(path, 'w') as f:
            json.dump(value, f)
        return path
    
    def read_shared_state(self, key):
        """读取任何智能体写入的状态。"""
        path = f"{self.workspace}/{key}.json"
        with open(path, 'r') as f:
            return json.load(f)
    
    def acquire_lock(self, resource, agent_id):
        """防止对共享资源的并发访问。"""
        lock_path = f"{self.workspace}/locks/{resource}.lock"
        if os.path.exists(lock_path):
            return False
        with open(lock_path, 'w') as f:
            f.write(agent_id)
        return True
```

## 共识机制

### 加权投票

```python
def weighted_consensus(agent_outputs, weights):
    """
    从智能体输出计算加权共识。
    
    权重 = 言语化置信度 * 领域专业知识
    """
    weighted_sum = sum(
        output.vote * weights[output.agent_id]
        for output in agent_outputs
    )
    total_weight = sum(weights[output.agent_id] for output in agent_outputs)
    
    return weighted_sum / total_weight
```

### 辩论协议

```python
class DebateProtocol:
    def __init__(self, agents, max_rounds=5):
        self.agents = agents
        self.max_rounds = max_rounds
        self.history = []
    
    def run_debate(self, topic):
        """执行关于主题的结构化辩论。"""
        # 初始陈述
        statements = {agent.name: agent.initial_statement(topic) 
                      for agent in self.agents}
        
        for round_num in range(self.max_rounds):
            # 生成批评
            critiques = {}
            for agent in self.agents:
                critiques[agent.name] = agent.critique(
                    topic, 
                    statements,
                    exclude=[agent.name]
                )
            
            # 用批评整合更新陈述
            for agent in self.agents:
                statements[agent.name] = agent.integrate_critique(
                    statements[agent.name],
                    critiques
                )
            
            # 检查收敛
            if self.check_convergence(statements):
                break
        
        # 最终评估
        return self.evaluate_final(statements)
```

## 故障恢复

### 断路器

```python
class AgentCircuitBreaker:
    def __init__(self, failure_threshold=3, timeout_seconds=60):
        self.failure_count = {}
        self.failure_threshold = failure_threshold
        self.timeout_seconds = timeout_seconds
    
    def call(self, agent, task):
        """使用断路器保护执行智能体任务。"""
        if self.is_open(agent.name):
            raise CircuitBreakerOpen(f"智能体 {agent.name} 暂时不可用")
        
        try:
            result = agent.execute(task)
            self.record_success(agent.name)
            return result
        except Exception as e:
            self.record_failure(agent.name)
            if self.failure_count[agent.name] >= self.failure_threshold:
                self.open_circuit(agent.name)
            raise
```

### 检查点和恢复

```python
class CheckpointManager:
    def __init__(self, checkpoint_dir):
        self.checkpoint_dir = checkpoint_dir
        os.makedirs(checkpoint_dir, exist_ok=True)
    
    def save_checkpoint(self, workflow_id, step, state):
        """保存工作流状态以可能恢复。"""
        checkpoint = {
            "workflow_id": workflow_id,
            "step": step,
            "state": state,
            "timestamp": time.time()
        }
        path = f"{self.checkpoint_dir}/{workflow_id}.json"
        with open(path, 'w') as f:
            json.dump(checkpoint, f)
    
    def load_checkpoint(self, workflow_id):
        """加载工作流的最后保存的检查点。"""
        path = f"{self.checkpoint_dir}/{workflow_id}.json"
        with open(path, 'r') as f:
            return json.load(f)
```
