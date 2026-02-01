# 05-服务配置

## 模块定位

本模块提供MCP（Model Context Protocol）服务配置，用于给AI编程工具扩展能力（推理、检索、浏览器自动化、图表等）。支持Trae、Cursor等主流AI编程IDE。

## 什么是MCP？

MCP（Model Context Protocol）是一种开放协议，允许AI编程工具通过标准化的方式连接各种外部服务和工具，扩展AI的能力边界。

**MCP可以做什么？**
- 🧠 **深度思考**：处理复杂逻辑和推理任务
- 💾 **记忆存储**：记住对话历史和项目上下文
- 🔍 **文档搜索**：查找技术资料和API文档
- 🤖 **浏览器自动化**：自动测试网页、抓取数据
- 📊 **图表生成**：数据可视化、流程图绘制
- 🎨 **设计工具**：与Figma、Draw.io等设计工具集成

## 各IDE对MCP的支持

| IDE | MCP支持 | 支持方式 | 推荐指数 |
|-----|---------|----------|----------|
| **Trae** | ✅ 完整支持 | 内置MCP市场 + 手动配置 | ⭐⭐⭐⭐⭐ |
| **Cursor** | ⚠️ 部分支持 | 通过插件/扩展实现 | ⭐⭐⭐ |
| **Windsurf** | ❌ 不支持 | 暂不支持MCP | ⭐ |
| **GitHub Copilot** | ❌ 不支持 | 暂不支持MCP | ⭐ |

## 关键文件

### MCP服务配置

**文件**：[MCP服务/通用mcp配置.json](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/05-%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/MCP%E6%9C%8D%E5%8A%A1/%E9%80%9A%E7%94%A8mcp%E9%85%8D%E7%BD%AE.json)

**包含服务**：

| 服务名称 | 功能描述 | 重要性 | 适用场景 |
|---------|---------|--------|----------|
| **Sequential Thinking** | 顺序思考工具 | ⭐⭐⭐⭐⭐ | 复杂逻辑推理、多步骤任务 |
| **context7** | 技术文档搜索 | ⭐⭐⭐⭐ | 查找API文档、技术资料 |
| **Chrome DevTools MCP** | 浏览器调试 | ⭐⭐⭐⭐ | 网页调试、性能分析 |
| **playwright** | 浏览器自动化 | ⭐⭐⭐⭐ | 自动化测试、网页抓取 |
| **drawio** | 流程图绘制 | ⭐⭐⭐ | 绘制架构图、流程图 |
| **pencil** | UI原型设计 | ⭐⭐⭐ | 快速原型设计 |

## 各IDE配置方式

### Trae IDE（完整支持）

**方式1：使用MCP市场（推荐）**

1. 打开 Trae IDE
2. AI对话框 → 右上角设置 ⚙️ → MCP
3. 点击"添加"按钮，浏览MCP市场
4. 选择需要的服务，点击"+"添加
5. 部分服务需要配置API密钥

**方式2：手动配置**

1. 打开 Trae IDE
2. AI对话框 → 右上角设置 ⚙️ → MCP
3. 点击"手动添加"
4. 复制 `通用mcp配置.json` 的内容到编辑框
5. 保存并重启Trae IDE

**验证配置**：
```
@Builder with MCP 请列出可用的工具
```

### Cursor（部分支持）

Cursor暂不支持原生MCP，但可以通过以下方式实现类似功能：

**方式1：使用Terminal**

在Cursor的Terminal面板中直接运行MCP服务命令：
```bash
npx -y @modelcontextprotocol/server-sequential-thinking
```

**方式2：使用VS Code扩展**

安装支持MCP的VS Code扩展，Cursor作为VS Code分支可以使用：
- Playwright Test for VSCode
- Chrome DevTools

**方式3：使用@web命令**

Cursor支持 `@web` 命令搜索网络资源，部分替代context7功能：
```
@web 搜索React最新文档
```

### 其他IDE

其他IDE用户可以通过命令行使用MCP服务：

```bash
# 安装并运行Sequential Thinking
npm install -g @modelcontextprotocol/server-sequential-thinking
npx @modelcontextprotocol/server-sequential-thinking

# 安装并运行context7
npm install -g @upstash/context7-mcp
npx @upstash/context7-mcp@latest
```

## MCP服务详解

### 1. Sequential Thinking（顺序思考）

**功能**：帮助AI进行复杂的多步骤推理

**使用场景**：
- 复杂算法设计
- 多步骤业务逻辑
- 逻辑推理和决策

**Trae使用**：
```
@Builder with Sequential Thinking 请帮我分析这个复杂需求
```

### 2. context7（技术文档搜索）

**功能**：搜索和检索技术文档

**使用场景**：
- 查找API用法
- 了解框架特性
- 解决技术问题

**Trae使用**：
```
@Builder with context7 搜索React useEffect的最新用法
```

### 3. Chrome DevTools MCP

**功能**：浏览器调试和性能分析

**使用场景**：
- 调试网页问题
- 分析性能瓶颈
- 检查DOM结构

**Trae使用**：
```
@Builder with Chrome DevTools MCP 请检查当前页面的性能问题
```

### 4. Playwright（浏览器自动化）

**功能**：自动化浏览器操作

**使用场景**：
- 自动化测试
- 网页抓取
- 表单自动填写

**Trae使用**：
```
@Builder with playwright 请帮我测试登录功能
```

### 5. Draw.io（流程图绘制）

**功能**：绘制流程图和架构图

**使用场景**：
- 系统架构图
- 业务流程图
- 数据流图

**Trae使用**：
```
@Builder with drawio 请帮我绘制用户登录流程图
```

## 环境要求

### Node.js

所有MCP服务都需要Node.js环境：

```bash
# 检查Node.js版本
node --version  # 需要 >= 18 (LTS)

# 如果未安装，访问 https://nodejs.org 下载
```

### npm/npx

MCP服务通过npm/npx安装和运行：

```bash
# 检查npm版本
npm --version

# npx随npm一起安装
npx --version
```

## 常见问题

### Q1: MCP服务无法启动？

**解决方案**：
```bash
# 检查Node.js版本
node --version

# 重新安装Node.js LTS版本
# 访问 https://nodejs.org 下载

# 清除npm缓存
npm cache clean --force

# 重新安装MCP服务
npm install -g @modelcontextprotocol/server-sequential-thinking
```

### Q2: Trae中MCP服务显示"未启用"？

**解决方案**：
- 检查服务配置是否正确
- 确认服务依赖是否安装
- 重启Trae IDE
- 检查网络连接

### Q3: Cursor如何实现MCP功能？

**解决方案**：
- 使用Terminal直接运行MCP命令
- 安装VS Code扩展实现类似功能
- 使用 `@web` 命令搜索网络资源
- 考虑切换到Trae获得完整MCP支持

### Q4: MCP服务占用太多资源？

**解决方案**：
- 只启用需要的MCP服务
- 关闭不用的服务
- 调整服务配置参数

## 替代方案

对于不支持MCP的IDE，可以使用以下替代方案：

| MCP功能 | 替代方案 | 适用IDE |
|---------|---------|---------|
| Sequential Thinking | 手动分步骤提问 | 全平台 |
| context7 | @web搜索、文档网站 | Cursor |
| Chrome DevTools | 浏览器开发者工具 | 全平台 |
| Playwright | 命令行运行Playwright | 全平台 |
| Draw.io | 使用draw.io网站 | 全平台 |

## 配套资源

| 资源类型 | 位置 | 说明 |
|---------|------|------|
| 快速配置清单 | `02-快速配置/AI编程IDE快速配置清单.md` | 5分钟快速上手指南 |
| 完整操作指南 | `01-完整指南/00-AI编程IDE零基础小白操作指南.md` | 详细操作说明 |
| 工具安装包 | `00-工具安装包/安装网址.md` | Node.js等工具下载 |
| Skill库 | `07-Skill库/README.md` | 高级功能封装 |

## 相关链接

- **MCP官方文档**：https://modelcontextprotocol.io/
- **Trae MCP文档**：https://docs.trae.ai/mcp
- **快速配置清单**：[02-快速配置/AI编程IDE快速配置清单.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/02-%E5%BF%AB%E9%80%9F%E9%85%8D%E7%BD%AE/AI%E7%BC%96%E7%A8%8BIDE%E5%BF%AB%E9%80%9F%E9%85%8D%E7%BD%AE%E6%B8%85%E5%8D%95.md)
- **项目架构文档**：[CLAUDE.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/CLAUDE.md)

---

**文档版本**: v2.0.0  
**最后更新**: 2026-01-29  
**维护人**: yuhang

> 💡 **提示**: MCP功能目前Trae支持最完整，Cursor部分支持，其他IDE暂不支持。建议Trae用户充分利用MCP扩展AI能力。
