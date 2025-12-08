# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个智能体配置模板项目，专为AI开发者和企业用户设计的完整配置库。项目提供从框架搭建到生产部署的全套解决方案，包含专家级提示词、MCP服务配置和规格驱动工作流系统。

## 核心架构

项目采用四层模块化架构：

1. **01-框架配置/**: 框架系统提示词配置（React管理系统等）
2. **02-服务配置/**: MCP（Model Context Protocol）服务配置文件
3. **03-执行规则/**: AI执行规则和约束（项目规则包含6A原则、上下文规则等，通用规则包含个人规则）
4. **04-提示词专家/**: 专业提示词专家库，涵盖需求分析、原型设计、测试验证、通用任务

## 常用命令

### MCP服务安装
```bash
# 安装核心MCP服务（Claude/通用平台）
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @modelcontextprotocol/server-memory
npm install -g mcp-deepwiki
npm install -g chrome-devtools-mcp
npm install -g @playwright/mcp
npm install -g @pimzino/spec-workflow-mcp
npm install -g @upstash/context7-mcp

# 安装Python基础服务（serena代码助手需要）
pip install uvx
```

### 配置文件部署
```bash
# Claude/通用平台配置
cp 02-服务配置/claude-mcp-config.json ~/.config/claude/mcp_settings.json

# ModelScope/Trae CN平台配置
cp 02-服务配置/Trae-mcp-config.json ~/.config/claude/mcp_settings.json
```

### 项目验证
```bash
# 验证JSON配置文件格式
cat 02-服务配置/claude-mcp-config.json | jq .

# 检查MCP服务状态
npm list -g @modelcontextprotocol/server-sequential-thinking
```

## 提示词专家库使用指南

### 快速专家选择
- **需求分析**: `04-提示词专家/01-需求分析/需求生成专家.md` 或 `04-提示词专家/01-需求分析/可研生成专家.md` 或 `04-提示词专家/01-需求分析/PRD生成专家.md`
- **移动应用设计**: `04-提示词专家/02-原型设计/APP端/` （国网风/弥散风/苹果风）
- **PC应用设计**: `04-提示词专家/02-原型设计/PC端/` （看板风格/系统风格/简约风格）
- **UI分析复现**: `04-提示词专家/02-原型设计/UI规范专家.md`
- **功能测试**: `04-提示词专家/03-测试验证/功能测试专家.md`
- **通用任务**: `04-提示词专家/04-通用专家/` （PPT/周报/提示词/网页生成）

### 典型工作流程
1. **需求阶段**: 需求生成专家 → 可研生成专家 → PRD生成专家
2. **设计阶段**: 选择合适的设计专家（根据应用类型和风格）
3. **测试阶段**: 功能测试专家 → 自动化测试专家
4. **通用任务**: 直接使用对应的通用专家

## MCP服务配置详解

### 核心服务（必须启用）
- **sequential-thinking**: 顺序思考工具，复杂问题分解
- **memory**: 知识图谱记忆系统
- **fetch**: HTTP请求工具
- **context7**: 技术文档搜索

### 专业服务（按需启用）
- **serena**: 智能代码助手（语义化代码理解、符号级编辑）
- **playwright**: 浏览器自动化工具
- **chrome-devtools**: Chrome开发者工具
- **zai-mcp-server**: AI图像分析、视频理解
- **web-search-prime**: 实时网络搜索
- **spec-workflow**: 规格驱动开发工作流系统

## 6A执行原则

项目遵循6A执行原则，确保高质量输出：
1. **Accurate** (准确) - 确保信息准确性
2. **Analytical** (分析) - 深度分析问题
3. **Actionable** (可执行) - 提供可执行的解决方案
4. **Adaptable** (适应) - 适应不同场景需求
5. **Accountable** (负责) - 对结果负责
6. **Agile** (敏捷) - 快速响应变化

## 开发规范

### 文件组织规范
- 使用统一的Markdown格式
- 遵循专家文档格式标准模板
- Emoji使用规范：📋 🚀 🎨 📊 🎯 ✨ ⚠️ ✅
- 代码示例包含完整HTML结构和标准化CSS

### 质量检查清单
- [ ] 格式统一：使用标准标题格式和emoji
- [ ] 内容完整：快速开始、核心规范、输出示例齐全
- [ ] 实用性：提供具体的使用技巧和注意事项
- [ ] 链接正确：确保内部链接和导航有效

## 故障排除

### 常见问题
1. **MCP服务无法启动**: 检查Node.js版本（需要>=14）和服务安装状态
2. **配置文件格式错误**: 使用JSON验证工具检查格式
3. **权限问题**: 确保配置文件具有正确的读写权限
4. **内存不足**: 调整Node.js内存限制或关闭不必要的服务

### 调试命令
```bash
# 检查Node.js版本
node --version

# 验证MCP服务安装
npm list -g | grep mcp

# 测试配置文件
cat ~/.config/claude/mcp_settings.json | jq .

# 增加Node.js内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
```

## 扩展开发

### 添加新专家
1. 在对应目录创建新的专家文件
2. 遵循专家文档格式标准模板
3. 包含完整的快速开始、核心规范、输出示例
4. 更新04-提示词专家/README.md导航

### 添加新框架配置
1. 在01-框架配置/创建新框架目录
2. 开发不同版本的系统提示词（v1基础版、v2增强版、v3专业版）
3. 针对框架特性定制化配置

### 自定义MCP服务
在配置文件中添加新的服务定义：
```json
{
  "mcpServers": {
    "my-custom-service": {
      "description": "自定义服务描述",
      "enabled": true,
      "server": {
        "command": "node",
        "args": ["my-service.js"]
      }
    }
  }
}
```

## 技术栈

- **配置管理**: JSON/YAML配置文件
- **文档格式**: Markdown
- **MCP服务**: Node.js/Python生态系统
- **代码示例**: HTML5, CSS3, JavaScript
- **AI平台**: Claude, ModelScope, Trae CN

## 版本管理

项目使用语义化版本 (SemVer)：
- **主版本号**: 不兼容的API修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

当前版本：v2.0.0（提示词专家库）
最后更新：2025-01-17