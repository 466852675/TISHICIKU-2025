# 02-快速配置

## 模块定位

本模块提供"5分钟快速跑通"的操作清单，用于快速完成规则、MCP与智能体的基础配置。支持Trae、Cursor、Windsurf、GitHub Copilot等主流AI编程IDE。

## 关键文件

- **快速配置清单**：[AI编程IDE快速配置清单.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/02-%E5%BF%AB%E9%80%9F%E9%85%8D%E7%BD%AE/AI%E7%BC%96%E7%A8%8BIDE%E5%BF%AB%E9%80%9F%E9%85%8D%E7%BD%AE%E6%B8%85%E5%8D%95.md)
  - 5步快速配置流程（安装验证→个人规则→项目规则→MCP配置→智能体/Prompt）
  - 多IDE适配方案（Trae/Cursor/其他IDE）
  - 3个常用专家配置（国网APP设计专家、需求分析专家、数据看板专家）
  - 常见问题速查

## 配置流程概览

| 步骤 | 内容 | 耗时 | 适用IDE |
|------|------|------|---------|
| 第一步 | 安装验证 | 1分钟 | 全平台 |
| 第二步 | 个人规则配置 | 1分钟 | 全平台 |
| 第三步 | 项目规则配置 | 1分钟 | 全平台 |
| 第四步 | MCP配置 | 2分钟 | Trae（其他IDE见替代方案） |
| 第五步 | 智能体/Prompt创建 | 1分钟 | 全平台 |

## 各IDE支持情况

| IDE | 个人规则 | 项目规则 | MCP | 智能体 | 推荐指数 |
|-----|---------|---------|-----|--------|---------|
| **Trae** | ✅ user_rules.md | ✅ project_rules.md | ✅ 完整支持 | ✅ 智能体 | ⭐⭐⭐⭐⭐ |
| **Cursor** | ✅ Settings/.cursorrules | ✅ .cursorrules | ⚠️ 替代方案 | ⚠️ Prompt | ⭐⭐⭐⭐ |
| **Windsurf** | ⚠️ 有限支持 | ⚠️ 有限支持 | ❌ 不支持 | ⚠️ 有限支持 | ⭐⭐⭐ |
| **GitHub Copilot** | ⚠️ VS Code设置 | ⚠️ 项目设置 | ❌ 不支持 | ❌ 不支持 | ⭐⭐⭐ |

## 快速开始

### Trae用户（推荐）

1. 安装Trae IDE：https://www.trae.cn/
2. 打开 `AI编程IDE快速配置清单.md`
3. 按照5步流程完成配置
4. 创建3个常用智能体开始使用

### Cursor用户

1. 安装Cursor：https://cursor.com/
2. 使用 `.cursorrules` 文件配置规则
3. 通过Prompt实现智能体功能
4. 参考清单中的Cursor适配方案

### 其他IDE用户

1. 安装对应IDE
2. 参考清单中的通用配置方法
3. 使用 `06-提示词库/` 中的专家配置

## 相关链接

- **完整操作指南**：[00-AI编程IDE零基础小白操作指南.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/01-%E5%AE%8C%E6%95%B4%E6%8C%87%E5%8D%97/00-AI%E7%BC%96%E7%A8%8BIDE%E9%9B%B6%E5%9F%BA%E7%A1%80%E5%B0%8F%E7%99%BD%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97.md)
- **业务设计脚本**：[01-AI编程IDE辅助业务设计具体执行脚本.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/01-%E5%AE%8C%E6%95%B4%E6%8C%87%E5%8D%97/01-AI%E7%BC%96%E7%A8%8BIDE%E8%BE%85%E5%8A%A9%E4%B8%9A%E5%8A%A1%E8%AE%BE%E8%AE%A1%E5%85%B7%E4%BD%93%E6%89%A7%E8%A1%8C%E8%84%9A%E6%9C%AC.md)
- **MCP配置入口**：[通用mcp配置.json](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/05-%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE/MCP%E6%9C%8D%E5%8A%A1/%E9%80%9A%E7%94%A8mcp%E9%85%8D%E7%BD%AE.json)
- **提示词专家库**：[06-提示词库/README.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/06-%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%BA%93/README.md)
- **工具安装包**：[00-工具安装包/安装网址.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/00-%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85%E5%8C%85/%E5%AE%89%E8%A3%85%E7%BD%91%E5%9D%80.md)
- **项目架构文档**：[CLAUDE.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/CLAUDE.md)
