# TikTok UX Demo

[English](./README.md) | [简体中文](./README.zh-CN.md)

This repository is an internal demo project for TikTok designers who want to do vibe coding and turn product ideas into working UI prototypes quickly.

It is designed to be used alongside the TikTok design-system skill, but this repo itself is the executable prototype surface: a real React app that renders TikTok-like flows with actual TUX Web components instead of mocked placeholders.

## What This Project Is

TikTok UX Demo is a lightweight prototype playground for:

- translating design ideas into working screens
- validating TikTok-native interaction patterns on web
- testing layout, hierarchy, theming, and navigation in code
- giving designers and design engineers a shared implementation surface

This is not a generic starter template. It is a focused demo app that mirrors common TikTok product structure and uses the real TT design-system component layer where possible.

## Why TUX Web Matters

This project internally depends on `@byted-tiktok/tux-web`, which is part of the TT design system.

That means the prototype is built on top of real design-system primitives and behaviors rather than a visual imitation. In practice, this helps the demo stay closer to production reality in areas such as:

- theming
- color tokens
- component structure
- navigation patterns
- iconography
- interaction consistency

If you are using this repo together with the TikTok design-system skill, the expected workflow is:

1. describe a screen, feature, or interaction in natural language
2. implement or refine it in this demo app
3. validate whether the result feels TikTok-native on web
4. iterate with real components and tokens instead of ad hoc UI code

## Current Demo Scope

The app currently provides a TikTok-style shell with:

- a mobile-like app frame rendered inside a desktop browser
- a bottom tab bar with five destinations
- theme switching support
- dark and light theme behavior
- example surfaces for Home, Friends, Create, Inbox, and Profile

The current implementation is intentionally lightweight. Some pages are still placeholder surfaces, which makes this repo suitable for rapid prototyping and iterative screen development.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- `@byted-tiktok/tux-web`
- `@byted-tiktok/tux-icons`

## Project Structure

Key areas in the repository:

- `src/App.tsx`: app entry composition, TUX app wrapper, tab configuration
- `src/components/`: reusable frame, tab bar, theme switcher, status bar, icons
- `src/page/`: prototype pages for each tab
- `src/context/theme.tsx`: theme mode, persistence, and runtime theme resolution

## How To Run

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

Create a production build:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

## Recommended Use

This repo works best when you want to prototype any of the following:

- a TikTok-inspired page from a text prompt
- a UI translated from a high-fidelity mock or screenshot
- a refinement pass on an existing TikTok-style surface
- a component or flow that should use TUX Web conventions

Typical users include:

- product designers
- design engineers
- frontend engineers collaborating with design

## Working Principles

When adding or refining screens in this repo, prefer:

- real TUX Web components when available
- TikTok-native hierarchy over generic web UI patterns
- semantic tokens instead of hard-coded visual values
- responsive behavior that adapts structure, not only scale
- production-minded states even in prototype code

## Notes

- This repository is intended for internal prototyping and design validation.
- The goal is speed with design fidelity, not full production completeness.
- If a page looks intentionally incomplete, it is usually a placeholder meant to be expanded during prototype iteration.