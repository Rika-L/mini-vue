# defineStore

`pinia`核心方法之`defineStore`

该方法同时支持`Options API`和`Composition API`两种方式来定义store。

options API

```typescript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
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

## 实现

`defineStore` 会对用户传参的不同重载方式进行处理，最终返回一个函数。

```typescript
export function defineStore(idOrOptions, setup) { // 第一个参数兼容旧写法 => 在`options`中写id
  let id
  let options

  const isSetupStore = typeof setup === 'function' // 判断是否是使用 Composition API 的写法

  // 对用户的两种写法做一个处理
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = setup
  }
  else {
    // 兼容旧写法 从`option`s`中获取`id`
    options = idOrOptions
    id = idOrOptions.id
  }
}
```

`defineStore` 会返回一个`useStore`方法, 执行该方法会返回`store`实例

具体代码实现如下

```typescript
function useStore() {
  // 获取当前组件实例 这个方法只能在组件实例中调用
  const currentInstance = getCurrentInstance()
  const pinia = currentInstance && inject(PiniaSymbol) // 注入pinia实例

  if (!pinia._s.has(id)) { // 在缓存中查看是否创建过store 没创建过需要新建一个
    if (isSetupStore)
      createSetupStore(id, setup, pinia, isSetupStore)
    else createOptionStore(id, options, pinia) // 创建的store只需要存在_s中即可
  }
  const store = pinia._s.get(id) // 如果已经有了store则不用创建

  return store
}

return useStore
```

针对两种写法:

会将`options`写法包装成一个`setup`函数 然后使用`createSetupStore`方法来创建store。

```typescript
function createOptionStore(id, options, pinia) {
  const { state, actions, getters = {} } = options // 从选项中获取`state`、`actions`和`getters`

  function setup() { // 包装出一个setup函数
    pinia.state.value[id] = state ? state() : {} // 初始化state

    const localState = toRefs(pinia.state.value[id]) // 将state转换为响应式引用

    const setupStore = Object.assign( // 合并state、actions和getters
      {},
      localState,
      actions,
      // 处理getters 将每个getter转换为计算属性
      Object.keys(getters).reduce((computeds, getterKey) => {
        computeds[getterKey] = computed(() => {
          const store = pinia._s.get(id) // 获取当前store
          return getters[getterKey].call(store)
        })
        return computeds
      }, {}),
    )
    return setupStore
  }

  // 用包装好的setup函数创建store
  const store = createSetupStore(id, setup, pinia)

  return store
}
```

对于`Composition API`的写法，直接使用传入的`setup`函数来创建store。

```typescript
function createSetupStore(id, setup, pinia, isSetupStore) {
  const store = reactive({}) // 创建一个响应式对象作为store

  function wrapAction(actions) { // 包装actions中的函数，确保this指向store
    return function () {
      actions.call(store, ...arguments)
    }
  }

  const setupStore = setup() // 执行`setup`函数 拿到的setupStore 没有处理this指向

  if (isSetupStore) { // 如果是使用 Composition API 的写法
    pinia.state.value[id] = {} // 用于存放setupStore的id对应的状态
  }
  for (const prop in setupStore) {
    const value = setupStore[prop]
    if (typeof value === 'function') {
      // 处理 actions 中的函数 this 指向问题
      setupStore[prop] = wrapAction(value)
    }
    else if (isSetupStore) { // 对setupStore做一些处理操作
      if (isComputed(value)) // 如果是计算属性
        pinia.state.value[id][prop] = value // 将用户返回的对象里的所有属性存下来
    }
  }

  Object.assign(store, setupStore)

  pinia._s.set(id, store) // 将store存入pinia的缓存中

  return store
}
```
