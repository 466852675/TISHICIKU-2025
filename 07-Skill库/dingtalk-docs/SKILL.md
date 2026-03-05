---
name: dingtalk-docs
description: 钉钉文档操作技能。使用 mcporter CLI 连接钉钉 MCP server 执行文档创建、内容读写、文档搜索等操作。需要配置 DINGTALK_MCP_DOCS_URL 凭证。使用场景：创建云文档、读取文档内容、搜索文档、批量写入内容等。
version: 0.2.1
metadata:
  openclaw:
    requires:
      env:
        - DINGTALK_MCP_DOCS_URL
      bins:
        - mcporter
    primaryEnv: DINGTALK_MCP_DOCS_URL
    homepage: https://github.com/aliramw/dingtalk-docs
---

# 钉钉文档操作

通过 MCP 协议连接钉钉文档 API，执行文档创建、内容读写、搜索等操作。

## ⚠️ 安全须知

**安装前请阅读：**

1. **本技能需要外部 CLI 工具** - 需安装 `mcporter` (npm/bun 全局安装)
2. **需要配置认证凭证** - Streamable HTTP URL 包含访问令牌，请妥善保管
3. **权限限制** - 仅能操作当前用户有权限访问的文档
4. **测试环境优先** - 首次使用建议在测试文档中验证，确认无误后再操作生产数据

### 🔒 安全加固措施

| 保护措施 | 说明 |
|----------|------|
| **凭证隔离** | 推荐使用 `mcporter config` 持久化存储，避免命令行历史泄露 |
| **权限控制** | 仅能访问当前用户有权限的文档 |
| **命令超时** | mcporter 命令超时限制（60-120 秒） |
| **输入验证** | dentryUuid 格式验证，防止无效输入 |

**配置建议：**
```bash
# 设置工作目录限制（推荐）
export OPENCLAW_WORKSPACE=/Users/marila/.openclaw/workspace
```

## 前置要求

### 安装 mcporter CLI

本技能依赖 `mcporter` 工具。安装前请确认来源可信：

```bash
# 使用 npm 安装
npm install -g mcporter

# 或使用 bun 安装
bun install -g mcporter
```

验证安装：
```bash
mcporter --version
```

### 配置 MCP Server

**获取 Streamable HTTP URL：**

1. 访问钉钉 MCP 广场：https://mcp.dingtalk.com
2. 找到 **钉钉文档** 服务
3. 点击"获取 MCP Server 配置"按钮，复制 `Streamable HTTP URL`

**方式一：使用 mcporter config（推荐）**

```bash
# 添加钉钉文档服务器配置（持久化存储）
mcporter config add dingtalk-docs --url "<Streamable_HTTP_URL>"
```

**方式二：使用环境变量**

```bash
# 临时设置（当前终端会话有效）
export DINGTALK_MCP_DOCS_URL="<Streamable_HTTP_URL>"
```

将 `<Streamable_HTTP_URL>` 替换为实际获取的完整 URL。

> **⚠️ 凭证安全**: Streamable HTTP URL 包含访问令牌，等同于密码：
> - 不要提交到版本控制系统
> - 不要分享给他人
> - 推荐使用 `mcporter config` 持久化存储

## API 方法

钉钉文档 MCP 服务提供 **6 个工具方法**。所有调用统一使用 `--args` JSON 传参：

### 1. list_accessible_documents

**功能：** 搜索当前用户有权限访问的文档列表

**参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `keyword` | string | 否 | 搜索关键词 |

**返回：**
```json
{
  "docs": [
    {
      "dentryUuid": "文档唯一 ID",
      "title": "文档标题",
      "type": "文档类型",
      "updateTime": "最后更新时间"
    }
  ]
}
```

**使用示例：**
```bash
# 搜索包含"项目"的文档
mcporter call dingtalk-docs.list_accessible_documents --args '{"keyword": "项目"}'

# 列出所有有权限的文档
mcporter call dingtalk-docs.list_accessible_documents
```

---

### 2. get_my_docs_root_dentry_uuid

**功能：** 获取当前用户"我的文档"空间的根目录节点 ID

**参数：** 无

**返回：**
```json
{
  "rootDentryUuid": "DnRL6jAJMNX9kAgycoLy2vOo8yMoPYe1"
}
```

**使用示例：**
```bash
mcporter call dingtalk-docs.get_my_docs_root_dentry_uuid
```

**用途：** 获取的根目录 ID 可作为 `create_doc_under_node` 或 `create_dentry_under_node` 的父节点参数。

---

### 3. create_doc_under_node

**功能：** 在指定父节点下创建一篇新的在线文档

**参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 文档名称 |
| `parentDentryUuid` | string | 是 | 父节点 ID（可使用根目录 ID 或文件夹 ID） |

**返回：**
```json
{
  "dentryUuid": "新文档 ID",
  "title": "文档标题",
  "createTime": "创建时间",
  "url": "访问链接"
}
```

**使用示例：**
```bash
mcporter call dingtalk-docs.create_doc_under_node --args '{"name": "我的新文档", "parentDentryUuid": "ROOT_ID"}'
```

---

### 4. create_dentry_under_node

**功能：** 在指定节点下创建新节点（支持多种类型：文档、表格、PPT、文件夹等）

**参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 节点名称 |
| `accessType` | string | 是 | 节点类型（见下表） |
| `parentDentryUuid` | string | 是 | 父节点 ID |

**节点类型枚举：**
| 值 | 类型 |
|----|------|
| `0` | 文档 |
| `1` | 表格 |
| `2` | PPT |
| `3` | 白板 |
| `6` | 脑图 |
| `7` | 多维表 |
| `9` | 视频 |
| `10` | 图片 |
| `13` | 文件夹 |
| `14` | PDF |
| `99` | 其他文件 |

**使用示例：**
```bash
# 创建文件夹
mcporter call dingtalk-docs.create_dentry_under_node --args '{"name": "项目资料", "accessType": "13", "parentDentryUuid": "ROOT_ID"}'

# 创建表格
mcporter call dingtalk-docs.create_dentry_under_node --args '{"name": "数据报表", "accessType": "1", "parentDentryUuid": "ROOT_ID"}'
```

---

### 5. write_content_to_document

**功能：** 将文本内容写入目标文档（支持覆盖或续写模式）

**参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `content` | string | 是 | 要写入的内容（支持 Markdown 格式） |
| `updateType` | number | 是 | `0`=覆盖写入，`1`=续写 |
| `targetDentryUuid` | string | 是 | 目标文档 ID |

**返回：**
```json
{
  "success": true
}
```

**使用示例：**
```bash
# 覆盖写入
mcporter call dingtalk-docs.write_content_to_document --args '{"content": "# 项目计划\n\n## 目标\n完成 Q1 目标", "updateType": 0, "targetDentryUuid": "doc_xxx"}'

# 续写
mcporter call dingtalk-docs.write_content_to_document --args '{"content": "\n\n## 更新日志\n- 2026-03-02: 初始版本", "updateType": 1, "targetDentryUuid": "doc_xxx"}'
```

---

### 6. get_document_content_by_url

**功能：** 根据文档 URL 获取文档内容（Markdown 格式）

**参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `docUrl` | string | 是 | 文档 URL（格式：`https://alidocs.dingtalk.com/i/nodes/{dentryUuid}`） |

**返回：**
```json
{
  "content": "# 文档内容\n\n正文...",
  "format": "markdown"
}
```

**使用示例：**
```bash
mcporter call dingtalk-docs.get_document_content_by_url --args '{"docUrl": "https://alidocs.dingtalk.com/i/nodes/DnRL6jAJMNX9kAgycoLy2vOo8yMoPYe1"}'
```

---

## 完整工作流程示例

### 创建并写入文档

```bash
# 1. 获取根目录 ID
ROOT_ID=$(mcporter call dingtalk-docs.get_my_docs_root_dentry_uuid --output json | jq -r '.rootDentryUuid')

# 2. 创建新文档
DOC_ID=$(mcporter call dingtalk-docs.create_doc_under_node --args "{\"name\": \"项目计划\", \"parentDentryUuid\": \"$ROOT_ID\"}" --output json | jq -r '.dentryUuid')

# 3. 写入内容
mcporter call dingtalk-docs.write_content_to_document --args "{\"content\": \"# 项目计划\\n\\n## 目标\\n完成 Q1 目标\", \"updateType\": 0, \"targetDentryUuid\": \"$DOC_ID\"}"

# 4. 验证内容
mcporter call dingtalk-docs.get_document_content_by_url --args "{\"docUrl\": \"https://alidocs.dingtalk.com/i/nodes/$DOC_ID\"}"
```

### 搜索并读取文档

```bash
# 1. 搜索文档
mcporter call dingtalk-docs.list_accessible_documents --args '{"keyword": "项目"}'

# 2. 获取文档内容（假设搜索到 dentryUuid=abc123）
mcporter call dingtalk-docs.get_document_content_by_url --args '{"docUrl": "https://alidocs.dingtalk.com/i/nodes/abc123"}'
```

### 创建文件夹并整理文档

```bash
# 1. 获取根目录
ROOT_ID=$(mcporter call dingtalk-docs.get_my_docs_root_dentry_uuid --output json | jq -r '.rootDentryUuid')

# 2. 创建文件夹
FOLDER_ID=$(mcporter call dingtalk-docs.create_dentry_under_node --args "{\"name\": \"2026 项目\", \"accessType\": \"13\", \"parentDentryUuid\": \"$ROOT_ID\"}" --output json | jq -r '.dentryUuid')

# 3. 在文件夹中创建文档
mcporter call dingtalk-docs.create_doc_under_node --args "{\"name\": \"Q1 计划\", \"parentDentryUuid\": \"$FOLDER_ID\"}"
```

## 故障排查

### 常见问题

**1. 认证失败**
```
Error: Invalid credentials
```
- 检查 DINGTALK_MCP_DOCS_URL 是否正确
- 确认 URL 中包含完整的访问令牌
- 尝试重新获取 MCP Server 配置

**2. 权限不足**
```
Error: Permission denied
```
- 确认当前用户对文档有操作权限
- 检查文档是否被锁定或只读
- 确保父节点有写入权限

**3. 创建文档失败（错误码 52600007）**
- 可能是企业账号限制
- 父节点 ID 无效
- 钉钉文档服务临时故障

**4. 文档不存在**
```
Error: Document not found
```
- 确认 dentryUuid 正确
- 检查文档是否已被删除

### 日志位置

```bash
# mcporter 日志
~/.mcporter/logs/

# 技能执行日志
~/.openclaw/logs/
```

## 变更日志

参见 [CHANGELOG.md](CHANGELOG.md)

## 许可证

MIT License
