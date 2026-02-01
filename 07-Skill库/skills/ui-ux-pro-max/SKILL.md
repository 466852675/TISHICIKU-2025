---
name: ui-ux-pro-max
description: "UI/UX 设计智能。50种样式、21种配色方案、50种字体搭配、20种图表、8种技术栈（React、Next.js、Vue、Svelte、SwiftUI、React Native、Flutter、Tailwind）。操作：规划、构建、创建、设计、实现、审查、修复、改进、优化、增强、重构、检查 UI/UX 代码。项目：网站、落地页、仪表板、管理面板、电商、SaaS、作品集、博客、移动应用、.html、.tsx、.vue、.svelte。元素：按钮、模态框、导航栏、侧边栏、卡片、表格、表单、图表。样式：玻璃拟态、粘土拟态、极简主义、粗野主义、新拟态、便当网格、深色模式、响应式、拟物化、扁平设计。主题：配色方案、无障碍性、动画、布局、排版、字体搭配、间距、悬停效果、阴影、渐变。"
---

# UI/UX Pro Max - 设计智能

可搜索的 UI 样式、配色方案、字体搭配、图表类型、产品推荐、UX 指南和技术栈特定最佳实践数据库。

## 前提条件

检查是否已安装 Python：

```bash
python3 --version || python --version
```

如果未安装 Python，请根据用户的操作系统进行安装：

**macOS：**
```bash
brew install python3
```

**Ubuntu/Debian：**
```bash
sudo apt update && sudo apt install python3
```

**Windows：**
```powershell
winget install Python.Python.3.12
```

---

## 如何使用此技能

当用户请求 UI/UX 工作（设计、构建、创建、实现、审查、修复、改进）时，遵循以下工作流程：

### 步骤 1：分析用户需求

从用户请求中提取关键信息：
- **产品类型**：SaaS、电商、作品集、仪表板、落地页等
- **样式关键词**：极简、活泼、专业、优雅、深色模式等
- **行业**：医疗、金融科技、游戏、教育等
- **技术栈**：React、Vue、Next.js，或默认为 `html-tailwind`

### 步骤 2：搜索相关领域

多次使用 `search.py` 收集全面的信息。搜索直到获得足够的上下文。

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<关键词>" --domain <领域> [-n <最大结果数>]
```

**推荐的搜索顺序：**

1. **产品** - 获取产品类型的样式推荐
2. **样式** - 获取详细的样式指南（颜色、效果、框架）
3. **排版** - 获取带有 Google Fonts 导入的字体搭配
4. **颜色** - 获取配色方案（主色、辅助色、行动按钮、背景、文本、边框）
5. **落地页** - 获取页面结构（如果是落地页）
6. **图表** - 获取图表推荐（如果是仪表板/分析）
7. **UX** - 获取最佳实践和反模式
8. **技术栈** - 获取技术栈特定的指南（默认：html-tailwind）

### 步骤 3：技术栈指南（默认：html-tailwind）

如果用户未指定技术栈，**默认为 `html-tailwind`**。

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<关键词>" --stack html-tailwind
```

可用技术栈：`html-tailwind`、`react`、`nextjs`、`vue`、`svelte`、`swiftui`、`react-native`、`flutter`

---

## 搜索参考

### 可用领域

| 领域 | 用途 | 示例关键词 |
|------|------|------------|
| `product` | 产品类型推荐 | SaaS、电商、作品集、医疗、美容、服务 |
| `style` | UI 样式、颜色、效果 | 玻璃拟态、极简主义、深色模式、粗野主义 |
| `typography` | 字体搭配、Google Fonts | 优雅、活泼、专业、现代 |
| `color` | 按产品类型的配色方案 | saas、电商、医疗、美容、金融科技、服务 |
| `landing` | 页面结构、CTA 策略 | hero、hero-centric、testimonial、pricing、social-proof |
| `chart` | 图表类型、库推荐 | 趋势、对比、时间线、漏斗、饼图 |
| `ux` | 最佳实践、反模式 | 动画、无障碍性、z-index、加载 |
| `prompt` | AI 提示、CSS 关键词 | （样式名称） |

### 可用技术栈

| 技术栈 | 重点 |
|--------|------|
| `html-tailwind` | Tailwind 工具类、响应式、无障碍性（默认） |
| `react` | 状态、hooks、性能、模式 |
| `nextjs` | SSR、路由、图片、API 路由 |
| `vue` | Composition API、Pinia、Vue Router |
| `svelte` | Runes、stores、SvelteKit |
| `swiftui` | Views、State、Navigation、Animation |
| `react-native` | Components、Navigation、Lists |
| `flutter` | Widgets、State、Layout、Theming |

---

## 示例工作流程

**用户请求：** "为专业护肤服务制作落地页"

**AI 应该：**

```bash
# 1. 搜索产品类型
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --domain product

# 2. 搜索样式（基于行业：美容、优雅）
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "elegant minimal soft" --domain style

# 3. 搜索排版
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "elegant luxury" --domain typography

# 4. 搜索配色方案
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --domain color

# 5. 搜索落地页结构
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "hero-centric social-proof" --domain landing

# 6. 搜索 UX 指南
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "animation" --domain ux
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "accessibility" --domain ux

# 7. 搜索技术栈指南（默认：html-tailwind）
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "layout responsive" --stack html-tailwind
```

**然后：** 综合所有搜索结果并实现设计。

---

## 获得更好结果的技巧

1. **使用具体的关键词** - "healthcare SaaS dashboard" > "app"
2. **多次搜索** - 不同的关键词揭示不同的见解
3. **组合领域** - 样式 + 排版 + 颜色 = 完整的设计系统
4. **始终检查 UX** - 搜索 "animation"、"z-index"、"accessibility" 了解常见问题
5. **使用技术栈标志** - 获取实现特定的最佳实践
6. **迭代** - 如果第一次搜索不匹配，尝试不同的关键词

---

## 专业 UI 的常见规则

这些是经常被忽视的问题，会使 UI 看起来不专业：

### 图标与视觉元素

| 规则 | 应该 | 不应该 |
|------|------|--------|
| **不使用表情符号图标** | 使用 SVG 图标（Heroicons、Lucide、Simple Icons） | 使用表情符号如 🎨 🚀 ⚙️ 作为 UI 图标 |
| **稳定的悬停状态** | 在悬停时使用颜色/透明度过渡 | 使用导致布局偏移的缩放变换 |
| **正确的品牌标志** | 从 Simple Icons 研究官方 SVG | 猜测或使用错误的标志路径 |
| **一致的图标大小** | 使用固定的 viewBox（24x24）配合 w-6 h-6 | 随机混合不同的图标大小 |

### 交互与光标

| 规则 | 应该 | 不应该 |
|------|------|--------|
| **光标指针** | 对所有可点击/可悬停的卡片添加 `cursor-pointer` | 在交互元素上保留默认光标 |
| **悬停反馈** | 提供视觉反馈（颜色、阴影、边框） | 没有指示元素是可交互的 |
| **平滑过渡** | 使用 `transition-colors duration-200` | 即时状态变化或太慢（>500ms） |

### 浅色/深色模式对比度

| 规则 | 应该 | 不应该 |
|------|------|--------|
| **玻璃卡片浅色模式** | 使用 `bg-white/80` 或更高透明度 | 使用 `bg-white/10`（太透明） |
| **浅色模式文本对比度** | 使用 `#0F172A`（slate-900）作为文本 | 使用 `#94A3B8`（slate-400）作为正文文本 |
| **浅色模式弱化文本** | 最少使用 `#475569`（slate-600） | 使用 gray-400 或更浅 |
| **边框可见性** | 在浅色模式中使用 `border-gray-200` | 使用 `border-white/10`（不可见） |

### 布局与间距

| 规则 | 应该 | 不应该 |
|------|------|--------|
| **浮动导航栏** | 添加 `top-4 left-4 right-4` 间距 | 将导航栏固定在 `top-0 left-0 right-0` |
| **内容内边距** | 考虑固定导航栏的高度 | 让内容隐藏在固定元素后面 |
| **一致的最大宽度** | 使用相同的 `max-w-6xl` 或 `max-w-7xl` | 混合不同的容器宽度 |

---

## 交付前检查清单

在交付 UI 代码之前，验证以下项目：

### 视觉质量
- [ ] 不使用表情符号作为图标（使用 SVG 代替）
- [ ] 所有图标来自一致的图标集（Heroicons/Lucide）
- [ ] 品牌标志正确（从 Simple Icons 验证）
- [ ] 悬停状态不会导致布局偏移
- [ ] 直接使用主题颜色（bg-primary）而不是 var() 包装

### 交互
- [ ] 所有可点击元素都有 `cursor-pointer`
- [ ] 悬停状态提供清晰的视觉反馈
- [ ] 过渡平滑（150-300ms）
- [ ] 键盘导航的焦点状态可见

### 浅色/深色模式
- [ ] 浅色模式文本有足够的对比度（最少 4.5:1）
- [ ] 玻璃/透明元素在浅色模式下可见
- [ ] 边框在两种模式下都可见
- [ ] 交付前测试两种模式

### 布局
- [ ] 浮动元素与边缘有适当的间距
- [ ] 没有内容隐藏在固定导航栏后面
- [ ] 在 320px、768px、1024px、1440px 响应式
- [ ] 移动端没有水平滚动

### 无障碍性
- [ ] 所有图片都有 alt 文本
- [ ] 表单输入有标签
- [ ] 颜色不是唯一的指示器
- [ ] 尊重 `prefers-reduced-motion`
