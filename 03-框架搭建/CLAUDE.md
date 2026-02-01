# 03-框架搭建

## 模块定位

本模块提供面向"React B端管理系统"的system prompt（v1~v3），用于在AI编程工具中统一技术栈、规范与产出方式。支持Trae、Cursor、Windsurf、GitHub Copilot等主流AI编程IDE。

## 关键文件

### System Prompt配置

| 版本 | 文件 | 复杂度 | 适用场景 | 技术栈 |
|------|------|--------|----------|--------|
| **v1 基础版** | [v1-system-prompt.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/03-%E6%A1%86%E6%9E%B6%E6%90%AD%E5%BB%BA/v1-system-prompt.md) | ⭐⭐ | 简单管理系统 | React 18 + TypeScript + Vite + Ant Design |
| **v2 增强版** | [v2-system-prompt.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/03-%E6%A1%86%E6%9E%B6%E6%90%AD%E5%BB%BA/v2-system-prompt.md) | ⭐⭐⭐ | 中等复杂度系统 | React 18 + TypeScript + Vite + Ant Design + 高级功能 |
| **v3 专业版** | [v3-system-prompt.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/03-%E6%A1%86%E6%9E%B6%E6%90%AD%E5%BB%BA/v3-system-prompt.md) | ⭐⭐⭐⭐⭐ | 企业级系统 | React 18 + TypeScript + Vite + Ant Design + 完整企业级功能 |

### 版本对比

| 功能特性 | v1 基础版 | v2 增强版 | v3 专业版 |
|---------|----------|----------|----------|
| 用户认证 | ✅ 基础登录 | ✅ 登录+注册+找回密码 | ✅ 完整认证+权限控制 |
| 用户管理 | ✅ 基础CRUD | ✅ CRUD+搜索+筛选 | ✅ 完整管理+批量操作 |
| 角色管理 | ❌ | ✅ 基础角色管理 | ✅ 完整RBAC权限 |
| 权限管理 | ❌ | ⚠️ 基础权限 | ✅ 完整权限体系 |
| 数据可视化 | ⚠️ 简单图表 | ✅ 多种图表 | ✅ 完整数据看板 |
| 主题切换 | ❌ | ✅ 明暗主题 | ✅ 多主题+自定义 |
| 国际化 | ❌ | ❌ | ✅ 多语言支持 |
| 响应式设计 | ✅ 基础适配 | ✅ 完整响应式 | ✅ 全端适配 |

## 各IDE使用方式

### Trae用户（推荐）

**方式1：创建专用智能体**

1. 在Trae中创建智能体，命名为"React B端开发专家"
2. 根据项目复杂度选择v1/v2/v3的system prompt内容
3. 将完整prompt粘贴到智能体配置中
4. 保存并开始使用

**方式2：项目规则配置**

1. 在项目根目录创建 `.trae/rules/project_rules.md`
2. 复制选定版本的system prompt内容
3. 在AI对话框中直接调用

### Cursor用户

**方式1：项目级System Prompt（推荐）**

1. 在项目根目录创建 `.cursorrules` 文件
2. 复制选定版本的system prompt内容
3. Cursor会自动应用该配置到当前项目

**方式2：全局配置**

1. 打开 Cursor Settings → General → AI Rules
2. 将system prompt添加到全局规则中
3. 适用于所有项目

### 其他IDE用户

**方式1：对话开始时发送**

在每次AI对话开始时，先发送system prompt内容：
```
你现在是React B端开发专家，请按照以下规范进行开发：
[粘贴v1/v2/v3的system prompt内容]
```

**方式2：项目文档引用**

将system prompt保存为项目文档，在对话中引用：
```
请参考 @v1-system-prompt.md 的规范进行开发
```

## 技术栈详情

### 核心技术栈（全版本通用）

- **前端框架**: React 18.3.1 + TypeScript 5.8.3
- **构建工具**: Vite 6.3.5
- **UI组件库**: Ant Design 5.26.7
- **图标库**: @ant-design/icons 6.0.0 + lucide-react 0.511.0
- **路由管理**: React Router DOM 7.7.1
- **状态管理**: Zustand 5.0.3
- **样式框架**: Tailwind CSS 3.4.17
- **工具库**: clsx 2.1.1 + tailwind-merge 3.0.2
- **通知组件**: sonner 2.0.2

### 开发工具配置

- **代码检查**: ESLint 9.25.0 + TypeScript ESLint 8.30.1
- **样式处理**: PostCSS 8.5.3 + Autoprefixer 10.4.21
- **路径别名**: vite-tsconfig-paths 5.1.4
- **类型定义**: @types/react 18.3.12 + @types/react-dom 18.3.1

## 项目结构规范

```
src/
├── components/          # 通用组件
│   ├── Breadcrumb.tsx  # 面包屑导航
│   ├── Empty.tsx       # 空状态
│   └── Layout.tsx      # 布局组件
├── hooks/              # 自定义Hook
│   ├── useTheme.ts     # 主题管理
│   └── useAuth.ts      # 认证管理
├── lib/                # 工具库
│   └── utils.ts        # 通用工具
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── Login.tsx       # 登录页
│   ├── Dashboard.tsx   # 数据看板
│   └── system/         # 系统管理
│       ├── UserManagement.tsx
│       ├── RoleManagement.tsx
│       └── PermissionManagement.tsx
├── stores/             # 状态管理（Zustand）
│   ├── authStore.ts
│   └── themeStore.ts
├── types/              # TypeScript类型定义
├── assets/             # 静态资源
├── App.tsx            # 应用主组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式
```

## 选型建议

### 按项目规模选择

| 项目规模 | 推荐版本 | 说明 |
|---------|---------|------|
| 小型项目（< 10个页面） | v1 基础版 | 快速开发，功能精简 |
| 中型项目（10-30个页面） | v2 增强版 | 功能完善，扩展性好 |
| 大型项目（> 30个页面） | v3 专业版 | 企业级功能，完整权限 |

### 按团队经验选择

| 团队经验 | 推荐版本 | 说明 |
|---------|---------|------|
| 初级团队 | v1 基础版 | 易于理解和维护 |
| 中级团队 | v2 增强版 | 平衡功能与复杂度 |
| 高级团队 | v3 专业版 | 完整功能，专业规范 |

### 按IDE选择

| IDE | 推荐版本 | 说明 |
|-----|---------|------|
| Trae | 任意版本 | 完整支持所有功能 |
| Cursor | v2/v3 | 支持复杂项目开发 |
| Windsurf | v1/v2 | 适合中小型项目 |
| GitHub Copilot | v1/v2 | 配合VS Code使用 |

## 使用示例

### 示例1：使用v1基础版快速启动项目

**Trae用户：**
```
@Builder 使用v1基础版规范，创建一个简单的用户管理系统，包含登录和用户信息管理
```

**Cursor用户：**
1. 确保 `.cursorrules` 中已配置v1内容
2. 在AI聊天中输入：
```
创建一个简单的用户管理系统，包含登录和用户信息管理页面
```

### 示例2：使用v3专业版开发企业级系统

**Trae用户：**
```
@Builder 使用v3专业版规范，创建一个完整的企业级后台管理系统，包含：
1. 完整的RBAC权限管理
2. 用户、角色、权限管理
3. 数据可视化看板
4. 主题切换和国际化支持
```

**Cursor用户：**
1. 确保 `.cursorrules` 中已配置v3内容
2. 在AI聊天中输入需求描述

## 与6A执行规则的集成

本模块的system prompt与 `04-规则配置/项目规则/6A执行规则.md` 深度集成：

| 6A阶段 | System Prompt作用 |
|--------|------------------|
| 对齐（Align） | 统一技术栈和开发规范 |
| 架构（Architect） | 定义项目结构和组件规范 |
| 原子化（Atomize） | 拆分功能模块和组件 |
| 审批（Approve） | 代码规范和最佳实践 |
| 自动化（Automate） | 生成标准化代码 |
| 评估（Assess） | 代码质量和性能标准 |

## 配套资源

| 资源类型 | 位置 | 说明 |
|---------|------|------|
| 6A执行规则 | `04-规则配置/项目规则/6A执行规则.md` | 项目工作流程规范 |
| 个人规则 | `04-规则配置/通用配置/个人规则.md` | 全局AI行为配置 |
| 提示词专家库 | `06-提示词库/` | 27个专业专家配置 |
| 快速配置清单 | `02-快速配置/AI编程IDE快速配置清单.md` | 5分钟快速上手指南 |
| 完整操作指南 | `01-完整指南/00-AI编程IDE零基础小白操作指南.md` | 详细操作说明 |

## 最佳实践

### 1. 版本选择原则

- **新项目**：从v1开始，根据需求升级
- **现有项目**：评估后选择匹配的版本
- **团队项目**：统一使用同一版本

### 2. 多IDE协作

- 将system prompt内容同步到各IDE配置
- Trae：智能体配置
- Cursor：.cursorrules文件
- 其他IDE：项目文档或Prompt模板

### 3. 持续优化

- 根据项目实际情况调整system prompt
- 收集团队反馈，优化规范
- 定期更新技术栈版本

## 相关链接

- **6A执行规则**：[04-规则配置/项目规则/6A执行规则.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/04-%E8%A7%84%E5%88%99%E9%85%8D%E7%BD%AE/%E9%A1%B9%E7%9B%AE%E8%A7%84%E5%88%99/6A%E6%89%A7%E8%A1%8C%E8%A7%84%E5%88%99.md)
- **个人规则配置**：[04-规则配置/通用配置/个人规则.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/04-%E8%A7%84%E5%88%99%E9%85%8D%E7%BD%AE/%E9%80%9A%E7%94%A8%E9%85%8D%E7%BD%AE/%E4%B8%AA%E4%BA%BA%E8%A7%84%E5%88%99.md)
- **快速配置清单**：[02-快速配置/AI编程IDE快速配置清单.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/02-%E5%BF%AB%E9%80%9F%E9%85%8D%E7%BD%AE/AI%E7%BC%96%E7%A8%8BIDE%E5%BF%AB%E9%80%9F%E9%85%8D%E7%BD%AE%E6%B8%85%E5%8D%95.md)
- **完整操作指南**：[01-完整指南/00-AI编程IDE零基础小白操作指南.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/01-%E5%AE%8C%E6%95%B4%E6%8C%87%E5%8D%97/00-AI%E7%BC%96%E7%A8%8BIDE%E9%9B%B6%E5%9F%BA%E7%A1%80%E5%B0%8F%E7%99%BD%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97.md)
- **项目架构文档**：[CLAUDE.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/CLAUDE.md)

---

**文档版本**: v2.0.0  
**最后更新**: 2026-01-29  
**维护人**: yuhang

> 💡 **提示**: 本模块支持Trae、Cursor、Windsurf、GitHub Copilot等主流AI编程IDE，不同IDE的配置方式略有差异，请根据实际使用的IDE选择合适的使用方式。
