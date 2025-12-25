# 服务配置模块 - AI 上下文文档

> **导航**: [根目录](../../../CLAUDE.md) > [指南套件模块](../CLAUDE.md) > **服务配置模块**

---

## 📋 模块概述

**模块名称**: 服务配置  
**模块类型**: 配置库  
**模块定位**: MCP服务配置文件，提供AI平台所需的各种MCP服务配置

### 核心功能
- ⚙️ 提供通用MCP服务配置
- 🔧 支持多种MCP服务（Sequential Thinking、context7、Chrome DevTools等）
- 📋 开箱即用的配置文件
- 🚀 快速配置MCP服务

---

## 📁 模块结构

### 目录树
```
04-服务配置/
├── MCP服务/
│   └── 通用mcp配置.json      # 通用MCP服务配置文件
└── CLAUDE.md                # 本模块文档
```

### 子模块说明

| 子模块 | 路径 | 说明 | 关键文件 |
|--------|------|------|----------|
| MCP服务 | `MCP服务/` | MCP服务配置 | `通用mcp配置.json` |

---

## 🔗 模块依赖

### 内部依赖
- **无**: 配置文件相对独立

### 外部依赖
- **Trae IDE** 或类似AI平台（用于应用MCP配置）
- **Node.js** (版本 >= 14，用于运行MCP服务)
- **npm/npx** (用于安装和运行MCP服务)

---

## 📖 关键文件说明

### 1. 通用mcp配置.json
- **位置**: `MCP服务/通用mcp配置.json`
- **作用**: 通用MCP服务配置文件
- **包含服务**:
  1. **Sequential Thinking**: 顺序思考工具
     - 命令: `npx -y @modelcontextprotocol/server-sequential-thinking`
  2. **context7**: 技术文档搜索服务
     - 命令: `npx -y @upstash/context7-mcp@latest`
  3. **Chrome DevTools MCP**: 浏览器调试工具
     - 命令: `npx -y chrome-devtools-mcp@latest`
  4. **mcp-server-chart**: 图表服务（SSE类型）
     - URL: `https://mcp.api-inference.modelscope.net/fcc00574ee4a4d/sse`
  5. **playwright**: 浏览器自动化工具
     - 命令: `npx @playwright/mcp@latest`
  6. **MCP-ECharts**: ECharts图表服务（SSE类型）
     - URL: `https://mcp.api-inference.modelscope.net/6e398f095c2247/sse`
  7. **quickchart**: 快速图表服务（SSE类型）
     - URL: `https://mcp.api-inference.modelscope.net/c9e4463a2a164a/sse`

---

## 🎯 使用场景

### 场景1: 快速配置MCP服务
```
1. 复制 通用mcp配置.json 的内容
2. 在Trae IDE的MCP设置中粘贴配置
3. 保存配置并重启AI平台
4. 验证MCP服务是否正常加载
```

### 场景2: 按需启用服务
```
1. 根据项目需求选择需要的MCP服务
2. 从配置文件中提取对应的服务配置
3. 添加到自己的MCP配置中
4. 保存并应用配置
```

### 场景3: 服务组合使用
```
- 基础服务: Sequential Thinking + context7
- 开发服务: Chrome DevTools + playwright
- 图表服务: mcp-server-chart + MCP-ECharts + quickchart
```

---

## 🔧 接口与依赖

### 输入接口
- **配置文件**: JSON格式的MCP服务配置
- **用户配置**: 通过Trae IDE界面配置MCP服务

### 输出接口
- **MCP服务**: 配置的MCP服务在AI平台中可用
- **服务状态**: 可通过AI对话框检查服务状态

### 服务类型
- **命令类型**: 通过npx运行的服务（Sequential Thinking、context7、Chrome DevTools、playwright）
- **SSE类型**: 通过SSE连接的服务（mcp-server-chart、MCP-ECharts、quickchart）

---

## 📊 模块统计

### 文件统计
- **配置文件数**: 1个
- **MCP服务数**: 7个

### 服务分类
- **智能工具**: Sequential Thinking
- **文档服务**: context7
- **浏览器工具**: Chrome DevTools、playwright
- **图表服务**: mcp-server-chart、MCP-ECharts、quickchart

---

## 🚀 快速开始

### 配置步骤
1. **检查Node.js**: 确保已安装Node.js (版本 >= 14)
   ```bash
   node --version
   ```

2. **复制配置**: 打开 `MCP服务/通用mcp配置.json`，复制配置内容

3. **应用配置**: 
   - 在Trae IDE中打开MCP设置
   - 粘贴配置内容
   - 保存配置

4. **验证服务**: 在AI对话框中输入：
   ```
   @Builder with MCP 请检查服务状态
   ```

### 服务安装（如需要）
部分服务可能需要全局安装：
```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @upstash/context7-mcp
npm install -g chrome-devtools-mcp
npm install -g @playwright/mcp
```

---

## 📝 注意事项

### 使用限制
- **平台要求**: 需要Trae IDE或支持MCP的AI平台
- **网络要求**: SSE类型服务需要网络连接
- **Node.js版本**: 需要Node.js >= 14

### 最佳实践
- **按需启用**: 只启用必要的MCP服务
- **服务测试**: 配置后测试服务是否正常工作
- **配置备份**: 定期备份MCP配置文件
- **服务更新**: 定期更新MCP服务到最新版本

### 故障排除
- **服务无法启动**: 检查Node.js版本和网络连接
- **SSE服务失败**: 检查网络连接和服务URL是否有效
- **命令执行失败**: 检查npx是否可用，尝试全局安装服务

---

## 🔗 相关链接

- [根目录文档](../../../CLAUDE.md)
- [指南套件模块文档](../CLAUDE.md)
- [规则配置模块文档](../03-规则配置/CLAUDE.md)

---

**文档维护**: 本文档由 `/init-project` 命令自动生成和维护  
**最后更新**: 2025-12-25 22:22:38

