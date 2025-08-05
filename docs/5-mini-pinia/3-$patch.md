# $patch

可以使用`$patch` 方法变更`state`的状态

`$patch` 支持两种方式：

- 对象方式：传入一个对象，进行部分属性更新
- 函数方式：传入一个函数，函数内接收`state`作为参数，可以对`state`进行任意操作

## 使用

对象形式

```typescript
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})
```

函数形式

```typescript
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

## 实现

```typescript
function $patch(partialStateOrMutator) {
  // 这里需要获取到原来的所有状态
  if (typeof partialStateOrMutator !== 'function') {
    // 如果传入的是对象 调用合并函数 与原来的状态进行合并
    merge(pinia.state.value[id], partialStateOrMutator)
  }
  else {
    // 否则调用函数即可
    partialStateOrMutator(pinia.state.value[id]) // 如果是函数则直接调用
  }
}

const partialStore = {
  $patch
}
```

合并函数

```typescript
function merge(target, partialState) {
  for (const key in partialState) {
    if (!partialState.hasOwnProperty(key))
      continue
    const targetValue = target[key]
    const subPatch = partialState[key]

    if (isObject(subPatch) && isObject(targetValue) && !isRef(subPatch))
      target[key] = merge(targetValue, subPatch) // 递归合并
    else target[key] = subPatch
  }

  return target
}
```
