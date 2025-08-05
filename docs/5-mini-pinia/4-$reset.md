# $reset

通过建立一个新的状态对象，将 store 重设为初始状态。

:::warning
`$reset` 仅在`options`语法中有效
:::

## 使用

```typescript
store.$reset()
```

## 实现

```typescript
const store = pinia._s.get(id) // 获取当前store
store.$reset = function () {
  const newState = state ? state() : {}
  this.$patch(newState) // 重置状态
}
```

重新执行state函数，获取初始状态，然后通过`$patch`方法进行状态更新
