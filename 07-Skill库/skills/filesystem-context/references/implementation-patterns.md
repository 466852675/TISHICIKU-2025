# 文件系统上下文实现模式

本参考提供基于文件系统的上下文工程的详细实现模式。

## 模式目录

### 1. 草稿板管理器

用于处理大型工具输出和中间结果的集中式管理器。

```python
import os
import json
from datetime import datetime
from pathlib import Path

class ScratchPadManager:
    """管理代理上下文卸载的临时文件存储。"""
    
    def __init__(self, base_path: str = "scratch", token_threshold: int = 2000):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        self.token_threshold = token_threshold
        self.manifest = {}
    
    def should_offload(self, content: str) -> bool:
        """确定内容是否超过卸载阈值。"""
        # 粗略 token 估算：1 token ≈ 4 个字符
        estimated_tokens = len(content) // 4
        return estimated_tokens > self.token_threshold
    
    def offload(self, content: str, source: str, summary: str = None) -> dict:
        """将内容写入文件，返回引用。"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{source}_{timestamp}.txt"
        file_path = self.base_path / filename
        
        file_path.write_text(content)
        
        reference = {
            "type": "file_reference",
            "path": str(file_path),
            "source": source,
            "timestamp": timestamp,
            "size_chars": len(content),
            "summary": summary or self._extract_summary(content)
        }
        
        self.manifest[filename] = reference
        return reference
    
    def _extract_summary(self, content: str, max_chars: int = 500) -> str:
        """提取第一个有意义的内容作为摘要。"""
        lines = content.strip().split('\n')
        summary_lines = []
        char_count = 0
        
        for line in lines:
            if char_count + len(line) > max_chars:
                break
            summary_lines.append(line)
            char_count += len(line)
        
        return '\n'.join(summary_lines)
    
    def cleanup(self, max_age_hours: int = 24):
        """删除超过阈值的草稿文件。"""
        cutoff = datetime.now().timestamp() - (max_age_hours * 3600)
        
        for file_path in self.base_path.glob("*.txt"):
            if file_path.stat().st_mtime < cutoff:
                file_path.unlink()
                if file_path.name in self.manifest:
                    del self.manifest[file_path.name]
```

### 2. 计划持久化

带进度跟踪的结构化计划存储。

```python
import yaml
from dataclasses import dataclass, field, asdict
from enum import Enum
from typing import List, Optional

class StepStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"

@dataclass
class PlanStep:
    id: int
    description: str
    status: StepStatus = StepStatus.PENDING
    notes: Optional[str] = None

@dataclass
class AgentPlan:
    objective: str
    steps: List[PlanStep] = field(default_factory=list)
    status: str = "in_progress"
    
    def save(self, path: str = "scratch/current_plan.yaml"):
        """将计划持久化到文件系统。"""
        data = {
            "objective": self.objective,
            "status": self.status,
            "steps": [
                {
                    "id": s.id,
                    "description": s.description,
                    "status": s.status.value,
                    "notes": s.notes
                }
                for s in self.steps
            ]
        }
        with open(path, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)
    
    @classmethod
    def load(cls, path: str = "scratch/current_plan.yaml") -> "AgentPlan":
        """从文件系统加载计划。"""
        with open(path, 'r') as f:
            data = yaml.safe_load(f)
        
        plan = cls(objective=data["objective"], status=data.get("status", "in_progress"))
        for step_data in data.get("steps", []):
            plan.steps.append(PlanStep(
                id=step_data["id"],
                description=step_data["description"],
                status=StepStatus(step_data["status"]),
                notes=step_data.get("notes")
            ))
        return plan
    
    def current_step(self) -> Optional[PlanStep]:
        """获取第一个未完成的步骤。"""
        for step in self.steps:
            if step.status != StepStatus.COMPLETED:
                return step
        return None
    
    def complete_step(self, step_id: int, notes: str = None):
        """将步骤标记为已完成。"""
        for step in self.steps:
            if step.id == step_id:
                step.status = StepStatus.COMPLETED
                if notes:
                    step.notes = notes
                break
```

### 3. 子代理工作区

代理之间的基于文件的通信。

```python
from pathlib import Path
from datetime import datetime
import json

class AgentWorkspace:
    """管理代理的基于文件的工作区。"""
    
    def __init__(self, agent_id: str, base_path: str = "workspace/agents"):
        self.agent_id = agent_id
        self.path = Path(base_path) / agent_id
        self.path.mkdir(parents=True, exist_ok=True)
        
        # 标准文件
        self.findings_file = self.path / "findings.md"
        self.status_file = self.path / "status.json"
        self.log_file = self.path / "activity.log"
    
    def write_finding(self, content: str, append: bool = True):
        """写入或追加发现。"""
        mode = 'a' if append else 'w'
        with open(self.findings_file, mode) as f:
            if append:
                f.write(f"\n---\n## {datetime.now().isoformat()}\n\n")
            f.write(content)
    
    def update_status(self, status: str, progress: float = None, details: dict = None):
        """更新代理状态以供协调器查看。"""
        status_data = {
            "agent_id": self.agent_id,
            "status": status,
            "updated_at": datetime.now().isoformat(),
            "progress": progress,
            "details": details or {}
        }
        self.status_file.write_text(json.dumps(status_data, indent=2))
    
    def log(self, message: str):
        """追加到活动日志。"""
        with open(self.log_file, 'a') as f:
            f.write(f"[{datetime.now().isoformat()}] {message}\n")
    
    def read_peer_findings(self, peer_id: str) -> str:
        """从其他代理的工作区读取发现。"""
        peer_path = self.path.parent / peer_id / "findings.md"
        if peer_path.exists():
            return peer_path.read_text()
        return ""


class CoordinatorWorkspace:
    """从子代理工作区读取的协调器。"""
    
    def __init__(self, base_path: str = "workspace/agents"):
        self.base_path = Path(base_path)
    
    def get_all_statuses(self) -> dict:
        """从所有子代理收集状态。"""
        statuses = {}
        for agent_dir in self.base_path.iterdir():
            if agent_dir.is_dir():
                status_file = agent_dir / "status.json"
                if status_file.exists():
                    statuses[agent_dir.name] = json.loads(status_file.read_text())
        return statuses
    
    def aggregate_findings(self) -> str:
        """将所有代理发现合并为综合结果。"""
        findings = []
        for agent_dir in self.base_path.iterdir():
            if agent_dir.is_dir():
                findings_file = agent_dir / "findings.md"
                if findings_file.exists():
                    findings.append(f"# {agent_dir.name}\n\n{findings_file.read_text()}")
        return "\n\n".join(findings)
```

### 4. 动态技能加载器

按需加载技能内容。

```python
from pathlib import Path
from typing import List, Optional
import yaml

@dataclass
class SkillMetadata:
    name: str
    description: str
    path: str
    triggers: List[str] = field(default_factory=list)

class SkillLoader:
    """管理代理技能的动态加载。"""
    
    def __init__(self, skills_path: str = "skills"):
        self.skills_path = Path(skills_path)
        self.skill_index = self._build_index()
    
    def _build_index(self) -> dict:
        """从 SKILL.md 前置元数据构建可用技能索引。"""
        index = {}
        for skill_dir in self.skills_path.iterdir():
            if skill_dir.is_dir():
                skill_file = skill_dir / "SKILL.md"
                if skill_file.exists():
                    metadata = self._parse_frontmatter(skill_file)
                    if metadata:
                        index[metadata.name] = metadata
        return index
    
    def _parse_frontmatter(self, path: Path) -> Optional[SkillMetadata]:
        """从技能文件提取 YAML 前置元数据。"""
        content = path.read_text()
        if content.startswith('---'):
            end = content.find('---', 3)
            if end > 0:
                frontmatter = yaml.safe_load(content[3:end])
                return SkillMetadata(
                    name=frontmatter.get('name', path.parent.name),
                    description=frontmatter.get('description', ''),
                    path=str(path),
                    triggers=frontmatter.get('triggers', [])
                )
        return None
    
    def get_static_context(self) -> str:
        """生成列出可用技能的最小静态上下文。"""
        lines = ["可用技能（相关时使用 read_file 加载）："]
        for name, meta in self.skill_index.items():
            lines.append(f"- {name}: {meta.description[:100]}")
        return "\n".join(lines)
    
    def load_skill(self, name: str) -> str:
        """加载完整技能内容。"""
        if name in self.skill_index:
            return Path(self.skill_index[name].path).read_text()
        raise ValueError(f"未知技能：{name}")
    
    def find_relevant_skills(self, query: str) -> List[str]:
        """查找可能与查询相关的技能。"""
        query_lower = query.lower()
        relevant = []
        for name, meta in self.skill_index.items():
            if any(trigger in query_lower for trigger in meta.triggers):
                relevant.append(name)
            elif name.replace('-', ' ') in query_lower:
                relevant.append(name)
        return relevant
```

### 5. 终端输出持久化

捕获并持久化终端会话。

```python
import subprocess
from pathlib import Path
from datetime import datetime
import re

class TerminalCapture:
    """捕获并持久化终端输出以供代理访问。"""
    
    def __init__(self, terminals_path: str = "terminals"):
        self.terminals_path = Path(terminals_path)
        self.terminals_path.mkdir(parents=True, exist_ok=True)
        self.session_counter = 0
    
    def run_command(self, command: str, capture: bool = True) -> dict:
        """运行命令并可选择将输出捕获到文件。"""
        self.session_counter += 1
        
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True
        )
        
        output = {
            "command": command,
            "exit_code": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "timestamp": datetime.now().isoformat()
        }
        
        if capture:
            output["file"] = self._persist_output(output)
        
        return output
    
    def _persist_output(self, output: dict) -> str:
        """将输出写入终端文件。"""
        filename = f"{self.session_counter}.txt"
        file_path = self.terminals_path / filename
        
        content = f"""---
command: {output['command']}
exit_code: {output['exit_code']}
timestamp: {output['timestamp']}
---

=== STDOUT ===
{output['stdout']}

=== STDERR ===
{output['stderr']}
"""
        file_path.write_text(content)
        return str(file_path)
    
    def grep_terminals(self, pattern: str, context_lines: int = 3) -> List[dict]:
        """在所有终端输出中搜索模式。"""
        matches = []
        regex = re.compile(pattern, re.IGNORECASE)
        
        for term_file in self.terminals_path.glob("*.txt"):
            content = term_file.read_text()
            lines = content.split('\n')
            
            for i, line in enumerate(lines):
                if regex.search(line):
                    start = max(0, i - context_lines)
                    end = min(len(lines), i + context_lines + 1)
                    matches.append({
                        "file": str(term_file),
                        "line_number": i + 1,
                        "context": '\n'.join(lines[start:end])
                    })
        
        return matches
```

### 6. 自修改保护

代理自学习的安全模式。

```python
import yaml
from pathlib import Path
from datetime import datetime
from typing import Any

class PreferenceStore:
    """代理学习偏好的受保护存储。"""
    
    MAX_ENTRIES = 100
    MAX_VALUE_LENGTH = 1000
    
    def __init__(self, path: str = "agent/preferences.yaml"):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.preferences = self._load()
    
    def _load(self) -> dict:
        """从文件加载偏好。"""
        if self.path.exists():
            return yaml.safe_load(self.path.read_text()) or {}
        return {}
    
    def _save(self):
        """将偏好持久化到文件。"""
        self.path.write_text(yaml.dump(self.preferences, default_flow_style=False))
    
    def remember(self, key: str, value: Any, source: str = "user"):
        """存储带验证的偏好。"""
        # 验证键
        if not key or len(key) > 100:
            raise ValueError("无效的键长度")
        
        # 验证值
        value_str = str(value)
        if len(value_str) > self.MAX_VALUE_LENGTH:
            raise ValueError(f"值超过最大长度 {self.MAX_VALUE_LENGTH}")
        
        # 检查条目限制
        if len(self.preferences) >= self.MAX_ENTRIES and key not in self.preferences:
            raise ValueError(f"已达到最大条目数 ({self.MAX_ENTRIES})")
        
        # 存储带元数据
        self.preferences[key] = {
            "value": value,
            "source": source,
            "updated_at": datetime.now().isoformat()
        }
        self._save()
    
    def recall(self, key: str, default: Any = None) -> Any:
        """检索偏好。"""
        entry = self.preferences.get(key)
        if entry:
            return entry["value"]
        return default
    
    def list_all(self) -> dict:
        """获取所有偏好以进行上下文注入。"""
        return {k: v["value"] for k, v in self.preferences.items()}
    
    def forget(self, key: str):
        """删除偏好。"""
        if key in self.preferences:
            del self.preferences[key]
            self._save()
```

## 集成示例

在代理工具中组合模式：

```python
class FilesystemContextAgent:
    """具有基于文件系统的上下文管理的代理。"""
    
    def __init__(self):
        self.scratch = ScratchPadManager()
        self.skills = SkillLoader()
        self.preferences = PreferenceStore()
        self.workspace = AgentWorkspace("main_agent")
    
    def handle_tool_output(self, tool_name: str, output: str) -> str:
        """处理工具输出，必要时卸载。"""
        if self.scratch.should_offload(output):
            ref = self.scratch.offload(output, source=tool_name)
            return f"[{tool_name} 输出保存到 {ref['path']}。摘要：{ref['summary'][:200]}]"
        return output
    
    def get_system_prompt(self) -> str:
        """构建带动态技能引用的系统提示。"""
        base_prompt = "你是一个有帮助的助手。"
        skill_context = self.skills.get_static_context()
        user_prefs = self.preferences.list_all()
        
        pref_section = ""
        if user_prefs:
            pref_section = "\n\n用户偏好：\n" + "\n".join(
                f"- {k}: {v}" for k, v in user_prefs.items()
            )
        
        return f"{base_prompt}\n\n{skill_context}{pref_section}"
```

## 文件组织最佳实践

```
project/
├── scratch/                    # 临时工作文件
│   ├── tool_outputs/          # 大型工具结果
│   │   └── search_20260107.txt
│   └── plans/                 # 活动任务计划
│       └── current_plan.yaml
├── workspace/                  # 代理工作区
│   └── agents/
│       ├── research_agent/
│       │   ├── findings.md
│       │   └── status.json
│       └── code_agent/
│           ├── findings.md
│           └── status.json
├── agent/                      # 代理配置
│   ├── preferences.yaml       # 学习的偏好
│   └── patterns.md           # 发现的模式
├── skills/                     # 可加载技能
│   └── {skill-name}/
│       └── SKILL.md
├── terminals/                  # 终端输出
│   ├── 1.txt
│   └── 2.txt
└── history/                    # 聊天记录存档
    └── session_001.txt
```

## Token 核算指标

跟踪这些指标以验证文件系统模式：

1. **静态上下文比率**：静态上下文中的 token / 总 token
2. **动态加载率**：每任务加载技能/文件的频率
3. **卸载节省**：通过写入文件而不是保留在上下文中节省的 token
4. **检索精度**：实际使用的加载内容的百分比

目标基准：
- 静态上下文比率 < 20%
- 工具密集型工作流的卸载节省 > 50%
- 检索精度 > 70%（加载的内容是相关的）
