# Node/TypeScript MCP 服务器实现指南

## 概述

本文档提供使用 MCP TypeScript SDK 实现 MCP 服务器的 Node/TypeScript 特定最佳实践和示例。涵盖项目结构、服务器设置、工具注册模式、使用 Zod 进行输入验证、错误处理以及完整的工作示例。

---

## 快速参考

### 关键导入
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import { z } from "zod";
```

### 服务器初始化
```typescript
const server = new McpServer({
  name: "service-mcp-server",
  version: "1.0.0"
});
```

### 工具注册模式
```typescript
server.registerTool(
  "tool_name",
  {
    title: "工具显示名称",
    description: "工具的功能描述",
    inputSchema: { param: z.string() },
    outputSchema: { result: z.string() }
  },
  async ({ param }) => {
    const output = { result: `已处理: ${param}` };
    return {
      content: [{ type: "text", text: JSON.stringify(output) }],
      structuredContent: output // 结构化数据的现代模式
    };
  }
);
```

---

## MCP TypeScript SDK

官方 MCP TypeScript SDK 提供：
- 用于服务器初始化的 `McpServer` 类
- 用于工具注册的 `registerTool` 方法
- 用于运行时输入验证的 Zod 模式集成
- 类型安全的工具处理程序实现

**重要 - 仅使用现代 API：**
- **请使用**：`server.registerTool()`、`server.registerResource()`、`server.registerPrompt()`
- **请勿使用**：旧的已弃用 API，如 `server.tool()`、`server.setRequestHandler(ListToolsRequestSchema, ...)` 或手动处理程序注册
- `register*` 方法提供更好的类型安全、自动模式处理，是推荐的方法

有关完整详细信息，请参阅参考中的 MCP SDK 文档。

## 服务器命名约定

Node/TypeScript MCP 服务器必须遵循以下命名模式：
- **格式**：`{service}-mcp-server`（小写，使用连字符）
- **示例**：`github-mcp-server`、`jira-mcp-server`、`stripe-mcp-server`

名称应该是：
- 通用的（不绑定到特定功能）
- 描述所集成的服务/API
- 易于从任务描述中推断
- 不包含版本号或日期

## 项目结构

为 Node/TypeScript MCP 服务器创建以下结构：

```
{service}-mcp-server/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts          # 主入口点，包含 McpServer 初始化
│   ├── types.ts          # TypeScript 类型定义和接口
│   ├── tools/            # 工具实现（每个领域一个文件）
│   ├── services/         # API 客户端和共享工具
│   ├── schemas/          # Zod 验证模式
│   └── constants.ts      # 共享常量（API_URL、CHARACTER_LIMIT 等）
└── dist/                 # 构建的 JavaScript 文件（入口点：dist/index.js）
```

## 工具实现

### 工具命名

对工具名称使用 snake_case（例如，"search_users"、"create_project"、"get_channel_info"），使用清晰、面向操作的名称。

**避免命名冲突**：包含服务上下文以防止重叠：
- 使用 "slack_send_message" 而不是简单的 "send_message"
- 使用 "github_create_issue" 而不是简单的 "create_issue"
- 使用 "asana_list_tasks" 而不是简单的 "list_tasks"

### 工具结构

使用 `registerTool` 方法注册工具，具有以下要求：
- 使用 Zod 模式进行运行时输入验证和类型安全
- 必须显式提供 `description` 字段 - 不会自动提取 JSDoc 注释
- 显式提供 `title`、`description`、`inputSchema` 和 `annotations`
- `inputSchema` 必须是 Zod 模式对象（不是 JSON 模式）
- 显式键入所有参数和返回值

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "example-mcp",
  version: "1.0.0"
});

// 用于输入验证的 Zod 模式
const UserSearchInputSchema = z.object({
  query: z.string()
    .min(2, "查询必须至少 2 个字符")
    .max(200, "查询不能超过 200 个字符")
    .describe("用于匹配姓名/邮箱的搜索字符串"),
  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .describe("返回的最大结果数"),
  offset: z.number()
    .int()
    .min(0)
    .default(0)
    .describe("分页跳过的结果数"),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("输出格式：'markdown' 表示人类可读，'json' 表示机器可读")
}).strict();

// 从 Zod 模式派生的类型定义
type UserSearchInput = z.infer<typeof UserSearchInputSchema>;

server.registerTool(
  "example_search_users",
  {
    title: "搜索示例用户",
    description: `在示例系统中按姓名、邮箱或团队搜索用户。

此工具搜索示例平台中的所有用户配置文件，支持部分匹配和各种搜索过滤器。它不会创建或修改用户，仅搜索现有用户。

参数：
  - query (string): 用于匹配姓名/邮箱的搜索字符串
  - limit (number): 返回的最大结果数，介于 1-100 之间（默认值：20）
  - offset (number): 分页跳过的结果数（默认值：0）
  - response_format ('markdown' | 'json'): 输出格式（默认值：'markdown'）

返回：
  JSON 格式：具有以下模式的结构化数据：
  {
    "total": number,           // 找到的总匹配数
    "count": number,           // 此响应中的结果数
    "offset": number,          // 当前分页偏移量
    "users": [
      {
        "id": string,          // 用户 ID（例如，"U123456789"）
        "name": string,        // 全名（例如，"John Doe"）
        "email": string,       // 邮箱地址
        "team": string,        // 团队名称（可选）
        "active": boolean      // 用户是否处于活动状态
      }
    ],
    "has_more": boolean,       // 是否有更多结果可用
    "next_offset": number      // 下一页的偏移量（如果 has_more 为 true）
  }

示例：
  - 使用场景："查找所有营销团队成员" -> 参数 query="team:marketing"
  - 使用场景："搜索 John 的账户" -> 参数 query="john"
  - 不使用场景：你需要创建用户（改用 example_create_user）

错误处理：
  - 如果请求过多（429 状态），返回 "Error: Rate limit exceeded"
  - 如果搜索返回空，返回 "No users found matching '<query>'"`,
    inputSchema: UserSearchInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params: UserSearchInput) => {
    try {
      // Zod 模式处理输入验证
      // 使用验证后的参数进行 API 请求
      const data = await makeApiRequest<any>(
        "users/search",
        "GET",
        undefined,
        {
          q: params.query,
          limit: params.limit,
          offset: params.offset
        }
      );

      const users = data.users || [];
      const total = data.total || 0;

      if (!users.length) {
        return {
          content: [{
            type: "text",
            text: `未找到匹配 '${params.query}' 的用户`
          }]
        };
      }

      // 准备结构化输出
      const output = {
        total,
        count: users.length,
        offset: params.offset,
        users: users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          ...(user.team ? { team: user.team } : {}),
          active: user.active ?? true
        })),
        has_more: total > params.offset + users.length,
        ...(total > params.offset + users.length ? {
          next_offset: params.offset + users.length
        } : {})
      };

      // 根据请求的格式格式化文本表示
      let textContent: string;
      if (params.response_format === ResponseFormat.MARKDOWN) {
        const lines = [`# 用户搜索结果: '${params.query}'`, "",
          `找到 ${total} 个用户（显示 ${users.length} 个）`, ""];
        for (const user of users) {
          lines.push(`## ${user.name} (${user.id})`);
          lines.push(`- **邮箱**: ${user.email}`);
          if (user.team) lines.push(`- **团队**: ${user.team}`);
          lines.push("");
        }
        textContent = lines.join("\n");
      } else {
        textContent = JSON.stringify(output, null, 2);
      }

      return {
        content: [{ type: "text", text: textContent }],
        structuredContent: output // 结构化数据的现代模式
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: handleApiError(error)
        }]
      };
    }
  }
);
```

## 用于输入验证的 Zod 模式

Zod 提供运行时类型验证：

```typescript
import { z } from "zod";

// 带验证的基本模式
const CreateUserSchema = z.object({
  name: z.string()
    .min(1, "姓名为必填项")
    .max(100, "姓名不能超过 100 个字符"),
  email: z.string()
    .email("邮箱格式无效"),
  age: z.number()
    .int("年龄必须是整数")
    .min(0, "年龄不能为负数")
    .max(150, "年龄不能大于 150")
}).strict();  // 使用 .strict() 禁止额外字段

// 枚举
enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

const SearchSchema = z.object({
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("输出格式")
});

// 带默认值的可选字段
const PaginationSchema = z.object({
  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .describe("返回的最大结果数"),
  offset: z.number()
    .int()
    .min(0)
    .default(0)
    .describe("跳过的结果数")
});
```

## 响应格式选项

支持多种输出格式以提高灵活性：

```typescript
enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

const inputSchema = z.object({
  query: z.string(),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("输出格式：'markdown' 表示人类可读，'json' 表示机器可读")
});
```

**Markdown 格式**：
- 使用标题、列表和格式以提高清晰度
- 将时间戳转换为人类可读的格式
- 显示带 ID 的显示名称（括号中）
- 省略冗长的元数据
- 逻辑地分组相关信息

**JSON 格式**：
- 返回完整的结构化数据，适合程序处理
- 包含所有可用字段和元数据
- 使用一致的字段名称和类型

## 分页实现

对于列出资源的工具：

```typescript
const ListSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

async function listItems(params: z.infer<typeof ListSchema>) {
  const data = await apiRequest(params.limit, params.offset);

  const response = {
    total: data.total,
    count: data.items.length,
    offset: params.offset,
    items: data.items,
    has_more: data.total > params.offset + data.items.length,
    next_offset: data.total > params.offset + data.items.length
      ? params.offset + data.items.length
      : undefined
  };

  return JSON.stringify(response, null, 2);
}
```

## 字符限制和截断

添加 CHARACTER_LIMIT 常量以防止响应过大：

```typescript
// 在 constants.ts 的模块级别
export const CHARACTER_LIMIT = 25000;  // 最大响应大小（字符数）

async function searchTool(params: SearchInput) {
  let result = generateResponse(data);

  // 检查字符限制并在需要时截断
  if (result.length > CHARACTER_LIMIT) {
    const truncatedData = data.slice(0, Math.max(1, data.length / 2));
    response.data = truncatedData;
    response.truncated = true;
    response.truncation_message =
      `响应已从 ${data.length} 截断至 ${truncatedData.length} 项。` +
      `使用 'offset' 参数或添加过滤器以查看更多结果。`;
    result = JSON.stringify(response, null, 2);
  }

  return result;
}
```

## 错误处理

提供清晰、可操作的错误消息：

```typescript
import axios, { AxiosError } from "axios";

function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return "错误：未找到资源。请检查 ID 是否正确。";
        case 403:
          return "错误：权限被拒绝。您无权访问此资源。";
        case 429:
          return "错误：超出速率限制。请在发出更多请求前等待。";
        default:
          return `错误：API 请求失败，状态码 ${error.response.status}`;
      }
    } else if (error.code === "ECONNABORTED") {
      return "错误：请求超时。请重试。";
    }
  }
  return `错误：发生意外错误: ${error instanceof Error ? error.message : String(error)}`;
}
```

## 共享工具

将通用功能提取到可重用的函数中：

```typescript
// 共享 API 请求函数
async function makeApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  params?: any
): Promise<T> {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}/${endpoint}`,
      data,
      params,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
```

## Async/Await 最佳实践

始终对网络请求和 I/O 操作使用 async/await：

```typescript
// 良好：异步网络请求
async function fetchData(resourceId: string): Promise<ResourceData> {
  const response = await axios.get(`${API_URL}/resource/${resourceId}`);
  return response.data;
}

// 不良：Promise 链
function fetchData(resourceId: string): Promise<ResourceData> {
  return axios.get(`${API_URL}/resource/${resourceId}`)
    .then(response => response.data);  // 更难阅读和维护
}
```

## TypeScript 最佳实践

1. **使用严格 TypeScript**：在 tsconfig.json 中启用严格模式
2. **定义接口**：为所有数据结构创建清晰的接口定义
3. **避免 `any`**：使用适当的类型或 `unknown` 而不是 `any`
4. **Zod 用于运行时验证**：使用 Zod 模式验证外部数据
5. **类型守卫**：为复杂类型检查创建类型守卫函数
6. **错误处理**：始终使用带有适当错误类型检查的 try-catch
7. **空安全**：使用可选链 (`?.`) 和空值合并 (`??`)

```typescript
// 良好：使用 Zod 和接口实现类型安全
interface UserResponse {
  id: string;
  name: string;
  email: string;
  team?: string;
  active: boolean;
}

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  team: z.string().optional(),
  active: z.boolean()
});

type User = z.infer<typeof UserSchema>;

async function getUser(id: string): Promise<User> {
  const data = await apiCall(`/users/${id}`);
  return UserSchema.parse(data);  // 运行时验证
}

// 不良：使用 any
async function getUser(id: string): Promise<any> {
  return await apiCall(`/users/${id}`);  // 无类型安全
}
```

## 包配置

### package.json

```json
{
  "name": "{service}-mcp-server",
  "version": "1.0.0",
  "description": "用于 {Service} API 集成的 MCP 服务器",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "clean": "rm -rf dist"
  },
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.6.1",
    "axios": "^1.7.9",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 完整示例

```typescript
#!/usr/bin/env node
/**
 * 示例服务的 MCP 服务器。
 *
 * 此服务器提供与示例 API 交互的工具，包括用户搜索、
 * 项目管理和数据导出功能。
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios, { AxiosError } from "axios";

// 常量
const API_BASE_URL = "https://api.example.com/v1";
const CHARACTER_LIMIT = 25000;

// 枚举
enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

// Zod 模式
const UserSearchInputSchema = z.object({
  query: z.string()
    .min(2, "查询必须至少 2 个字符")
    .max(200, "查询不能超过 200 个字符")
    .describe("用于匹配姓名/邮箱的搜索字符串"),
  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .describe("返回的最大结果数"),
  offset: z.number()
    .int()
    .min(0)
    .default(0)
    .describe("分页跳过的结果数"),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("输出格式：'markdown' 表示人类可读，'json' 表示机器可读")
}).strict();

type UserSearchInput = z.infer<typeof UserSearchInputSchema>;

// 共享工具函数
async function makeApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  params?: any
): Promise<T> {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}/${endpoint}`,
      data,
      params,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return "错误：未找到资源。请检查 ID 是否正确。";
        case 403:
          return "错误：权限被拒绝。您无权访问此资源。";
        case 429:
          return "错误：超出速率限制。请在发出更多请求前等待。";
        default:
          return `错误：API 请求失败，状态码 ${error.response.status}`;
      }
    } else if (error.code === "ECONNABORTED") {
      return "错误：请求超时。请重试。";
    }
  }
  return `错误：发生意外错误: ${error instanceof Error ? error.message : String(error)}`;
}

// 创建 MCP 服务器实例
const server = new McpServer({
  name: "example-mcp",
  version: "1.0.0"
});

// 注册工具
server.registerTool(
  "example_search_users",
  {
    title: "搜索示例用户",
    description: `[如上所示的完整描述]`,
    inputSchema: UserSearchInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params: UserSearchInput) => {
    // 如上所示的实现
  }
);

// 主函数
// 对于 stdio（本地）：
async function runStdio() {
  if (!process.env.EXAMPLE_API_KEY) {
    console.error("错误：需要 EXAMPLE_API_KEY 环境变量");
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("示例 MCP 服务器已在 stdio 上运行");
}

// 对于 HTTP（远程）：
async function runHttp() {
  const app = express();

  app.post("/mcp", async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      console.error("请求关闭");
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.error(`示例 MCP 服务器正在端口 ${PORT} 上运行`);
  });
}

// 启动服务器
const mode = process.argv.includes("--http") ? "http" : "stdio";
if (mode === "http") {
  runHttp().catch(console.error);
} else {
  runStdio().catch(console.error);
}
```

## 服务器传输选项

MCP 服务器支持多种传输方式：

### stdio（本地）
用于本地集成的标准输入/输出传输：

```typescript
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();
await server.connect(transport);
```

### HTTP 与 SSE（远程）
用于远程部署的 HTTP 流式传输：

```typescript
import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
```

## 测试

使用 MCP 检查器测试服务器：

```bash
# 安装检查器
npm install -g @anthropics/mcp-inspector

# 运行检查器
mcp-inspector --server dist/index.js
```

## 部署

### 本地使用
```bash
# 构建
npm run build

# 运行
npm start
```

### 远程部署
```bash
# 构建
npm run build

# 以 HTTP 模式运行
node dist/index.js --http
```

## 参考

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Zod 文档](https://zod.dev/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
