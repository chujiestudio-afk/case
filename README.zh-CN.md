---
name: tiktok-tux-demo
description: 这是 tiktok-design-system skill 搭配使用的模版项目
---

[English](./README.md) | [简体中文](./README.zh-CN.md)

# TikTok UX Demo

一个可运行的 React 原型壳：用真实的 TUX Web 组件与 token 快速搭 UI。

## 安装与运行（npm）

安装依赖：

```bash
npm i
```

启动开发环境：

```bash
npm run dev
```

构建 / 预览：

```bash
npm run build
npm run preview
```

（仓库包含 `pnpm-lock.yaml`，也可以用 `pnpm i` / `pnpm dev`。）

## 核心依赖（3 个）

- `@byted-tiktok/tux-web`：组件库与应用容器（`<TUXApp />`），负责按主题渲染 TUX 组件。
- `@byted-tiktok/tux-icons`：TikTok 图标组件（在 `src/App.tsx` 里用于底部 Tab 图标）。
- `@byted-tiktok/tux-color`：颜色 token / CSS 变量体系，主题切换依赖 `data-tux-color-scheme`。

## 现在有什么（以及路由要怎么做）

- 一个移动端 App 壳：`src/components/app_frame.tsx`（桌面模拟手机 frame）。
- 一个 5-tab 底部导航：`src/components/app_tab_bar_view.tsx` + `src/App.tsx` 的 tabs/pages 配置。
- 5 个一级页面骨架：`src/page/*`（Home/Friends/Create/Inbox/Profile）。
- 一个独立页面模版：`/router_page`，自带 `TUXApp`、`AppFrame` 和 `TUXNavBar`。
- 一个左下角路由切换器：`src/components/route_switcher.tsx`，用图标 + `TUXMenu` 在主路径和 `/router_page` 之间切换。
- 支持 PWA，可安装到桌面，以独立应用方式打开。

当前页面切换是“Tab 内部状态切换”，还没有“URL 路由”。后续如果要补路由：

- 可以直接在现有 5 个一级页面里改造成“带路由的容器页”。
- 也可以在 `src/page/` 新建一个页面，并在该页面内部做子路由。
- 如果要先做独立页面原型，可以直接参考 `/router_page` 这套单页模版。
- 关键约束：所有页面/路由内容都必须在 `src/App.tsx` 的 `<TUXApp>` 与 `<AppFrame>` 内部创建（不要把页面挂到外面）。

## 主题与相关能力（参考点）

- 全局主题状态：`src/context/theme.tsx`，用 `useTheme()` 读写 `mode` / `resolvedTheme`。
- 主题落地方式：`resolvedTheme` 传给 `<TUXApp theme={...} />`，同时会把 `data-tux-color-scheme` 写到 `document.documentElement`。
- 全局主题切换入口：`src/components/theme_switcher.tsx`（桌面右下角 segmented control）。
- 底部 Tab 的“强制主题”能力：`src/components/app_tab_bar_view.tsx` 会根据 tab 的 `themeOverride` 调 `setForcedMode(...)`。
- 页面局部覆写主题：用 `ThemeScope`（同在 `src/context/theme.tsx`）包一段 UI。
