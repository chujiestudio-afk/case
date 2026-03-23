# TikTok UX Demo

[English](./README.md) | [简体中文](./README.zh-CN.md)

这个仓库是一个面向 TikTok 设计师的内部 demo 项目，目标是支持 vibe coding，把产品想法更快地变成可运行的 UI 原型。

它通常会配合 TikTok design-system skill 一起使用，但这个仓库本身就是实际的原型承载面：它不是只做说明的文档仓库，而是一个真实可运行的 React 应用，内部直接调用真实的 TUX Web 组件，而不是用占位样式去模拟界面。

## 项目定位

TikTok UX Demo 是一个轻量的原型实验场，主要用于：

- 把设计想法快速翻译成真实页面
- 在 Web 上验证 TikTok-native 的交互模式
- 用代码测试布局、层级、主题和导航结构
- 给设计师和设计工程协作者提供同一个实现基座

它不是一个通用脚手架模板，而是一个围绕 TikTok 产品体验搭建的定向 demo，尽可能复用真实的 TT Design System 组件能力。

## 为什么要用 TUX Web

这个项目内部依赖 `@byted-tiktok/tux-web`，而 TUX Web 是 TT 设计系统的一部分。

这意味着仓库里的原型不是只在视觉上“像 TikTok”，而是尽量建立在真实设计系统的原子能力和行为之上。这样做的价值在于，原型会更接近真实实现，尤其是在下面这些方面：

- 主题能力
- 颜色 token
- 组件结构
- 导航模式
- 图标体系
- 交互一致性

如果你把这个仓库和 TikTok design-system skill 配合使用，比较典型的工作流是：

1. 用自然语言描述一个页面、功能或者交互
2. 在这个 demo 应用里实现或修改对应界面
3. 验证结果是否具备 TikTok-native 的 Web 体验
4. 基于真实组件和 token 持续迭代，而不是写一次性的临时 UI

## 当前 Demo 范围

目前这个应用提供了一个 TikTok 风格的基础壳层，包含：

- 在桌面浏览器中模拟移动端 app frame
- 带五个入口的底部 tab bar
- 主题切换能力
- 浅色和深色主题支持
- Home、Friends、Create、Inbox、Profile 五个示例页面

当前实现是有意保持轻量的，部分页面还是占位状态。这正适合快速原型和渐进式页面补全。

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- `@byted-tiktok/tux-web`
- `@byted-tiktok/tux-icons`

## 项目结构

仓库里的核心目录如下：

- `src/App.tsx`：应用入口组合、TUX App 包裹层、tab 配置
- `src/components/`：可复用的 frame、tab bar、theme switcher、status bar、图标等组件
- `src/page/`：每个 tab 对应的原型页面
- `src/context/theme.tsx`：主题模式、持久化和运行时主题解析

## 启动方式

安装依赖：

```bash
pnpm install
```

启动开发环境：

```bash
pnpm run dev
```

构建生产包：

```bash
pnpm run build
```

本地预览生产包：

```bash
pnpm run preview
```

## 推荐使用场景

这个仓库比较适合拿来做以下几类原型：

- 根据文本描述快速生成 TikTok 风格页面
- 把高保真设计稿或截图翻译成可运行 UI
- 对现有 TikTok 风格界面做 refinement
- 验证一个应该遵循 TUX Web 模式的组件或流程

典型使用者包括：

- 产品设计师
- 设计工程师
- 与设计协作的前端工程师

## 实现原则

在这个仓库里新增或优化页面时，建议优先遵循这些原则：

- 能用真实 TUX Web 组件时，优先使用真实组件
- 优先保证 TikTok-native 的信息层级，而不是套用泛化的 Web UI 模式
- 尽量使用语义化 token，而不是硬编码视觉值
- 响应式不仅调整尺寸，也要调整结构
- 即使是原型代码，也尽量覆盖更接近生产的状态设计

## 说明

- 这个仓库主要用于内部原型和设计验证。
- 目标是用尽可能快的方式获得尽可能高的设计还原度，而不是一次性做到完整生产级交付。
- 如果某个页面看起来还比较空，通常意味着它是一个等待继续扩展的原型占位面。