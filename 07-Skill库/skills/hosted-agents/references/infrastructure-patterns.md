# 托管代理的基础设施模式

本参考提供构建托管代理基础设施的详细实现模式。这些模式源自大规模生产系统。

## 沙盒架构

### Modal 集成模式

Modal 提供具有近即时启动和文件系统快照的沙盒基础设施。

```python
import modal

# 定义包含所有依赖项的基础镜像
image = modal.Image.debian_slim().pip_install([
    "opencode",
    "gitpython",
    "psycopg2-binary",
])

# 创建应用
app = modal.App("coding-agent")

# 具有快照支持的沙盒类
@app.cls(image=image, timeout=3600)
class AgentSandbox:
    def __init__(self, repo_url: str, snapshot_id: str = None):
        self.repo_url = repo_url
        self.snapshot_id = snapshot_id
    
    @modal.enter()
    def setup(self):
        if self.snapshot_id:
            # 从快照恢复
            modal.Sandbox.restore(self.snapshot_id)
        else:
            # 从镜像进行全新设置
            self._clone_and_setup()
    
    def _clone_and_setup(self):
        """克隆仓库并运行初始设置。"""
        token = self._get_github_app_token()
        os.system(f"git clone https://x-access-token:{token}@github.com/{self.repo_url}")
        os.system("npm install")
        os.system("npm run build")
    
    @modal.method()
    def execute_prompt(self, prompt: str, user_identity: dict) -> dict:
        """在沙盒中执行提示。"""
        # 为此用户更新 git 配置
        os.system(f'git config user.name "{user_identity["name"]}"')
        os.system(f'git config user.email "{user_identity["email"]}"')
        
        # 运行代理
        result = self.agent.run(prompt)
        
        return {
            "result": result,
            "snapshot_id": modal.Sandbox.snapshot()
        }
```

### 镜像构建流水线

按计划构建镜像以保持其新鲜度：

```python
import schedule
import time
from datetime import datetime

class ImageBuilder:
    def __init__(self, repositories: list[str]):
        self.repositories = repositories
        self.images = {}
    
    def build_all_images(self):
        """为所有仓库构建镜像。"""
        for repo in self.repositories:
            try:
                image = self._build_image(repo)
                self.images[repo] = {
                    "image": image,
                    "built_at": datetime.utcnow(),
                    "commit": self._get_latest_commit(repo)
                }
            except Exception as e:
                # 记录但继续处理其他仓库
                log.error(f"为 {repo} 构建镜像失败：{e}")
    
    def _build_image(self, repo: str) -> str:
        """构建单个仓库镜像。"""
        sandbox = modal.Sandbox.create()
        
        # 使用应用令牌克隆
        token = get_app_installation_token(repo)
        sandbox.exec(f"git clone https://x-access-token:{token}@github.com/{repo} /workspace")
        
        # 安装依赖
        sandbox.exec("cd /workspace && npm install")
        
        # 运行构建
        sandbox.exec("cd /workspace && npm run build")
        
        # 创建快照
        snapshot_id = sandbox.snapshot()
        
        return snapshot_id
    
    def start_scheduler(self):
        """每小时启动构建调度器。"""
        schedule.every().hour.do(self.build_all_images)
        
        while True:
            schedule.run_pending()
            time.sleep(60)
```

## 身份和认证

### GitHub App 认证

使用 GitHub App 进行安全、可扩展的仓库访问：

```python
import jwt
import requests
from datetime import datetime, timedelta

class GitHubAppAuth:
    def __init__(self, app_id: str, private_key: str):
        self.app_id = app_id
        self.private_key = private_key
    
    def _generate_jwt(self) -> str:
        """为 GitHub App 认证生成 JWT。"""
        payload = {
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(minutes=10),
            "iss": self.app_id
        }
        return jwt.encode(payload, self.private_key, algorithm="RS256")
    
    def get_installation_token(self, installation_id: str) -> str:
        """获取特定安装的安装令牌。"""
        jwt_token = self._generate_jwt()
        
        response = requests.post(
            f"https://api.github.com/app/installations/{installation_id}/access_tokens",
            headers={
                "Authorization": f"Bearer {jwt_token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        response.raise_for_status()
        
        return response.json()["token"]
    
    def get_repo_installation_token(self, repo: str) -> str:
        """获取仓库的安装令牌。"""
        jwt_token = self._generate_jwt()
        
        # 获取仓库的安装
        response = requests.get(
            f"https://api.github.com/repos/{repo}/installation",
            headers={
                "Authorization": f"Bearer {jwt_token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        response.raise_for_status()
        
        installation_id = response.json()["id"]
        return self.get_installation_token(installation_id)
```

### 用户身份传播

将用户身份传播到沙盒执行：

```python
@dataclass
class UserIdentity:
    user_id: str
    name: str
    email: str
    github_username: str
    team_id: Optional[str] = None

class IdentityPropagator:
    def __init__(self, sandbox: modal.Sandbox):
        self.sandbox = sandbox
    
    def propagate(self, identity: UserIdentity):
        """在沙盒中设置用户身份。"""
        # 设置 git 配置
        self.sandbox.exec(f'git config --global user.name "{identity.name}"')
        self.sandbox.exec(f'git config --global user.email "{identity.email}"')
        
        # 设置环境变量
        self.sandbox.exec(f'export USER_ID="{identity.user_id}"')
        self.sandbox.exec(f'export GITHUB_USERNAME="{identity.github_username}"')
        
        # 写入身份文件以供代理读取
        identity_json = json.dumps(asdict(identity))
        self.sandbox.exec(f'echo \'{identity_json}\' > /tmp/user_identity.json')
```

## 执行模式

### 带超时的受控执行

使用 Modal 的 Sandbox 实现受控执行：

```python
from modal import Sandbox

class ControlledExecutor:
    def __init__(self, timeout_seconds: int = 300):
        self.timeout_seconds = timeout_seconds
    
    async def execute_with_timeout(
        self,
        command: str,
        sandbox: Sandbox,
        on_output: Callable[[str], None] = None
    ) -> ExecutionResult:
        """在沙盒中执行命令并带超时。"""
        
        process = await sandbox.exec.aio(command)
        
        stdout_chunks = []
        stderr_chunks = []
        
        # 流式输出并带超时
        start_time = time.time()
        
        while True:
            if time.time() - start_time > self.timeout_seconds:
                process.terminate()
                raise TimeoutError(f"执行超时（{self.timeout_seconds}秒）")
            
            try:
                stdout = await asyncio.wait_for(
                    process.stdout.read.aio(),
                    timeout=1.0
                )
                if stdout:
                    stdout_chunks.append(stdout)
                    if on_output:
                        on_output(stdout)
            except asyncio.TimeoutError:
                pass
            
            if process.returncode is not None:
                break
        
        return ExecutionResult(
            stdout="".join(stdout_chunks),
            stderr="".join(stderr_chunks),
            return_code=process.returncode,
            duration=time.time() - start_time
        )
```

### 交互式会话管理

管理长时间运行的交互式会话：

```python
class InteractiveSession:
    def __init__(self, session_id: str, sandbox: Sandbox):
        self.session_id = session_id
        self.sandbox = sandbox
        self.history = []
        self.state = SessionState.ACTIVE
    
    async def send_input(self, input_text: str) -> str:
        """向交互式会话发送输入。"""
        if self.state != SessionState.ACTIVE:
            raise SessionError(f"会话不活跃：{self.state}")
        
        # 记录输入
        self.history.append({
            "type": "input",
            "content": input_text,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # 发送到沙盒中的进程
        process = self.sandbox.processes[self.main_process_id]
        process.stdin.write(input_text + "\n")
        
        # 等待输出并流式传输
        output_buffer = []
        timeout = 30  # 等待输出的秒数
        
        start = time.time()
        while time.time() - start < timeout:
            try:
                output = await asyncio.wait_for(
                    process.stdout.read.aio(),
                    timeout=0.5
                )
                output_buffer.append(output)
                
                # 检查提示符（表示命令完成）
                if self._is_prompt(output):
                    break
            except asyncio.TimeoutError:
                continue
        
        full_output = "".join(output_buffer)
        
        # 记录输出
        self.history.append({
            "type": "output",
            "content": full_output,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return full_output
    
    def snapshot(self) -> str:
        """创建会话快照。"""
        return self.sandbox.snapshot()
    
    def restore(self, snapshot_id: str):
        """从快照恢复会话。"""
        self.sandbox.restore(snapshot_id)
        self.state = SessionState.ACTIVE
```

## 监控和可观测性

### 结构化日志记录

实现全面的日志记录：

```python
import structlog
from dataclasses import asdict

logger = structlog.get_logger()

class ObservableSandbox:
    def __init__(self, sandbox_id: str, user_id: str):
        self.sandbox_id = sandbox_id
        self.user_id = user_id
        self.log_context = {
            "sandbox_id": sandbox_id,
            "user_id": user_id
        }
    
    def log_execution(self, command: str, result: ExecutionResult):
        """记录命令执行。"""
        logger.info(
            "command_executed",
            **self.log_context,
            command=command[:100],  # 截断长命令
            duration_ms=result.duration * 1000,
            return_code=result.return_code,
            stdout_size=len(result.stdout),
            stderr_size=len(result.stderr)
        )
    
    def log_tool_call(self, tool_name: str, inputs: dict, outputs: dict):
        """记录工具调用。"""
        logger.info(
            "tool_called",
            **self.log_context,
            tool=tool_name,
            input_keys=list(inputs.keys()),
            output_keys=list(outputs.keys()),
            output_size=len(str(outputs))
        )
    
    def log_error(self, error: Exception, context: dict = None):
        """记录错误并附加上下文。"""
        error_context = {**self.log_context}
        if context:
            error_context.update(context)
        
        logger.error(
            "sandbox_error",
            **error_context,
            error_type=type(error).__name__,
            error_message=str(error),
            stack_trace=traceback.format_exc()
        )
```

### 指标收集

收集执行指标：

```python
from prometheus_client import Counter, Histogram, Gauge

class SandboxMetrics:
    def __init__(self):
        self.execution_duration = Histogram(
            "sandbox_execution_duration_seconds",
            "命令执行持续时间",
            ["command_type"]
        )
        self.execution_count = Counter(
            "sandbox_execution_total",
            "总执行次数",
            ["status", "command_type"]
        )
        self.active_sessions = Gauge(
            "sandbox_active_sessions",
            "当前活跃会话数"
        )
        self.token_usage = Counter(
            "sandbox_token_usage_total",
            "LLM token 使用量",
            ["model", "call_type"]
        )
    
    def record_execution(self, duration: float, success: bool, command_type: str):
        """记录执行指标。"""
        self.execution_duration.labels(command_type=command_type).observe(duration)
        status = "success" if success else "failure"
        self.execution_count.labels(status=status, command_type=command_type).inc()
    
    def record_token_usage(self, tokens: int, model: str, call_type: str):
        """记录 token 使用量。"""
        self.token_usage.labels(model=model, call_type=call_type).inc(tokens)
```

## 安全和隔离

### 网络隔离

实施网络控制：

```python
class NetworkPolicy:
    def __init__(self):
        self.allowed_hosts = set()
        self.blocked_hosts = set()
    
    def allow_host(self, host: str):
        """允许出站连接到主机。"""
        self.allowed_hosts.add(host)
    
    def block_host(self, host: str):
        """阻止出站连接到主机。"""
        self.blocked_hosts.add(host)
    
    def apply_to_sandbox(self, sandbox: Sandbox):
        """将策略应用到沙盒。"""
        # 配置防火墙规则
        for host in self.blocked_hosts:
            sandbox.exec(f"iptables -A OUTPUT -d {host} -j DROP")
        
        # 如果指定了允许列表，阻止所有其他出站连接
        if self.allowed_hosts:
            sandbox.exec("iptables -P OUTPUT DROP")
            for host in self.allowed_hosts:
                sandbox.exec(f"iptables -A OUTPUT -d {host} -j ACCEPT")
```

### 资源限制

强制执行资源限制：

```python
class ResourceLimiter:
    def __init__(
        self,
        max_memory_mb: int = 2048,
        max_cpu_percent: int = 100,
        max_disk_gb: int = 10
    ):
        self.limits = {
            "memory": max_memory_mb * 1024 * 1024,  # 转换为字节
            "cpu": max_cpu_percent,
            "disk": max_disk_gb * 1024 * 1024 * 1024
        }
    
    def apply_to_sandbox(self, sandbox: Sandbox):
        """将资源限制应用到沙盒。"""
        # 内存限制
        sandbox.exec(f"ulimit -v {self.limits['memory']}")
        
        # CPU 限制（使用 cgroup）
        sandbox.exec(f"echo {self.limits['cpu'] * 1000} > /sys/fs/cgroup/cpu/cpu.cfs_quota_us")
        
        # 磁盘配额
        sandbox.exec(f"setquota -u $(whoami) {self.limits['disk']} {self.limits['disk']} 0 0 /")
```

## 部署模式

### 蓝绿部署

实现零停机部署：

```python
class BlueGreenDeployer:
    def __init__(self, app_name: str):
        self.app_name = app_name
        self.current_color = "blue"
    
    async def deploy(self, new_image: str):
        """使用蓝绿策略部署新版本。"""
        new_color = "green" if self.current_color == "blue" else "blue"
        
        # 启动新环境
        new_app = modal.App(f"{self.app_name}-{new_color}")
        
        @new_app.cls(image=new_image)
        class NewAgentSandbox:
            # ... 实现
            pass
        
        # 健康检查
        if await self._health_check(new_app):
            # 切换流量
            await self._switch_traffic(new_color)
            
            # 关闭旧环境
            old_app = modal.App(f"{self.app_name}-{self.current_color}")
            await old_app.stop()
            
            self.current_color = new_color
        else:
            raise DeploymentError("新环境健康检查失败")
    
    async def _health_check(self, app: modal.App) -> bool:
        """对新部署运行健康检查。"""
        try:
            # 测试基本功能
            sandbox = app.AgentSandbox()
            result = sandbox.execute_prompt("test", {})
            return result is not None
        except Exception:
            return False
```

## 最佳实践

1. **始终使用快照** 以加快启动速度
2. **实施健康检查** 以进行部署验证
3. **使用结构化日志记录** 以进行调试
4. **强制执行资源限制** 以防止滥用
5. **实施网络策略** 以进行安全控制
6. **使用 GitHub App 认证** 以进行可扩展的仓库访问
7. **记录所有执行** 以进行审计
8. **实施优雅降级** 以处理故障
