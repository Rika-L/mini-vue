# Copilot Instructions for mini-vue

## 项目架构
- 本项目为 Vue3 最简实现，采用 monorepo 结构，核心模块分布于 `packages/` 下：
  - `reactivity`：响应式系统，包括 `reactive`、`ref`、`computed` 等实现。
  - `runtime-core`：平台无关的渲染逻辑，虚拟节点、diff 算法、组件、生命周期、watch 等。
  - `runtime-dom`：浏览器相关的渲染实现，包含 DOM 操作和属性处理。
  - `compiler-core`：模板编译相关，AST 生成、codegen、render 函数生成。
  - `shared`：通用工具和类型。
  - `vue`：入口聚合模块。

## 关键开发流程
- 安装依赖：`pnpm install`
- 构建：`pnpm build`，输出至 `packages/vue/dist`
- 测试：`pnpm test` 或 `pnpm test:ui`，各模块测试位于 `__tests__` 目录
- 文档构建：`pnpm run docs:build`，文档入口为 `docs/`，采用 VitePress

## 重要约定与模式
- 所有核心 API 均有对应的测试用例，测试覆盖常见用法和边界情况。
- 响应式依赖收集通过 `targetMap` 维护，详见 `reactiveEffect.ts` 和 `docs/响应式原理.md`
- Diff 算法实现于 `runtime-core/src/renderer.ts`，测试见 `diff.spec.ts`，覆盖多种节点变更场景。
- 组件渲染、props/attrs、setup、Fragment、Teleport、Transition 等均有独立实现和测试。
- 事件处理、属性 patch、VNode shapeFlag/patchFlag 详见 `runtime-dom` 和 `shared`。
- 编译流程分三步：模板转 AST、AST 转 codegen node、生成 render 函数，见 `compiler-core/src/index.ts`
- 构建工具采用 `rolldown`，配置见 `rolldown.config.ts`，路径 alias 需保持一致。
- ESLint 配置见 `eslint.config.mjs`，部分规则已关闭以便调试。

## 交互与集成
- 各模块通过 alias 互相引用，避免循环依赖。
- `runtime-dom` 提供平台渲染能力，`runtime-core` 提供核心逻辑，`vue` 聚合导出。
- 文档和源码紧密结合，API/原理均有详细 markdown 说明。

## 示例
- 响应式：`reactivity/__tests__/effect.spec.ts`、`ref.spec.ts`
- 渲染/组件：`runtime-core/__tests__/render.spec.ts`、`renderComponent.spec.ts`
- Diff 算法：`runtime-core/__tests__/diff.spec.ts`
- 事件/DOM：`runtime-dom/__tests__/nodeOps.spec.ts`
- 编译：`compiler-core/src/index.ts`

## 其他
- 部署流程见 `.github/workflows/deploy.yml`，自动化构建与发布文档到 GitHub Pages。
- 贡献/调试建议：优先阅读 `README.md`、各模块下的 `docs/` 和测试用例。

---
如有不清楚或遗漏的部分，请反馈以便补充完善。
