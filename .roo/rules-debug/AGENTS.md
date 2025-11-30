# AGENTS.md - Debug Mode

This file provides guidance to agents when working with code in this repository.

## 项目调试规则（非显而易见）

### React项目调试特殊要求
- **vite.config.ts 配置错误**：最常见的错误是使用了不存在的babel插件配置
- **postcss.config.js 语法错误**：必须使用JavaScript对象语法，不能使用CSS语法
- **Tailwind CSS 指令位置错误**：必须在src/index.css中，不在postcss.config.js中

### MCP服务调试关键点
- **配置文件路径**：`~/.config/claude/mcp_settings.json`（注意路径中的隐藏目录）
- **Windows路径分隔符**：trae-mcp-config.json中必须使用双反斜杠或正斜杠
- **服务启动顺序**：某些MCP服务有依赖关系，需要按正确顺序启动
- **端口冲突检测**：多个MCP服务可能使用相同端口，需要检查冲突

### 常见配置错误诊断
```bash
# 检查vite配置是否正确
cat vite.config.ts | grep -E "(babel|plugins)"

# 验证postcss配置语法
node -e "console.log(require('./postcss.config.js'))"

# 检查Tailwind CSS指令位置
grep -n "@tailwind" src/index.css

# 验证JSON配置文件格式
cat 02-服务配置/claude-mcp-config.json | jq .
```

### React开发服务器调试
- **热重载失效**：通常由vite配置错误或端口冲突引起
- **TypeScript编译错误**：检查tsconfig.json路径别名配置
- **样式不生效**：确认postcss.config.js和Tailwind配置正确性

### MCP服务调试技巧
```bash
# 检查MCP服务安装状态
npm list -g | grep mcp

# 测试单个MCP服务
npx @modelcontextprotocol/server-sequential-thinking --help

# 检查配置文件加载
cat ~/.config/claude/mcp_settings.json | jq '.mcpServers | keys[]'

# 验证环境变量
echo $NODE_OPTIONS
```

### 布局调试要点
- **页面间距问题**：检查App.tsx中Content组件的margin设置
- **模块对齐问题**：确认使用了flexbox实现同行模块高度对齐
- **表格样式问题**：验证所有列都设置了align: 'center'

### 浏览器开发者工具调试
- **React DevTools**：检查组件状态和props传递
- **网络面板**：监控API请求和响应
- **控制台错误**：特别关注配置文件加载错误
- **样式检查**：验证Tailwind CSS类是否正确应用

### 日志分析技巧
- **Vite开发服务器日志**：关注启动时的配置加载信息
- **MCP服务日志**：检查服务启动和连接状态
- **浏览器控制台**：查看运行时错误和警告
- **网络请求日志**：分析API调用失败原因

### 性能调试
- **内存使用**：某些MCP服务可能导致内存泄漏
- **启动时间**：vite开发服务器启动缓慢通常是配置问题
- **热重载速度**：大型项目可能需要调整watch配置

### 常见错误模式
1. **babel-plugin-react-dev-locator 依赖错误**
   - 错误信息：`Cannot find package 'babel-plugin-react-dev-locator'`
   - 解决方案：使用默认react()配置，不要自定义babel配置

2. **PostCSS配置语法错误**
   - 错误信息：`Failed to load PostCSS config: [SyntaxError] Invalid or unexpected token`
   - 解决方案：确保使用JavaScript对象语法，不是CSS语法

3. **Tailwind CSS不生效**
   - 错误现象：样式类不生效，页面显示异常
   - 解决方案：检查src/index.css是否包含@tailwind指令

### 调试检查清单
- [ ] vite.config.ts使用默认react()配置
- [ ] postcss.config.js使用JavaScript对象语法
- [ ] src/index.css包含Tailwind CSS指令
- [ ] MCP配置文件格式正确
- [ ] 环境变量正确设置
- [ ] 端口无冲突
- [ ] 依赖包正确安装

### 特殊调试命令
```bash
# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm install

# 强制重新构建
npm run build -- --force

# 检查TypeScript配置
npx tsc --noEmit

# 验证ESLint配置
npx eslint --print-config .
```

这些调试规则基于项目实际开发中遇到的常见问题，可以帮助快速定位和解决配置相关错误。