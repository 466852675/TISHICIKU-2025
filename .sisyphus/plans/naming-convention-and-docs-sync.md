# AI智能体配置模板套件 - 项目规范文档 v1.0

> 📋 **本文档定义了项目的文件命名规范、文档同步机制、自动化检查方案和Git工作流标准**
> 
> **适用范围**: 所有贡献者和维护者 | **最后更新**: 2026-02-01

---

## 📑 目录

1. [文件命名规范](#1-文件命名规范)
2. [文档同步机制](#2-文档同步机制)
3. [自动化检查方案](#3-自动化检查方案)
4. [Git工作流规范](#4-git工作流规范)
5. [工作量估算](#5-工作量估算)

---

## 1. 文件命名规范

### 1.1 基本原则

| 原则 | 说明 | 优先级 |
|------|------|--------|
| **一致性** | 同类型文件使用统一命名风格 | ⭐⭐⭐⭐⭐ |
| **可读性** | 文件名应清晰表达内容 | ⭐⭐⭐⭐⭐ |
| **简洁性** | 避免过长文件名（建议≤50字符） | ⭐⭐⭐⭐ |
| **兼容性** | 支持跨平台（Windows/Mac/Linux） | ⭐⭐⭐⭐⭐ |

### 1.2 字符集规范

#### 允许使用的字符
```
✅ 中文字符（推荐）
✅ 英文字母（a-z, A-Z）
✅ 数字（0-9）
✅ 连字符（-）用于分隔
✅ 下划线（_）仅用于特定场景
✅ 方括号【】用于标记分类
```

#### 禁止使用的字符
```
❌ 空格（使用连字符-代替）
❌ 斜杠（/ \）
❌ 冒号（:）
❌ 星号（*）
❌ 问号（?）
❌ 引号（" '）
❌ 尖括号（<>）
❌ 管道符（|）
❌ 句点（.）除扩展名前最后一个
```

### 1.3 序号格式规范

#### 目录序号（强制）
**格式**: `NN-中文描述/`
**示例**:
```
01-完整指南/
02-快速配置/
03-框架搭建/
06-提示词库/
07-Skill库/
08-实战案例/
```

**规则**:
- 使用两位数字（01-99）
- 数字后紧跟连字符 `-`
- 使用中文描述
- 末尾加 `/` 表示目录

#### 案例序号（强制）
**格式**: `案例NN-中文描述.md`
**示例**:
```
案例01-电费缴纳APP界面设计.md
案例02-电力巡检管理系统需求文档.md
案例03-销售数据可视化看板.md
案例04-企业数字化转型汇报PPT.md
```

**规则**:
- 使用两位数字（01-99）
- 数字前加"案例"前缀
- 连字符 `-` 分隔
- **注意**: 需要将现有的"案例一、案例二"改为"案例01、案例02"

#### 其他文件序号（可选）
当需要排序时:
```
00-前言.md
01-准备工作.md
02-安装步骤.md
```

### 1.4 英文缩写大小写规范

#### 必须大写的缩写
| 缩写 | 全称 | 示例 |
|------|------|------|
| **PPT** | PowerPoint | `PPT生成专家.md` |
| **PRD** | Product Requirements Document | `PRD生成专家.md` |
| **UI** | User Interface | `UI规范专家.md` |
| **UX** | User Experience | `UI-UX设计.md` |
| **APP** | Application | `APP端/` |
| **PC** | Personal Computer | `PC端/` |
| **API** | Application Programming Interface | `API文档.md` |
| **IDE** | Integrated Development Environment | `IDE配置.md` |

#### 必须小写的技术术语
| 术语 | 示例 |
|------|------|
| **docx** | `docx技能配置.md` |
| **pptx** | `pptx技能配置.md` |
| **pdf** | `pdf技能配置.md` |
| **xlsx** | `xlsx技能配置.md` |
| **json** | `json配置文件.md` |
| **yaml** | `yaml配置文件.md` |

#### 可大小写混用的（视上下文）
```
README.md （全部大写，传统）
CLAUDE.md （全部大写，传统）
```

### 1.5 特殊标记规范

#### 【】方括号使用场景
**用途**: 标记子分类或特殊属性
**适用**: 主要用于PPT设计专家分类
**示例**:
```
06-PPT设计/
├── 【墨蓝】现代科技蓝图风专家.md
├── 【工业蓝】数字蓝图与工业感风专家.md
├── 【炭黑】精密工业文档流风专家.md
├── 【午夜蓝】数字孪生蓝图风专家.md
├── 【海蓝】工业蓝图与数字孪生风专家.md
├── 【深邃工业蓝】现代工业蓝图风专家.md
├── 【冷灰白】精益蓝图与战略手稿风专家.md
├── 【浅米灰】现代工业手绘与数字蓝图风专家.md
└── 【象牙白】智联蓝图手绘工业草图风专家.md
```

**规则**:
- 方括号内使用颜色/风格关键词
- 紧跟方括号后不加空格
- 方括号后接完整描述

### 1.6 各模块具体规范

#### 06-提示词库 命名规范

**专家文件命名**:
```
【颜色】风格描述专家.md  ← PPT设计专家
功能描述专家.md          ← 其他专家
```

**示例**（规范化后）:
```
01-需求分析/
├── 需求生成专家.md
├── 可研生成专家.md
└── PRD生成专家.md

02-原型设计/
├── PC端/
│   ├── 看板风格专家.md
│   ├── 系统风格专家.md
│   └── 简约风格专家.md
├── APP端/
│   ├── 国网风专家.md
│   ├── 弥散风专家.md
│   └── 苹果风专家.md
└── UI规范专家.md

03-测试验证/
├── 功能测试专家.md
├── 自动化测试专家.md
└── 文档质量校验专家.md

04-通用专家/
├── PPT生成专家.md
├── 周报生成专家.md
├── 提示词生成专家.md
└── 网页生成专家.md

05-图表设计/
└── draw-io图表生成专家.md  ← 将draw.io改为draw-io

06-PPT设计/
├── 【墨蓝】现代科技蓝图风专家.md
├── 【工业蓝】数字蓝图与工业感风专家.md
├── 【炭黑】精密工业文档流风专家.md
├── 【午夜蓝】数字孪生蓝图风专家.md
├── 【海蓝】工业蓝图与数字孪生风专家.md
├── 【深邃工业蓝】现代工业蓝图风专家.md
├── 【冷灰白】精益蓝图与战略手稿风专家.md
├── 【浅米灰】现代工业手绘与数字蓝图风专家.md
└── 【象牙白】智联蓝图手绘工业草图风专家.md
```

**变更记录**:
| 原文件名 | 新文件名 | 变更原因 |
|---------|---------|---------|
| `draw.io图表生成专家.md` | `draw-io图表生成专家.md` | 移除句点特殊字符 |

#### 08-实战案例 命名规范

**案例文件命名**:
```
案例NN-中文描述.md
```

**示例**（规范化后）:
```
01-基础案例/
├── 案例01-电费缴纳APP界面设计.md       ← 原"案例一"
├── 案例02-电力巡检管理系统需求文档.md   ← 原"案例二"
└── 案例03-销售数据可视化看板.md         ← 原"案例三"

02-进阶案例/
├── 案例04-企业数字化转型汇报PPT.md     ← 原"案例四"
├── 案例05-全栈应用测试验证.md           ← 原"案例五"
├── 案例06-项目文档自动化工作流.md       ← 原"案例六"
└── 案例07-电商小程序UI-UX设计.md       ← 原"案例七-电商小程序UIUX设计.md"（添加连字符）

03-高级案例/
├── 案例08-多代理协作开发系统.md         ← 原"案例八"
├── 案例09-智能图表与架构可视化.md       ← 原"案例九"
└── 案例10-项目复盘与效能评估.md         ← 原"案例十"
```

### 1.7 文件命名检查清单

新建或修改文件前，检查以下事项:

```markdown
- [ ] 文件名长度 ≤ 50个字符
- [ ] 未使用禁止字符（空格、斜杠、冒号等）
- [ ] 使用正确的序号格式（NN- 或 案例NN-）
- [ ] 英文缩写使用正确的大小写
- [ ] 特殊字符仅使用连字符-、下划线_和【】
- [ ] 文件扩展名为.md（文档）或.json（配置）
- [ ] 同目录下无重名文件
```

---

## 2. 文档同步机制

### 2.1 同步目标

确保以下文档内容一致:
| 源文档 | 同步目标 | 同步频率 |
|--------|---------|---------|
| 根目录 README.md | 各模块 README.md | 每次版本更新 |
| 根目录 CLAUDE.md | 各模块 CLAUDE.md | 每次架构变更 |
| 统计数据 | 所有引用位置 | 每次增删专家/Skill |

### 2.2 关键数据同步规则

#### 专家数量统计同步

**单一数据源原则**:
- 根目录 README.md 为权威数据源
- 其他文档必须从根目录README同步数据

**专家分布标准格式**:
```markdown
| 领域 | 专家数量 | 适用场景 | 专家列表 |
|------|---------|---------|---------|
| **需求分析** | 3个 | 需求收集、可研报告、PRD制作 | 需求生成专家、可研生成专家、PRD生成专家 |
| **原型设计** | 7个 | PC端/APP端UI设计、UI规范分析 | 看板风格专家、系统风格专家、简约风格专家、国网风专家、弥散风专家、苹果风专家、UI规范专家 |
| **测试验证** | 3个 | 功能测试、自动化测试、文档校验 | 功能测试专家、自动化测试专家、文档质量校验专家 |
| **通用任务** | 4个 | PPT制作、周报、提示词优化、网页生成 | PPT生成专家、周报生成专家、提示词生成专家、网页生成专家 |
| **图表设计** | 1个 | 智能图表自动生成 | draw.io图表生成专家 |
| **PPT设计** | 9个 | 高端商务PPT设计 | 墨蓝、工业蓝、炭黑、午夜蓝、海蓝、深邃工业蓝、冷灰白、浅米灰、象牙白专家 |
| **总计** | **27个** | - | - |
```

**同步检查项**:
- [ ] 06-提示词库/README.md 的标题行是否显示"27个专家"
- [ ] 06-提示词库/CLAUDE.md 的子模块表格是否包含06-PPT设计
- [ ] 08-实战案例/README.md 是否引用正确的专家数量
- [ ] 根目录 README.md 和 CLAUDE.md 是否一致

#### Skill数量统计同步

**标准格式**:
```markdown
| 分类 | Skill数量 | 核心功能 | 代表Skill |
|------|----------|---------|----------|
| **文档处理** | 4个 | Word/PPT/PDF/Excel生成处理 | docx, pptx, pdf, xlsx |
| **设计工具** | 7个 | UI/UX设计、视觉设计、算法艺术 | ui-ux-pro-max, canvas-design, frontend-design |
| **开发工作流** | 8个 | 项目规划、代码开发、Git工作流 | planning-with-files, executing-plans, using-git-worktrees |
| **代码质量** | 6个 | TDD、调试、代码审查、测试 | test-driven-development, systematic-debugging, webapp-testing |
| **上下文工程** | 5个 | 上下文管理、优化、压缩 | context-fundamentals, context-optimization, context-compression |
| **代理系统** | 5个 | 多代理模式、记忆系统、BDI模型 | multi-agent-patterns, memory-systems, bdi-mental-states |
| **评估与优化** | 3个 | 性能评估、LLM评判、验证 | evaluation, advanced-evaluation, verification-before-completion |
| **工具与集成** | 4个 | MCP构建、NotebookLM、Web工件 | mcp-builder, notebooklm, web-artifacts-builder |
| **内容创作** | 3个 | 文档共创、内部沟通、头脑风暴 | doc-coauthoring, internal-comms, brainstorming |
| **Skill开发** | 3个 | Skill创建、编写、自动触发 | skill-creator, writing-skills, auto-trigger-rules |
| **超级能力** | 1个 | Skill系统入口 | using-superpowers |
| **总计** | **47个** | 10大类别 | - |
```

#### 版本号同步

**版本号格式**: `v主版本.次版本.修订版本`
- 示例: `v3.0.0`, `v3.1.0`, `v3.0.1`

**同步规则**:
```markdown
1. 根目录 README.md 的版本号为权威版本
2. 所有模块README和CLAUDE.md必须保持相同版本号
3. 版本更新时，必须同时更新所有文档的版本号
4. 最后更新日期必须同步修改
```

### 2.3 文档同步触发条件

| 触发条件 | 需要同步的文档 | 同步优先级 |
|---------|--------------|-----------|
| 新增/删除专家 | 根目录README、06-提示词库/README、06-提示词库/CLAUDE、08-实战案例/README | ⭐⭐⭐⭐⭐ |
| 新增/删除Skill | 根目录README、根目录CLAUDE、07-Skill库/README、08-实战案例/README | ⭐⭐⭐⭐⭐ |
| 新增/删除案例 | 根目录README、08-实战案例/README | ⭐⭐⭐⭐ |
| 版本号升级 | 所有README和CLAUDE.md | ⭐⭐⭐⭐⭐ |
| 架构变更 | 根目录CLAUDE、各模块CLAUDE | ⭐⭐⭐⭐ |

### 2.4 同步执行流程

```
变更发生
    ↓
修改源文档（根目录README.md）
    ↓
识别受影响的相关文档
    ↓
批量更新相关文档中的统计数据
    ↓
验证所有文档一致性
    ↓
提交变更（使用docs: 前缀的commit）
```

### 2.5 交叉引用维护清单

需要保持一致的引用关系:

```markdown
### 06-提示词库/README.md 引用检查
- [ ] 第X行: "27个专家" 数量正确
- [ ] 子模块表格: 包含06-PPT设计（9个专家）
- [ ] 专家链接: 所有相对路径正确
- [ ] 版本号: 与根目录README一致

### 06-提示词库/CLAUDE.md 引用检查
- [ ] 第33-39行: 子模块表格包含6个分类（含PPT设计）
- [ ] 文件路径引用: 使用相对路径而非绝对路径
- [ ] 专家列表: 完整列出所有27个专家

### 08-实战案例/README.md 引用检查
- [ ] 专家覆盖矩阵: 显示27个专家100%覆盖
- [ ] Skill覆盖矩阵: 显示47个Skill覆盖
- [ ] 案例引用: 文件路径使用新的命名规范

### 根目录 README.md 引用检查
- [ ] 文件结构图: 目录和文件名使用新规范
- [ ] 专家分类表: 完整27个专家
- [ ] Skill分类表: 完整47个Skill
- [ ] 版本号: 最新版本

### 根目录 CLAUDE.md 引用检查
- [ ] 项目统计表: 专家27个、Skill47个
- [ ] 文件结构示例: 使用新命名规范
- [ ] 版本演进表: 显示v3.0更新内容
```

---

## 3. 自动化检查方案

### 3.1 检查脚本功能需求

#### 脚本1: 文件命名规范检查器 (check-naming.sh)

**功能需求**:
```bash
#!/bin/bash
# check-naming.sh - 检查文件命名是否符合规范

功能:
1. 扫描指定目录下所有.md和.json文件
2. 检查是否包含禁止字符（空格、斜杠、冒号等）
3. 检查文件名长度是否超过50字符
4. 检查序号格式是否符合规范（01- 或 案例NN-）
5. 检查英文缩写大小写是否符合规范
6. 输出违规文件列表及违规原因
7. 返回退出码: 0=通过, 1=有违规

输入参数:
- --dir: 要检查的目录（默认为当前目录）
- --fix: 尝试自动修复（重命名文件）
- --report: 输出详细报告到文件
- --strict: 严格模式（警告也视为错误）

输出示例:
[ERROR] "案例一-电费缴纳APP界面设计.md": 序号应使用数字格式"案例01"
[ERROR] "draw.io图表生成专家.md": 包含禁止字符"."
[WARNING] "UIUX设计.md": 建议改为"UI-UX设计.md"
[OK] "PPT生成专家.md": 命名规范正确

统计:
- 检查文件数: 150
- 通过: 145
- 违规: 3
- 警告: 2
```

#### 脚本2: 文档计数验证器 (check-counts.sh)

**功能需求**:
```bash
#!/bin/bash
# check-counts.sh - 验证文档中的统计数据是否与实际文件数一致

功能:
1. 统计06-提示词库/各目录下的实际.md文件数量
2. 读取06-提示词库/README.md中声明的专家数量
3. 对比实际数量 vs 声明数量
4. 统计07-Skill库/skills/目录下的实际Skill数量
5. 对比根目录README.md中声明的Skill数量
6. 检查08-实战案例/各目录下的实际案例数量
7. 输出差异报告

验证项:
- 06-提示词库/01-需求分析: 实际3个 vs 声明3个
- 06-提示词库/02-原型设计: 实际7个 vs 声明7个
- 06-提示词库/03-测试验证: 实际3个 vs 声明3个
- 06-提示词库/04-通用专家: 实际4个 vs 声明4个
- 06-提示词库/05-图表设计: 实际1个 vs 声明1个
- 06-提示词库/06-PPT设计: 实际9个 vs 声明9个（关键检查）
- 07-Skill库/skills/: 实际47个 vs 声明47个
- 08-实战案例/01-基础案例: 实际3个 vs 声明3个
- 08-实战案例/02-进阶案例: 实际4个 vs 声明4个
- 08-实战案例/03-高级案例: 实际3个 vs 声明3个

输出示例:
[INFO] 06-提示词库/01-需求分析: ✓ 3个专家（匹配）
[INFO] 06-提示词库/02-原型设计: ✓ 7个专家（匹配）
[ERROR] 06-提示词库/README.md 第3行: 声明"共18个专家"，实际27个（缺少06-PPT设计的9个）
[ERROR] 06-提示词库/CLAUDE.md: 子模块表格未包含06-PPT设计
[INFO] 07-Skill库: ✓ 47个Skill（匹配）
[WARNING] 08-实战案例/README.md: 案例七文件名引用为"UIUX"，实际应为"UI-UX"

统计:
- 检查项目: 10
- 通过: 7
- 错误: 2
- 警告: 1
```

#### 脚本3: 链接有效性检查器 (check-links.sh)

**功能需求**:
```bash
#!/bin/bash
# check-links.sh - 检查文档中的文件引用和链接是否有效

功能:
1. 扫描所有.md文件中的链接和引用
2. 识别相对路径引用（如 [专家](./01-需求分析/专家.md)）
3. 识别绝对路径引用（如 file:///c:/...）
4. 验证被引用的文件是否真实存在
5. 检查引用路径是否使用了旧文件名（重命名后失效）
6. 输出失效链接列表

支持的链接格式:
- Markdown链接: [文本](路径)
- 图片链接: ![alt](路径)
- 自动链接: <路径>
- HTML链接: <a href="路径">
- 引用文件: @文件名.md

输出示例:
[ERROR] 06-提示词库/README.md:28 - 链接失效: "./01-需求分析/需求生成专家.md"（文件存在但路径大小写不匹配）
[ERROR] 06-提示词库/CLAUDE.md:45 - 链接失效: "file:///c:/Users/.../专家.md"（使用绝对路径，应改为相对路径）
[WARNING] 根目录README.md:266 - 引用 "案例一" 应更新为 "案例01"
[INFO] 检查链接数: 200
[INFO] 有效链接: 195
[INFO] 失效链接: 3
[INFO] 警告: 2
```

#### 脚本4: 内容完整性检查器 (check-content.sh)

**功能需求**:
```bash
#!/bin/bash
# check-content.sh - 检查文档内容的完整性和规范性

功能:
1. 检查所有.md文件是否为空或少于10行
2. 检查README.md是否包含必要的章节（快速开始、目录结构等）
3. 检查CLAUDE.md是否包含模块说明和统计信息
4. 检查文档是否包含版本号和最后更新日期
5. 检查文档编码是否为UTF-8
6. 检查文档是否使用Windows换行符（CRLF）
7. 检查文档中是否存在TODO标记（未完成的任务）

检查规则:
- 空文件: 文件大小 < 100字节
- 内容过少: 行数 < 10行
- 缺少版本号: 未找到 "v数字.数字.数字" 模式
- 缺少更新日期: 未找到 "最后更新" 或 "更新日期"
- 编码错误: 包含非UTF-8字符
- 换行符混合: 同时包含CRLF和LF

输出示例:
[ERROR] 06-提示词库/专家.md: 文件为空（0字节）
[WARNING] 04-规则配置/README.md: 只有8行，建议至少包含基本说明
[ERROR] 05-服务配置/README.md: 缺少版本号声明
[INFO] 02-快速配置/README.md: 缺少"最后更新"日期
[WARNING] 03-框架搭建/v1-system-prompt.md: 发现TODO标记（3处）

统计:
- 检查文档: 50
- 通过: 45
- 错误: 3
- 警告: 2
```

#### 脚本5: 版本一致性检查器 (check-versions.sh)

**功能需求**:
```bash
#!/bin/bash
# check-versions.sh - 检查所有文档的版本号是否一致

功能:
1. 从根目录README.md提取权威版本号
2. 检查各模块README.md的版本号是否与权威版本一致
3. 检查各模块CLAUDE.md的版本号是否与权威版本一致
4. 检查"最后更新"日期是否一致（允许1天内差异）
5. 输出版本不一致的文档列表

版本号提取规则:
- 搜索模式: "v[0-9]+\.[0-9]+\.[0-9]+"
- 优先位置: 文档标题附近或页脚
- 备用位置: "文档版本"、"版本"关键字附近

输出示例:
[INFO] 权威版本号: v3.0.0 (来自根目录README.md)
[INFO] 根目录CLAUDE.md: ✓ v3.0.0
[ERROR] 06-提示词库/README.md: v2.0.0（落后1个主版本）
[ERROR] 06-提示词库/CLAUDE.md: v2.0.0（落后1个主版本）
[INFO] 07-Skill库/README.md: ✓ v3.0.0
[INFO] 08-实战案例/README.md: ✓ v3.0
[WARNING] 日期不一致: 06-提示词库/README.md (2026-01-29) vs 权威 (2026-02-01)

建议操作:
1. 更新 06-提示词库/README.md 版本号至 v3.0.0
2. 更新 06-提示词库/CLAUDE.md 版本号至 v3.0.0
3. 同步更新所有文档的最后更新日期

统计:
- 检查文档: 9
- 版本一致: 6
- 版本落后: 2
- 日期不一致: 1
```

### 3.2 主控脚本 (run-all-checks.sh)

**功能需求**:
```bash
#!/bin/bash
# run-all-checks.sh - 运行所有检查脚本并生成综合报告

功能:
1. 顺序执行所有检查脚本
2. 汇总所有检查结果
3. 生成综合报告（Markdown格式）
4. 根据错误数量返回退出码

执行顺序:
1. check-naming.sh（文件命名）
2. check-counts.sh（计数验证）
3. check-links.sh（链接有效性）
4. check-content.sh（内容完整性）
5. check-versions.sh（版本一致性）

输出报告:
reports/
├── naming-report.md      # 命名规范检查报告
├── counts-report.md      # 计数验证报告
├── links-report.md       # 链接检查报告
├── content-report.md     # 内容完整性报告
├── versions-report.md    # 版本一致性报告
└── summary-report.md     # 综合汇总报告

综合报告包含:
- 执行时间
- 各检查项通过率
- 关键问题列表（按优先级排序）
- 修复建议
- 下次检查建议时间

退出码:
- 0: 所有检查通过
- 1: 有警告但无错误
- 2: 有错误需要修复
```

### 3.3 CI/CD集成方案

**GitHub Actions 工作流配置**:

```yaml
# .github/workflows/doc-check.yml
name: Documentation Quality Check

on:
  push:
    paths:
      - '**.md'
      - '**.json'
  pull_request:
    paths:
      - '**.md'
      - '**.json'
  schedule:
    # 每天凌晨2点自动运行
    - cron: '0 2 * * *'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Environment
        run: |
          sudo apt-get update
          sudo apt-get install -y dos2unix
      
      - name: Run Naming Check
        run: |
          ./scripts/check-naming.sh --dir . --report
        continue-on-error: true
      
      - name: Run Counts Check
        run: |
          ./scripts/check-counts.sh --report
        continue-on-error: true
      
      - name: Run Links Check
        run: |
          ./scripts/check-links.sh --report
        continue-on-error: true
      
      - name: Run Content Check
        run: |
          ./scripts/check-content.sh --report
        continue-on-error: true
      
      - name: Run Versions Check
        run: |
          ./scripts/check-versions.sh --report
        continue-on-error: true
      
      - name: Generate Summary
        run: |
          ./scripts/generate-summary.sh
      
      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: check-reports
          path: reports/
      
      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('reports/summary-report.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });
      
      - name: Fail on Errors
        run: |
          if grep -q "\[ERROR\]" reports/summary-report.md; then
            echo "❌ 发现错误，请修复后再提交"
            exit 1
          fi
```

### 3.4 检查脚本实施路线图

**第一阶段: 核心检查（高优先级）**
- [ ] 实现 check-counts.sh（解决专家数量不一致问题）
- [ ] 实现 check-versions.sh（解决版本号不一致问题）
- [ ] 集成到GitHub Actions
- **时间估算**: 2-3天

**第二阶段: 命名规范检查（中优先级）**
- [ ] 实现 check-naming.sh
- [ ] 定义完整的命名规则配置文件
- [ ] 提供自动修复选项
- **时间估算**: 2-3天

**第三阶段: 链接和内容检查（中优先级）**
- [ ] 实现 check-links.sh
- [ ] 实现 check-content.sh
- [ ] 实现 run-all-checks.sh 主控脚本
- **时间估算**: 2-3天

**第四阶段: 优化和自动化（低优先级）**
- [ ] 添加更多自定义检查规则
- [ ] 优化性能和报告格式
- [ ] 添加Slack/邮件通知
- **时间估算**: 2-3天

---

## 4. Git工作流规范

### 4.1 分支命名规范

#### 分支类型前缀

| 前缀 | 用途 | 示例 |
|------|------|------|
| `main` | 主分支，稳定版本 | - |
| `docs/` | 文档更新 | `docs/fix-expert-counts` |
| `feat/` | 新功能/新专家/新Skill | `feat/add-ppt-expert` |
| `fix/` | 修复错误 | `fix/naming-convention` |
| `refactor/` | 重构/重命名文件 | `refactor/unify-filenames` |
| `sync/` | 文档同步 | `sync/update-readmes` |
| `release/` | 版本发布准备 | `release/v3.1.0` |

#### 分支命名规则

```
格式: <前缀>/<简短描述>

规则:
1. 使用小写字母
2. 使用连字符-分隔单词
3. 描述应简洁（≤30字符）
4. 避免使用下划线_

✅ 正确示例:
- docs/update-expert-counts
- feat/add-3-new-skills
- fix/rename-draw-io-file
- refactor/unify-case-naming
- sync/version-3-0-1

❌ 错误示例:
- docs_UpdateCounts（使用下划线和大写）
- fix（缺少描述）
- feature-add-new-expert（前缀过长）
- FIX-NAMING（全部大写）
```

### 4.2 提交信息规范（Conventional Commits）

#### 提交类型

| 类型 | 用途 | 示例 |
|------|------|------|
| `docs:` | 仅文档变更 | `docs: fix expert count from 18 to 27` |
| `feat:` | 新功能/新内容 | `feat: add 3 new PPT design experts` |
| `fix:` | 修复错误 | `fix: correct broken links in README` |
| `refactor:` | 重构（不改变功能） | `refactor: unify file naming convention` |
| `style:` | 格式调整（非文档） | `style: format JSON files` |
| `chore:` | 杂项/维护 | `chore: update version numbers` |
| `sync:` | 文档同步 | `sync: update all README counts` |

#### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**规则**:
- `type`: 必须使用上述类型之一
- `scope`: 可选，如模块名称（06-prompts, 08-cases等）
- `subject`: 简短描述（≤50字符），使用祈使句（"修复"而非"已修复"）
- `body`: 详细描述（可选），解释"为什么"和"做了什么"
- `footer`: 关联Issue、破坏性变更说明等

#### 提交信息示例

```bash
# 简单提交
docs: fix expert count in 06-prompts README

# 带作用域的提交
docs(06-prompts): add missing 06-PPT-design section to README

# 带正文的提交
refactor(08-cases): rename case files to use numeric format

Changed case naming from Chinese numerals to numeric format:
- 案例一 → 案例01
- 案例二 → 案例02
- ...

This improves sorting and consistency across the project.

# 修复提交
fix(links): update broken references after file renaming

Fixed all relative links that broke during the file renaming process.

Closes #123
```

### 4.3 大规模文档更新工作流

**场景**: 批量重命名文件、更新大量链接

#### 步骤1: 创建重构分支

```bash
# 从最新main分支创建
git checkout main
git pull origin main

# 创建重构分支
git checkout -b refactor/unify-naming-convention
```

#### 步骤2: 准备变更清单

```bash
# 创建变更清单文件
 cat > REFACTOR-PLAN.md << 'EOF'
# 命名规范统一重构计划

## 变更范围
- 重命名08-实战案例文件（案例一 → 案例01）
- 重命名draw.io → draw-io
- 更新所有相关链接

## 影响文件
- 08-实战案例/01-基础案例/* (3个文件)
- 08-实战案例/02-进阶案例/* (4个文件)
- 08-实战案例/03-高级案例/* (3个文件)
- 06-提示词库/05-图表设计/* (1个文件)
- 所有README.md文件（链接更新）

## 回滚计划
如果出现问题，使用 git reset --hard 回滚到此提交之前

## 预计完成时间
2026-02-XX
EOF
```

#### 步骤3: 执行变更

```bash
# 批量重命名（使用git mv保留历史）
cd 08-实战案例/01-基础案例
git mv "案例一-电费缴纳APP界面设计.md" "案例01-电费缴纳APP界面设计.md"
git mv "案例二-电力巡检管理系统需求文档.md" "案例02-电力巡检管理系统需求文档.md"
git mv "案例三-销售数据可视化看板.md" "案例03-销售数据可视化看板.md"
cd ../../

# 其他目录类似操作...

# 更新链接（使用脚本或手动）
# 建议使用脚本批量替换
sed -i 's/案例一/案例01/g' 08-实战案例/README.md
sed -i 's/案例二/案例02/g' 08-实战案例/README.md
# ...
```

#### 步骤4: 验证变更

```bash
# 运行检查脚本
./scripts/run-all-checks.sh

# 确保无错误
# 如果有错误，修复后再提交
```

#### 步骤5: 提交变更

```bash
# 添加所有变更
git add -A

# 提交（使用重构类型）
git commit -m "refactor: unify file naming convention across project

Major naming convention updates:
- 08-cases: 案例一 → 案例01 format (10 files)
- 06-prompts: draw.io → draw-io (1 file)
- Updated all cross-references in README files
- Fixed 27 broken links after renaming

BREAKING CHANGE: File paths have changed. External links may break."

# 推送到远程
git push origin refactor/unify-naming-convention
```

#### 步骤6: 创建Pull Request

```markdown
## PR标题
refactor: 统一项目文件命名规范

## 变更说明
本次PR统一了项目中的文件命名规范：

### 主要变更
1. **08-实战案例**: 所有案例文件改为数字序号格式
   - 案例一 → 案例01
   - 案例二 → 案例02
   - ...
   
2. **06-提示词库**: 特殊字符标准化
   - draw.io图表生成专家.md → draw-io图表生成专家.md
   
3. **链接更新**: 修复了所有相关的交叉引用
   - 更新了5个README.md文件中的链接
   - 修复了27个失效链接

### 验证
- [x] 运行了 check-naming.sh - 全部通过
- [x] 运行了 check-links.sh - 无失效链接
- [x] 运行了 check-counts.sh - 统计数据正确

### 破坏性变更
⚠️ 文件路径已改变，外部项目如果引用本项目的具体文件路径，需要更新。

### 后续计划
- 文档同步（更新版本号）将在下一个PR完成
```

#### 步骤7: 合并后的清理

```bash
# 合并到main后，清理本地分支
git checkout main
git pull origin main
git branch -d refactor/unify-naming-convention

# 删除远程分支（可选）
git push origin --delete refactor/unify-naming-convention
```

### 4.4 版本标签管理

#### 版本号规则（Semantic Versioning）

```
格式: v主版本.次版本.修订版本

示例: v3.0.0, v3.1.0, v3.0.1

规则:
- 主版本: 重大架构变更、破坏性变更
- 次版本: 新增功能、新增专家/Skill（向下兼容）
- 修订版本: 修复bug、文档更新（向下兼容）
```

#### 打标签流程

```bash
# 1. 确保在main分支且工作区干净
git checkout main
git status

# 2. 更新版本号（在所有文档中）
# 手动或使用脚本更新所有README.md和CLAUDE.md中的版本号

# 3. 提交版本更新
git add -A
git commit -m "chore: bump version to v3.1.0

Changes:
- Added 3 new experts
- Added 5 new Skills
- Fixed all naming convention issues"

# 4. 创建标签
git tag -a v3.1.0 -m "Release v3.1.0

Highlights:
- New experts: XXX, YYY, ZZZ
- New Skills: aaa, bbb, ccc, ddd, eee
- Improved documentation consistency

Full changelog: see CHANGELOG.md"

# 5. 推送标签
git push origin main
git push origin v3.1.0
```

#### 版本发布Checklist

```markdown
## 版本发布前检查清单

### 代码检查
- [ ] 所有检查脚本通过
- [ ] 无未解决的TODO
- [ ] 所有测试通过（如果有）

### 文档检查
- [ ] 根目录README.md版本号已更新
- [ ] 根目录CLAUDE.md版本号已更新
- [ ] 所有子模块README.md版本号已更新
- [ ] 所有子模块CLAUDE.md版本号已更新
- [ ] 最后更新日期已同步
- [ ] CHANGELOG.md已更新

### 统计数据检查
- [ ] 专家数量: 27个
- [ ] Skill数量: 47个
- [ ] 案例数量: 10个
- [ ] 所有统计数据在各文档中一致

### 发布检查
- [ ] 创建git标签
- [ ] 推送标签到远程
- [ ] 创建GitHub Release
- [ ] 更新项目主页（如有）
```

---

## 5. 工作量估算

### 5.1 实施阶段划分

#### 第一阶段: 紧急修复（Week 1）
**目标**: 修复统计不一致问题

| 任务 | 工作量 | 优先级 |
|------|--------|--------|
| 更新06-提示词库/README.md专家数量为27个 | 2小时 | ⭐⭐⭐⭐⭐ |
| 更新06-提示词库/README.md添加06-PPT设计章节 | 4小时 | ⭐⭐⭐⭐⭐ |
| 更新06-提示词库/CLAUDE.md添加06-PPT设计到子模块表格 | 2小时 | ⭐⭐⭐⭐⭐ |
| 同步所有文档版本号至v3.0.0 | 2小时 | ⭐⭐⭐⭐⭐ |
| 验证所有统计数据正确性 | 2小时 | ⭐⭐⭐⭐⭐ |
| **小计** | **12小时 / 1.5天** | - |

#### 第二阶段: 命名规范实施（Week 2）
**目标**: 统一文件命名

| 任务 | 工作量 | 优先级 |
|------|--------|--------|
| 重命名08-实战案例文件（案例一→案例01） | 4小时 | ⭐⭐⭐⭐ |
| 重命名draw.io → draw-io | 1小时 | ⭐⭐⭐⭐ |
| 更新所有README.md中的文件引用 | 8小时 | ⭐⭐⭐⭐ |
| 更新根目录README.md文件结构图 | 2小时 | ⭐⭐⭐⭐ |
| 验证所有链接有效性 | 4小时 | ⭐⭐⭐⭐ |
| **小计** | **19小时 / 2.5天** | - |

#### 第三阶段: 自动化脚本开发（Week 3-4）
**目标**: 实现检查脚本

| 任务 | 工作量 | 优先级 |
|------|--------|--------|
| 开发check-counts.sh（计数验证） | 8小时 | ⭐⭐⭐⭐ |
| 开发check-versions.sh（版本检查） | 6小时 | ⭐⭐⭐⭐ |
| 开发check-naming.sh（命名规范） | 12小时 | ⭐⭐⭐ |
| 开发check-links.sh（链接检查） | 10小时 | ⭐⭐⭐ |
| 开发check-content.sh（内容完整性） | 8小时 | ⭐⭐⭐ |
| 开发run-all-checks.sh（主控脚本） | 6小时 | ⭐⭐⭐ |
| 配置GitHub Actions CI/CD | 8小时 | ⭐⭐⭐ |
| **小计** | **58小时 / 7天** | - |

#### 第四阶段: 流程优化（Week 5）
**目标**: 完善工作流

| 任务 | 工作量 | 优先级 |
|------|--------|--------|
| 编写CONTRIBUTING.md（贡献指南） | 8小时 | ⭐⭐⭐ |
| 编写CHANGELOG.md（变更日志） | 4小时 | ⭐⭐⭐ |
| 团队培训/文档说明 | 4小时 | ⭐⭐ |
| 优化脚本性能和报告 | 8小时 | ⭐⭐ |
| 添加Slack/邮件通知 | 4小时 | ⭐ |
| **小计** | **28小时 / 3.5天** | - |

### 5.2 总工作量汇总

| 阶段 | 时间 | 里程碑 |
|------|------|--------|
| Week 1: 紧急修复 | 12小时 (1.5天) | 所有统计数据正确 |
| Week 2: 命名规范 | 19小时 (2.5天) | 所有文件命名统一 |
| Week 3-4: 自动化脚本 | 58小时 (7天) | 5个检查脚本+CI/CD |
| Week 5: 流程优化 | 28小时 (3.5天) | 完整贡献指南 |
| **总计** | **117小时 (约15天)** | **项目规范完成** |

**建议实施策略**:
- **方案A - 集中实施**: 安排2-3周专职完成（推荐）
- **方案B - 渐进实施**: 每周投入20%时间，持续2个月
- **方案C - 最小可行**: 先做Week 1+2的紧急修复（31小时），后续逐步完善

### 5.3 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 文件重命名导致外部链接失效 | 高 | 提供旧文件名重定向或说明文档 |
| 批量更新引入新错误 | 中 | 所有变更必须经过检查脚本验证 |
| 团队协作不一致 | 中 | 强制代码审查，运行CI检查 |
| 时间估算不足 | 中 | 采用方案C最小可行，逐步完善 |

---

## 附录A: 快速参考卡片

### A1. 文件命名速查表

| 场景 | 正确示例 | 错误示例 |
|------|---------|---------|
| 目录序号 | `01-完整指南/` | `1-完整指南/`, `第一章/` |
| 案例文件 | `案例01-XXX.md` | `案例一-XXX.md`, `case01-XXX.md` |
| 专家文件 | `需求生成专家.md` | `需求生成专家.txt` |
| PPT专家 | `【墨蓝】现代科技蓝图风专家.md` | `【墨蓝】现代科技蓝图风专家.txt` |
| 特殊字符 | `draw-io图表生成专家.md` | `draw.io图表生成专家.md` |

### A2. 提交信息速查表

| 场景 | 正确示例 |
|------|---------|
| 修复文档错误 | `docs: fix expert count from 18 to 27` |
| 新增专家 | `feat: add 3 new PPT design experts` |
| 修复链接 | `fix(06-prompts): update broken links` |
| 重命名文件 | `refactor(08-cases): rename to numeric format` |
| 版本更新 | `chore: bump version to v3.1.0` |

### A3. 分支命名速查表

| 场景 | 正确示例 |
|------|---------|
| 文档更新 | `docs/update-readme` |
| 新增功能 | `feat/add-new-expert` |
| 修复错误 | `fix/correct-typo` |
| 重命名 | `refactor/unify-naming` |
| 版本发布 | `release/v3.1.0` |

---

## 附录B: 参考资源

### B1. 相关文档
- [项目README](../README.md)
- [项目CLAUDE](../CLAUDE.md)
- [Conventional Commits规范](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

### B2. 工具推荐
- **检查脚本**: Bash + grep/sed/awk
- **CI/CD**: GitHub Actions
- **代码审查**: GitHub Pull Request
- **项目管理**: GitHub Projects/Issues

---

**文档版本**: v1.0.0  
**最后更新**: 2026-02-01  
**维护者**: yuhang
