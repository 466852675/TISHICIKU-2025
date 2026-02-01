# 示例：文件规划实战

## 示例1：研究任务

**用户请求：** "研究早晨锻炼的好处并撰写摘要"

### 循环1：创建计划
```bash
Write task_plan.md
```

```markdown
# 任务计划：早晨锻炼好处研究

## 目标
创建关于早晨锻炼好处的研究摘要。

## 阶段
- [ ] 第1阶段：创建此计划 ✓
- [ ] 第2阶段：搜索并收集来源
- [ ] 第3阶段：综合发现
- [ ] 第4阶段：交付摘要

## 关键问题
1. 身体健康好处是什么？
2. 心理健康好处是什么？
3. 哪些科学研究支持这一点？

## 状态
**当前在第1阶段** - 创建计划
```

### 循环2：研究
```bash
Read task_plan.md           # 刷新目标
WebSearch "早晨锻炼好处"
Write notes.md              # 存储发现
Edit task_plan.md           # 标记第2阶段完成
```

### 循环3：综合
```bash
Read task_plan.md           # 刷新目标
Read notes.md               # 获取发现
Write morning_exercise_summary.md
Edit task_plan.md           # 标记第3阶段完成
```

### 循环4：交付
```bash
Read task_plan.md           # 验证完成
Deliver morning_exercise_summary.md
```

---

## 示例2：错误修复任务

**用户请求：** "修复认证模块中的登录错误"

### task_plan.md
```markdown
# 任务计划：修复登录错误

## 目标
识别并修复阻止成功登录的错误。

## 阶段
- [x] 第1阶段：理解错误报告 ✓
- [x] 第2阶段：定位相关代码 ✓
- [ ] 第3阶段：识别根本原因（当前）
- [ ] 第4阶段：实施修复
- [ ] 第5阶段：测试并验证

## 关键问题
1. 出现什么错误消息？
2. 哪个文件处理认证？
3. 最近有什么变化？

## 已做出的决策
- 认证处理程序在src/auth/login.ts中
- 错误发生在validateToken()函数中

## 遇到的错误
- [初始] TypeError: Cannot read property 'token' of undefined
  → 根本原因：user对象未正确await

## 状态
**当前在第3阶段** - 找到根本原因，准备修复
```

---

## 示例3：功能开发

**用户请求：** "在设置页面添加深色模式切换"

### 3文件模式实战

**task_plan.md:**
```markdown
# 任务计划：深色模式切换

## 目标
在设置中添加功能性深色模式切换。

## 阶段
- [x] 第1阶段：研究现有主题系统 ✓
- [x] 第2阶段：设计实施方法 ✓
- [ ] 第3阶段：实施切换组件（当前）
- [ ] 第4阶段：添加主题切换逻辑
- [ ] 第5阶段：测试并优化

## 已做出的决策
- 使用CSS自定义属性作为主题
- 在localStorage中存储偏好
- 切换组件在SettingsPage.tsx中

## 状态
**当前在第3阶段** - 构建切换组件
```

**notes.md:**
```markdown
# 笔记：深色模式实施

## 现有主题系统
- 位于：src/styles/theme.ts
- 使用：CSS自定义属性
- 当前主题：仅浅色

## 要修改的文件
1. src/styles/theme.ts - 添加深色主题颜色
2. src/components/SettingsPage.tsx - 添加切换
3. src/hooks/useTheme.ts - 创建新钩子
4. src/App.tsx - 用ThemeProvider包装

## 颜色决策
- 深色背景：#1a1a2e
- 深色表面：#16213e
- 深色文本：#eaeaea
```

**dark_mode_implementation.md:** (交付物)
```markdown
# 深色模式实施

## 更改内容

### 1. 添加深色主题颜色
文件：src/styles/theme.ts
...

### 2. 创建useTheme钩子
文件：src/hooks/useTheme.ts
...
```

---

## 示例4：错误恢复模式

当某些内容失败时，不要隐藏它：

### 之前（错误）
```
操作：读取config.json
错误：文件未找到
操作：读取config.json  # 静默重试
操作：读取config.json  # 再次重试
```

### 之后（正确）
```
操作：读取config.json
错误：文件未找到

# 更新task_plan.md：
## 遇到的错误
- config.json未找到 → 将创建默认配置

操作：写入config.json（默认配置）
操作：读取config.json
成功！
```

---

## 读取-决策模式

**在重大决策之前始终阅读您的计划：**

```
[已发生许多工具调用...]
[上下文越来越长...]
[原始目标可能被遗忘...]

→ 读取task_plan.md          # 这将目标带回注意力！
→ 现在做出决策              # 目标在上下文中是新鲜的
```

这就是Manus能够处理约50个工具调用而不会失去跟踪的原因。计划文件充当"目标刷新"机制。
