# 纵深防御验证

## 概述

当你修复由无效数据引起的错误时，在一个地方添加验证感觉就足够了。但那个单一检查可能被不同的代码路径、重构或 mock 绕过。

**核心原则：** 在数据通过的每一层都进行验证。让错误在结构上不可能发生。

## 为什么需要多层

单一验证："我们修复了错误"
多层验证："我们让错误不可能发生"

不同层捕获不同情况：
- 入口验证捕获大多数错误
- 业务逻辑捕获边缘情况
- 环境守卫防止特定于上下文的危险
- 调试日志在其他层失败时提供帮助

## 四层验证

### 第一层：入口点验证
**目的：** 在 API 边界拒绝明显无效的输入

```typescript
function createProject(name: string, workingDirectory: string) {
  if (!workingDirectory || workingDirectory.trim() === '') {
    throw new Error('workingDirectory cannot be empty');
  }
  if (!existsSync(workingDirectory)) {
    throw new Error(`workingDirectory does not exist: ${workingDirectory}`);
  }
  if (!statSync(workingDirectory).isDirectory()) {
    throw new Error(`workingDirectory is not a directory: ${workingDirectory}`);
  }
  // ... 继续
}
```

### 第二层：业务逻辑验证
**目的：** 确保数据对此操作有意义

```typescript
function initializeWorkspace(projectDir: string, sessionId: string) {
  if (!projectDir) {
    throw new Error('projectDir required for workspace initialization');
  }
  // ... 继续
}
```

### 第三层：环境守卫
**目的：** 在特定上下文中防止危险操作

```typescript
async function gitInit(directory: string) {
  // 在测试中，拒绝在临时目录外进行 git init
  if (process.env.NODE_ENV === 'test') {
    const normalized = normalize(resolve(directory));
    const tmpDir = normalize(resolve(tmpdir()));

    if (!normalized.startsWith(tmpDir)) {
      throw new Error(
        `Refusing git init outside temp dir during tests: ${directory}`
      );
    }
  }
  // ... 继续
}
```

### 第四层：调试工具
**目的：** 为取证捕获上下文

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  logger.debug('About to git init', {
    directory,
    cwd: process.cwd(),
    stack,
  });
  // ... 继续
}
```

## 应用模式

当你发现错误时：

1. **追踪数据流** - 坏值从哪里开始？在哪里使用？
2. **映射所有检查点** - 列出数据通过的每个点
3. **在每一层添加验证** - 入口、业务、环境、调试
4. **测试每一层** - 尝试绕过第一层，验证第二层捕获它

## 会话中的示例

错误：空的 `projectDir` 导致在源代码中执行 `git init`

**数据流：**
1. 测试设置 → 空字符串
2. `Project.create(name, '')`
3. `WorkspaceManager.createWorkspace('')`
4. `git init` 在 `process.cwd()` 中运行

**添加的四层：**
- 第一层：`Project.create()` 验证非空/存在/可写
- 第二层：`WorkspaceManager` 验证 projectDir 非空
- 第三层：`WorktreeManager` 在测试中拒绝在 tmpdir 外进行 git init
- 第四层：在 git init 之前记录堆栈跟踪

**结果：** 所有 1847 个测试通过，错误无法重现

## 关键洞察

所有四层都是必要的。在测试期间，每层都捕获了其他层遗漏的错误：
- 不同的代码路径绕过了入口验证
- Mock 绕过了业务逻辑检查
- 不同平台上的边缘情况需要环境守卫
- 调试日志识别了结构性误用

**不要止步于一个验证点。** 在每一层都添加检查。
