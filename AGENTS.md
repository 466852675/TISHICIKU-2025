# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 项目概述

这是一个智能体配置模板项目，专为AI开发者和企业用户设计的完整配置库。项目提供从框架搭建到生产部署的全套解决方案，包含专家级提示词、MCP服务配置和规格驱动工作流系统。

## 核心架构

项目采用四层模块化架构：

1. **01-框架配置/**: 框架系统提示词配置（React管理系统等）
2. **02-服务配置/**: MCP（Model Context Protocol）服务配置文件
3. **03-执行规则/**: AI执行规则和约束（6A原则、上下文规则等）
4. **04-提示词专家/**: 专业提示词专家库，涵盖需求分析、原型设计、测试验证、通用任务

## MCP服务配置

### 服务安装命令
```bash
# 核心MCP服务安装
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @modelcontextprotocol/server-memory
npm install -g mcp-deepwiki
npm install -g @modelcontextprotocol/server-playwright

# Python基础服务
pip install uvx
```

### 配置文件部署
```bash
# Claude/通用平台配置
cp 02-服务配置/claude-mcp-config.json ~/.config/claude/mcp_settings.json

# ModelScope/Trae CN平台配置
cp 02-服务配置/trae-mcp-config.json ~/.config/claude/mcp_settings.json
```

### 配置验证
```bash
# 验证JSON配置文件格式
cat 02-服务配置/claude-mcp-config.json | jq .

# 检查MCP服务状态
npm list -g @modelcontextprotocol/server-sequential-thinking
```

## 6A执行原则

项目遵循6A执行原则，确保高质量输出：
1. **Accurate** (准确) - 确保信息准确性
2. **Analytical** (分析) - 深度分析问题
3. **Actionable** (可执行) - 提供可执行的解决方案
4. **Adaptable** (适应) - 适应不同场景需求
5. **Accountable** (负责) - 对结果负责
6. **Agile** (敏捷) - 快速响应变化

## 提示词专家库使用指南

### 快速专家选择
- **需求分析**: `01-需求分析/需求生成专家.md` 或 `01-需求分析/PRD生成专家.md`
- **移动应用设计**: `02-原型设计/APP端/` （国网风/弥散风/苹果风）
- **PC应用设计**: `02-原型设计/PC端/` （看板风格/系统风格/简约风格）
- **UI分析复现**: `02-原型设计/UI规范专家.md`
- **功能测试**: `03-测试验证/功能测试专家.md`
- **通用任务**: `04-通用专家/` （PPT/周报/提示词/网页生成）

### React管理系统框架配置

#### 技术栈要求
- **前端框架**: React 18.3.1 + TypeScript 5.8.3
- **构建工具**: Vite 6.3.5
- **UI组件库**: Ant Design 5.26.7
- **样式框架**: Tailwind CSS 3.4.17
- **状态管理**: Zustand 5.0.3

#### 关键配置要求
- vite.config.ts 必须使用默认 react() 配置，避免 babel-plugin-react-dev-locator 依赖问题
- postcss.config.js 必须使用 JavaScript 对象语法，不能使用 CSS 语法
- src/index.css 包含 Tailwind CSS 指令：@tailwind base; @tailwind components; @tailwind utilities;

#### 布局规范
- App.tsx 中 Content 组件必须设置 `margin: '16px'`
- 所有页面容器（Home.tsx、UserManagement.tsx等）不得设置 `padding`
- 页面布局完全依靠模块间 `margin` 和 Card 组件内部间距控制
- 同行模块必须使用 flexbox 实现高度对齐

## 代码风格指南

### 文件组织规范
- 使用统一的Markdown格式
- 遵循专家文档格式标准模板
- Emoji使用规范：📋 🚀 🎨 📊 🎯 ✨ ⚠️ ✅
- 代码示例包含完整HTML结构和标准化CSS

### 中文开发规范
- 只允许使用中文回答和思考
- 代码注释和文档都应使用中文
- API 文档和技术文档用中文编写
- 思考过程和逻辑分析都使用中文进行

### 质量检查清单
- [ ] 格式统一：使用标准标题格式和emoji
- [ ] 内容完整：快速开始、核心规范、输出示例齐全
- [ ] 实用性：提供具体的使用技巧和注意事项
- [ ] 链接正确：确保内部链接和导航有效

## 测试设置

### 功能测试流程
1. 基于PRD文档编写详细测试用例
2. 使用Chrome DevTools进行全面功能测试
3. 验证页面元素一致性和交互功能正常性
4. 检查数据展示符合性
5. 生成MD格式的完整测试报告

### 测试覆盖要求
- 功能测试用例覆盖所有需求点
- 异常情况和边界值测试完整
- 用户体验场景测试充分
- 性能和安全性测试到位

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