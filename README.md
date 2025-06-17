# mini-vue
实现vue的最小复现

```
packages
├─ shared
├─ runtime-dom
├─ runtime-core
├─ vue
└─ reactivity
```

## How to use

### install

```
pnpm install
```

### build

output `packages/vue/dist`

```
pnpm build
```

### test

```
pnpm test
```

or

```
pnpm test:ui
```

## Already implemented
* reactivity
  * effect
  * reactive
  * ref
  * computed
  * toRef
  * toRefs
  * unRef
  * proxyRefs
* runtime-dom
  * renderOptions
    * nodeOps
    * patchProp
  * render
* runtime-core
  * createRenderer
  * nextTick
  * watch
  * watchEffect
  * 组件渲染
    * props attrs
    * setup
  * Text渲染
  * Fragment渲染
  * Element渲染
