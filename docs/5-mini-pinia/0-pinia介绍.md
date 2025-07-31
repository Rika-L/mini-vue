# pinia

`pinia` 是 Vue.js 的一个状态管理库，类似于 Vuex，但更轻量和易用。它提供了一个简单的 API 来管理应用程序的状态，并且与 Vue 3 的 Composition API 紧密集成(同时也支持 Options API)。

:::tip
[pinia官方文档](https://pinia.vuejs.org/zh/)
:::

## 使用

```typescript
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

---

options API

```typescript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})
```

Composition API

```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

---

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

counter.count++
// 自动补全！ ✨
counter.$patch({ count: counter.count + 1 })
// 或使用 action 代替
counter.increment()
</script>

<template>
  <!-- 直接从 store 中访问 state -->
  <div>Current Count: {{ counter.count }}</div>
</template>
```

## 流程

可以看出`pinia`的流程主要分以下几个步骤

1. **创建 Pinia 实例**：使用 `createPinia()` 创建一个`Pinia`实例。
2. **注册 Pinia**：在 Vue 应用中使用 `app.use(pinia)` 以插件形式注册 Pinia 实例。
3. **定义 Store**：使用 `defineStore` 定义一个或多个 store。每个 store 都有一个唯一的 ID 和状态。
4. **使用 Store**：在组件中通过 `useStore` 函数访问
