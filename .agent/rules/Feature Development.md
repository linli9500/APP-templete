---
trigger: always_on
---

# 功能开发规范

## 国际化语言
- **国际化支持**：开发的任何一个功能都必须支持多语言。
- **禁止硬编码**：严禁在代码中出现硬编码的字符串（如中文/英文），必须使用 `translate('key')` 或 `tx` 属性。

## 主题系统
- **暗黑模式支持**：开发的功能必须同时适配浅色模式和暗黑模式。
- **禁止硬编码背景色**：严禁写死 `bg-white` 或 `bg-black` 而不提供 `dark:` 变体。

## 组件使用规范
- **Text 组件**: 严禁使用 React Native 原生 `<Text>`。必须使用 `@/components/ui` 中的 `<Text>` 组件。
  - **默认行为**: 该组件默认支持“浅色黑字 / 深色白字”，因此**绝大多数情况下不要手动指定颜色类名**（如 `text-black` 或 `text-neutral-xxx`）。
  - **特殊情况**: 仅在需要特殊颜色（如副标题、错误提示、链接）时，才显式覆盖颜色，且必须成对编写暗黑模式样式（例: `text-neutral-500 dark:text-neutral-400`）。
- **Image 组件**: 优先使用 Expo Image (`expo-image`) 以获得更好的缓存和性能体验。
- **列表渲染**: 长列表优先使用 **FlashList** (`@shopify/flash-list`) 替代原生 `FlatList`。

## 数据与状态管理
- **服务端状态**: 必须使用 **React Query** (`@tanstack/react-query`) 进行 API 数据请求和缓存管理。严禁在组件内使用 `useEffect` + `fetch` 手写非标准请求逻辑。
- **全局状态**: 使用 **Zustand** 管理客户端全局状态（如用户会话、应用设置、非持久化中间状态）。

## 表单处理
- **规范**: 复杂表单必须使用 **React Hook Form** 配合 **Zod** Schema 进行验证。
- **验证**: 禁止在 UI 层编写复杂的 `if (!email) return` 验证逻辑，逻辑应收敛在 Zod Schema 中。

## 图标规范
- **SVG 图标**: 所有图标必须以 SVG 组件形式存在。
- **动态颜色**: 图标组件必须接收 `color` 属性，严禁在 SVG 内部硬编码 HEX 颜色值，以确保能跟随 `dark:` 模式正确切换颜色（例如使用 `currentColor` 或 prop 传参）。

## 导航栏
不要使用系统默认的 Stack 导航栏，使用的是自定义的导航栏