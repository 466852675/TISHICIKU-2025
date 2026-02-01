---
name: web-artifacts-builder
description: 使用现代前端 Web 技术（React、Tailwind CSS、shadcn/ui）创建复杂、多组件的 claude.ai HTML 工件的工具套件。用于需要状态管理、路由或 shadcn/ui 组件的复杂工件——不用于简单的单文件 HTML/JSX 工件。
license: 完整条款见 LICENSE.txt
---

# Web 工件构建器

要构建强大的前端 claude.ai 工件，请按以下步骤操作：
1. 使用 `scripts/init-artifact.sh` 初始化前端仓库
2. 通过编辑生成的代码开发你的工件
3. 使用 `scripts/bundle-artifact.sh` 将所有代码打包到单个 HTML 文件
4. 向用户展示工件
5. （可选）测试工件

**技术栈**：React 18 + TypeScript + Vite + Parcel（打包）+ Tailwind CSS + shadcn/ui

## 设计与样式指南

非常重要：为避免通常被称为"AI 垃圾"的效果，避免使用过多的居中布局、紫色渐变、统一的圆角和 Inter 字体。

## 快速开始

### 第 1 步：初始化项目

运行初始化脚本创建新的 React 项目：
```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

这将创建一个完全配置的项目，包括：
- ✅ React + TypeScript（通过 Vite）
- ✅ Tailwind CSS 3.4.1 配合 shadcn/ui 主题系统
- ✅ 路径别名（`@/`）已配置
- ✅ 40+ shadcn/ui 组件预装
- ✅ 包含所有 Radix UI 依赖
- ✅ Parcel 配置用于打包（通过 .parcelrc）
- ✅ Node 18+ 兼容性（自动检测并固定 Vite 版本）

### 第 2 步：开发你的工件

要构建工件，请编辑生成的文件。有关指导，请参见下面的**常见开发任务**。

### 第 3 步：打包为单个 HTML 文件

要将 React 应用打包到单个 HTML 工件：
```bash
bash scripts/bundle-artifact.sh
```

这将创建 `bundle.html`——一个自包含的工件，所有 JavaScript、CSS 和依赖项都已内联。此文件可以直接在 Claude 对话中作为工件共享。

**要求**：你的项目必须在根目录中有 `index.html`。

**脚本功能**：
- 安装打包依赖（parcel、@parcel/config-default、parcel-resolver-tspaths、html-inline）
- 创建支持路径别名的 `.parcelrc` 配置
- 使用 Parcel 构建（无 source map）
- 使用 html-inline 将所有资源内联到单个 HTML

### 第 4 步：与用户共享工件

最后，在对话中与用户共享打包的 HTML 文件，以便他们可以将其作为工件查看。

### 第 5 步：测试/可视化工件（可选）

注意：这是一个完全可选的步骤。仅在必要或要求时执行。

要测试/可视化工件，请使用可用工具（包括其他技能或内置工具如 Playwright 或 Puppeteer）。一般来说，避免预先测试工件，因为它会增加请求和查看成品工件之间的延迟。如有要求或出现问题，稍后在展示工件后进行测试。

## 参考

- **shadcn/ui 组件**：https://ui.shadcn.com/docs/components