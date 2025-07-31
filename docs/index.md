---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "mini-vue"
  text: "实现最简的Vue3模型"
  tagline: 面试通关文档
  actions:
    - theme: brand
      text: Reactivity
      link: /1-reactivity/1-响应式原理
    - theme: alt
      text: API Examples
      link: /api-examples

features:
  - title: reactivity
    details: 响应式核心实现包
    link: /1-reactivity/1-响应式原理
    linkText: Learn more
  - title: runtime-dom
    details: 浏览器运行时核心包
    link: /2-runtime-dom/runtime-dom
    linkText: Learn more
  - title: runtime-core
    details: 平台无关的核心运行时，包含虚拟节点、组件渲染、diff算法等
    link: /3-runtime-core/01-runtime-core
    linkText: Learn more
  - title: compiler-core
    details: 模板编译核心包
    link: /4-compiler-core/0-compiler-core介绍
    linkText: Learn more
  - title: mini-pinia
    details: vue官方状态管理库pinia的简化实现
    link: /5-mini-pinia/0-pinia介绍
    linkText: Learn more
  - title: mini-vue-router
    details: vue官方路由库vue-router的简化实现(is working)
    link: /4-compiler-core/0-compiler-core介绍
    linkText: Learn more
  - title: 面试题整理
    details: 面试题整理，包含常见的vue面试题(is working)
    link: /interview-questions/1-面试题整理
    linkText: Learn more
---
