# AI编程IDE快速配置清单

> 📋 **5分钟快速上手指南** - 适合已有经验的同事快速配置
> 
> 📅 **最后更新**: 2026-02-01 | 本清单覆盖16+主流AI编程工具

---

## 🚀 第一步：选择并安装IDE（1分钟）

### 主流AI编程IDE分类

#### 1️⃣ 原生AI IDE（推荐）

专为AI辅助编程设计的IDE，功能最完整。

| IDE | 厂商 | 官网 | 本套件兼容 | 推荐场景 |
|-----|------|------|-----------|---------|
| **Trae** | 字节跳动 | [trae.cn](https://www.trae.cn/) | ⭐⭐⭐⭐⭐ 完全兼容 | 国内用户首选 |
| **Cursor** | Anysphere | [cursor.com](https://cursor.com/) | ⭐⭐⭐⭐ 高度兼容 | 专业开发者 |
| **Windsurf** | Codeium | [codeium.com/windsurf](https://codeium.com/windsurf) | ⭐⭐⭐ 部分兼容 | VS Code用户迁移 |

#### 2️⃣ AI插件/扩展

在传统IDE中增加AI功能。

| IDE/插件 | 厂商 | 官网 | 本套件兼容 | 推荐场景 |
|----------|------|------|-----------|---------|
| **GitHub Copilot** | GitHub | [copilot](https://github.com/copilot) | ⭐⭐ 需配置 | GitHub生态用户 |
| **CodeGeeX** | 智谱AI | [codegeex.cn](https://codegeex.cn/) | ⭐⭐ 需配置 | 国内IDEA用户 |
| **JetBrains AI** | JetBrains | [jetbrains.com/ai](https://www.jetbrains.com/ai/) | ⭐⭐ 需配置 | JetBrains用户 |

#### 3️⃣ 更多选择

完整工具清单参见 [00-工具安装包/安装网址.md](../00-工具安装包/安装网址.md)

### 检查基础环境

```bash
# 检查Node.js是否安装（必需）
node --version  # 需要 >= 18 (LTS)

# 检查Python（推荐）
python --version  # 建议 >= 3.10

# 检查Git（必需）
git --version

# 如果未安装，访问 00-工具安装包/安装网址.md 获取下载链接
```

---

## ⚙️ 第二步：个人规则配置（1分钟）

### Trae用户

**路径**：AI对话框 → 右上角设置 → 规则 → 个人规则 → 创建 user_rules.md

**复制以下内容**：
```markdown
# 个人规则
- 所有回复使用中文
- 保持一致的编码风格
- 为代码添加中文注释
- 复杂任务先拆分再执行
- 完成任务后说"写好了"
```

### Cursor用户

**路径**：Settings → General → AI Rules

**或在项目根目录创建 `.cursorrules` 文件**：
```markdown
# Cursor 个人规则
- 所有回复使用中文
- 代码添加中文注释
- 优先使用现代JavaScript/TypeScript语法
- 遵循React最佳实践
```

### 其他IDE用户

在IDE设置中找到AI/智能助手配置，添加：
```
- 使用中文回复
- 代码添加中文注释
- 复杂任务先拆分
```

---

## 📁 第三步：项目规则配置（1分钟）

### Trae用户

**路径**：AI对话框 → 右上角设置 → 规则 → 项目规则 → 创建 project_rules.md

**复制以下内容**：
```markdown
# 项目规则
## 6A原则
1.准确 2.分析 3.可执行 4.适应 5.负责 6.敏捷

## 代码规范
- 中文注释
- 小写文件名+下划线
- 驼峰变量名
- 注释密度30%+
```

### Cursor用户

**在项目根目录创建 `.cursorrules` 文件**：
```markdown
# 项目规则
## 6A原则
1.准确 2.分析 3.可执行 4.适应 5.负责 6.敏捷

## 技术栈
- React + TypeScript
- Tailwind CSS
- Node.js

## 代码规范
- 中文注释
- 小写文件名+下划线
- 驼峰变量名
```

### 其他IDE用户（CodeGeeX、JetBrains AI等）

参考上述规则，在IDE的AI助手设置中配置系统提示词。

---

## 🔧 第四步：MCP配置（2分钟，仅Trae用户）

> ⚠️ **重要说明**: MCP服务目前仅Trae原生完整支持，其他IDE需使用替代方案

### Trae用户（原生支持）

**路径**：AI对话框 → 右上角设置 → MCP → 添加

**推荐服务**：
- ✅ sequential-thinking（顺序思考工具）
- ✅ memory（知识图谱记忆）  
- ✅ context7（技术文档搜索）
- ✅ playwright（浏览器自动化）

**验证**：在AI对话框输入 `@Builder with MCP 请检查服务状态`

### Cursor用户（需手动配置）

Cursor支持MCP但需手动配置：

1. **打开设置**: `Settings` → `Cursor Settings` → `MCP`
2. **添加服务**: 复制 `05-服务配置/MCP服务/通用mcp配置.json` 中的配置
3. **重启Cursor**: 使配置生效

> ⚠️ 注意：Cursor的MCP支持不如Trae完整，部分Skill可能无法使用

### 其他IDE用户（Copilot、CodeGeeX等）

这些IDE暂不支持MCP，替代方案：
- **Terminal命令**: 直接运行MCP服务命令行工具
- **脚本调用**: 使用Python/Node脚本调用Skill功能
- **外部工具**: 结合其他工具实现类似功能

**示例**（使用Python调用docx Skill）：
```python
# 直接调用python-docx库生成文档
from docx import Document
doc = Document()
doc.add_heading('标题', 0)
doc.save('output.docx')
```

---

## 🎯 第五步：创建智能体/Prompt（1分钟）

### Trae用户（创建智能体）

**路径**：AI对话框 → 左下角智能体 → 创建智能体

**快速创建3个常用智能体**：

#### 1. 国网APP设计专家
```markdown
专注于国家电网标准风格的移动端界面设计，使用HTML+Tailwind+FontAwesome，主色#009D85，适配iPhone 15 Pro。
```

#### 2. 需求分析专家  
```markdown
擅长将模糊需求转化为标准需求文档，生成需求A单和PRD，确保需求清晰可执行。
```

#### 3. 数据看板专家
```markdown
设计数据可视化看板，支持柱状图、饼图、折线图，响应式设计，暗色主题。
```

### Cursor用户（使用 .cursorrules 或 Prompt）

**方式1：项目级专家（推荐）**

在项目根目录创建 `.cursorrules` 文件：
```markdown
# 国网APP设计专家规则
你是一个专注于国家电网标准风格的移动端界面设计专家。

## 核心能力
- 使用HTML+Tailwind+FontAwesome
- 主色#009D85
- 适配iPhone 15 Pro

## 输出要求
- 生成完整HTML代码
- 包含详细中文注释
```

**方式2：对话级专家**

在AI聊天中先发送：
```
你现在是"国网APP设计专家"，请按照以下规则回复：
[粘贴专家提示词内容]
```

### 其他IDE用户

使用 `06-提示词库/` 中的专家配置，在对话开始时发送系统Prompt。

---

## ✅ 验证配置（30秒）

### Trae用户

在AI对话框中输入：
```
@Builder 请确认我的配置是否正常工作
```

### Cursor用户

在AI聊天中输入：
```
请介绍一下你自己，并说明你遵循什么规则
```

### 其他IDE用户

在AI对话框中输入类似指令，验证规则是否生效。

**如果AI能正常回复并提到已配置的工具/规则，说明配置成功！**

---

## 🎓 开始使用

### 推荐第一个项目

1. **选择专家**：
   - Trae：选择"国网APP设计专家"智能体
   - Cursor：确保 `.cursorrules` 已配置
   - 其他IDE：先发送专家Prompt

2. **输入需求**：
```
设计一个电费缴纳APP，包含账单查询、在线缴费、历史记录功能
```

3. **获取代码**：获取HTML代码，直接在浏览器运行

---

## 🆘 常见问题

### MCP服务无法添加？（Trae用户）

```bash
# 检查Node.js版本
node --version

# 重新安装MCP服务
npm install -g @modelcontextprotocol/server-sequential-thinking
```

### 智能体/Prompt没反应？

- 确认已选择正确的智能体/Prompt
- 重启IDE
- 检查网络连接

### 规则不生效？

- 检查文件是否保存（Ctrl+S）
- 重新打开AI对话框
- 确认文件路径正确：
  - Trae：`.trae/rules/project_rules.md`
  - Cursor：`.cursorrules`

### Cursor如何实现Trae的智能体功能？

- 使用 `.cursorrules` 文件定义项目级AI行为
- 在对话开始时发送系统Prompt
- 保存常用Prompt为代码片段

---

## 📚 完整指南

如需更详细的说明，请查看：
- [00-AI编程IDE零基础小白操作指南.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/01-%E5%AE%8C%E6%95%B4%E6%8C%87%E5%8D%97/00-AI%E7%BC%96%E7%A8%8BIDE%E9%9B%B6%E5%9F%BA%E7%A1%80%E5%B0%8F%E7%99%BD%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97.md)
- [01-AI编程IDE辅助业务设计具体执行脚本.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/01-%E5%AE%8C%E6%95%B4%E6%8C%87%E5%8D%97/01-AI%E7%BC%96%E7%A8%8BIDE%E8%BE%85%E5%8A%A9%E4%B8%9A%E5%8A%A1%E8%AE%BE%E8%AE%A1%E5%85%B7%E4%BD%93%E6%89%A7%E8%A1%8C%E8%84%9A%E6%9C%AC.md)

---

## 🛠️ 工具安装参考

如需安装IDE或基础环境，请查看：
[00-工具安装包/安装网址.md](file:///c:/Users/hangy/Desktop/AI%E6%99%BA%E8%83%BD%E4%BD%93%E9%85%8D%E7%BD%AE%E6%A8%A1%E6%9D%BF%E5%A5%97%E4%BB%B6/00-%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85%E5%8C%85/%E5%AE%89%E8%A3%85%E7%BD%91%E5%9D%80.md)

---

**文档版本**: v2.0.0  
**最后更新**: 2026-01-29  
**维护人**: yuhang

> 💡 **提示**: 本清单支持Trae、Cursor、Windsurf、GitHub Copilot等主流AI编程IDE，部分功能因IDE特性有所差异。
