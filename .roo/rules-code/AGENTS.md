# AGENTS.md - Code Mode

This file provides guidance to agents when working with code in this repository.

## 项目编码规则（非显而易见）

### React管理系统开发关键约束
- **vite.config.ts 必须使用默认 react() 配置**，避免 babel-plugin-react-dev-locator 依赖问题
- **postcss.config.js 必须使用 JavaScript 对象语法**，不能使用 CSS 语法
- **src/index.css 必须包含 Tailwind CSS 指令**：@tailwind base; @tailwind components; @tailwind utilities;

### 布局规范（关键且易错）
- **App.tsx 中 Content 组件必须设置 `margin: '16px'`**
- **所有页面容器（Home.tsx、UserManagement.tsx等）禁止设置 `padding`**
- **页面布局完全依靠模块间 `margin` 和 Card 组件内部间距控制**
- **同行模块必须使用 flexbox 实现高度对齐**

### 表格样式严格要求
- **所有列必须设置 `align: 'center'`**
- **列宽度严格按规范**：时间列160px、用户列180px、状态列100px、操作列200px
- **用户信息显示格式**：必须包含图标、用户名、ID标签的特定结构

### MCP服务配置注意事项
- **配置文件路径**：`~/.config/claude/mcp_settings.json`
- **Windows环境**：trae-mcp-config.json 中的路径必须使用双反斜杠或正斜杠
- **环境变量**：API密钥等敏感信息必须通过环境变量配置，不能硬编码

### 中文开发强制要求
- **所有代码注释必须使用中文**
- **API文档和技术文档用中文编写**
- **思考过程和逻辑分析都使用中文进行**
- **变量和函数命名可以使用英文，但注释必须是中文**

### 提示词专家文档格式
- **必须使用标准Markdown格式**
- **Emoji使用规范**：📋 🚀 🎨 📊 🎯 ✨ ⚠️ ✅
- **文档结构**：快速开始、核心规范、输出示例三部分缺一不可
- **质量检查清单**：每个专家文档必须包含完整的检查清单

### 测试用例编写规范
- **基于PRD文档编写详细测试用例**
- **使用Chrome DevTools进行全面功能测试**
- **生成MD格式的完整测试报告**
- **测试用例必须包含**：用例ID、测试步骤、预期结果、实际结果

### 配置文件常见陷阱
- **避免babel插件依赖问题**：使用默认react()配置
- **PostCSS语法错误**：确保使用JavaScript对象语法，不是CSS语法
- **Tailwind CSS指令位置**：必须在src/index.css中，不在postcss.config.js中

### 项目特定工具和命令
```bash
# MCP服务验证（非标准npm命令）
npm list -g @modelcontextprotocol/server-sequential-thinking

# JSON配置验证（需要jq工具）
cat 02-服务配置/claude-mcp-config.json | jq .

# 配置文件部署（平台特定）
cp 02-服务配置/claude-mcp-config.json ~/.config/claude/mcp_settings.json
```

### 代码质量特殊要求
- **TypeScript严格模式**：必须启用所有严格检查
- **ESLint规则**：必须遵循项目特定的代码规范
- **组件单一职责**：每个组件只负责一个明确的功能
- **中文注释完整性**：每个函数和复杂逻辑必须有中文注释

### 常见错误预防
- **不要在页面容器设置padding**：这是最常见的布局错误
- **不要使用非标准的vite配置**：会导致依赖问题
- **不要硬编码API密钥**：必须使用环境变量
- **不要忽略中文注释要求**：影响代码可维护性

这些规则是基于项目实际开发中发现的常见问题和特殊要求，遵循这些规则可以避免大部分配置和编码错误。