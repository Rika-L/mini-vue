# KeepAlive

具体实现可以看[Vue官方文档](https://cn.vuejs.org/guide/built-ins/keep-alive.html)

## LRU 缓存

> 实现最大保活数

:::tip
利用`set`和迭代器的特性实现**LRU**缓存

[Leetcode](https://leetcode.cn/problems/lru-cache/description/)
:::

在`set`内缓存

```typescript
const keys = new Set()
```

添加新的缓存的时候先尝试从`set`中取出缓存

```typescript
const cache = keys.get(key)
```

如果取到缓存, 不用创建新的组件 而是复用从缓存中取出的组件 并刷新缓存

```typescript
vnode.component = cacheVNode.component // 不创建新的组件，直接复用缓存的组件
vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE // 告诉他不需要做初始化操作
keys.delete(key)
keys.add(key) // 核心逻辑-刷新缓存
```

如果没有取到缓存, 则表示要创建新的组件

这时候要看`set`的大小是否超过了最大保活数

超过的话则要删除最久未使用的缓存(通过迭代器实现)

```typescript
pruneCacheEntry(keys.values().next().value)
```

## 标记

`KeepAlive` 组件会在子组件渲染时打上一个标记，表示该组件需要被保活。

下次渲染时，如果该组件已经存在于缓存中，则会直接复用该组件，而不是重新创建。

## 保活原理

创建一个容器 如果组件卸载时元素需保活, 则将组件放入该容器中而不是真正卸载

激活元素时, 不走原先的创建逻辑 而是从容器的缓存中取出元素

同时在这两个过程中可以触发`KeepAlive`独有的生命周期钩子
