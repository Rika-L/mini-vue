# createPinia

返回一个Pinia实例

实现：

```typescript
import { ref } from 'vue'
import { PiniaSymbol } from './rootState'

export function createPinia() {
  const state = ref({}) // 用于存储所有的store的状态

  const _p = [] // 插件列表 支持链式调用
  const pinia = {
    // 走vue的插件安装方法
    install(app) {
      // 期望所有的组件都可以访问到这个pinia

      // 兼容vue2和vue3
      app.config.globalProperties.$pinia = pinia
      // vue2 Vue.prototype.$pinia = pinia

      // vue3 可以通过inject 注入实例
      app.provide(PiniaSymbol, pinia)
    },

    // 插件安装方法
    use(plugin) {
      _p.push(plugin)
      return pinia
    },

    state,
    _s: new Map(), // 存储所有的store 每个store id -> store
    _p
  }
  return pinia
}
```
