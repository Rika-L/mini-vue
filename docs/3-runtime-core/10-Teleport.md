# Teleport

## 功能

Teleport 是一个特殊的内置组件，允许在运行时将组件的内容传送到其他位置。它通常用于在不同的 DOM 层次结构中共享组件状态或行为。

最常见的用途是把`Dialog`传送到`body`下 避免在组件树中嵌套过深，导致样式或行为问题。

组件可以接受一个`to`属性，指定要传送到的目标元素的选择器或 DOM 元素。测试用例如下

```typescript
const container = document.body
container.innerHTML = ''
const app = document.createElement('div')
app.id = 'app'
const root = document.createElement('div')
root.id = 'root'
container.appendChild(app)
container.appendChild(root)
render(h(Teleport, { to: '#root' }, h(Text, 'hello')), container)
expect(root.innerHTML).toBe('hello')
render(h(Teleport, { to: '#root' }, h(Text, 'world')), container)
expect(root.innerHTML).toBe('world')
render(h(Teleport, { to: '#app' }, h(Text, 'world')), container)
expect(app.innerHTML).toBe('world')
expect(root.innerHTML).toBe('')
render(null, container)
expect(app.innerHTML).toBe('')
```

:::tip
详见[Teleport文档](https://cn.vuejs.org/guide/built-ins/teleport)
:::

## 实现

`Teleport` 组件有自己的渲染逻辑 `renderer`遇到`Teleport`标记时会调用`Teleport`的`process`方法。

```typescript
else if (shapeFlag & ShapeFlags.TELEPORT) {
  type.process(n1, n2, container, anchor, parentComponent, {
    mountChildren,
    patchChildren,
    move(vnode, container, anchor) {
      // 此方法可以将组件或者dom元素移动到新的位置
      hostInsert(
        vnode.component ? vnode.component.subTree : vnode.el,
        container,
        anchor,
      )
    },
  })
}
```

process 会处理`Teleport`的逻辑。它会检查当前组件是否是第一次渲染（`n1`），如果是，则将子组件挂载到指定的目标元素上。如果不是第一次渲染，则更新子组件的内容，并根据需要移动子组件到新的目标位置。

```typescript
process: (n1, n2, container, anchor, parentComponent, internals) => {
  const { mountChildren, patchChildren, move } = internals

  // 看n1 n2 的关系
  if (!n1) {
    const target = document.querySelector(n2.props.to)
    if (target) {
      mountChildren(n2.children, n2.target = target, anchor, parentComponent)
    }
  }
  else {
    patchChildren(n1, n2, n2.target, anchor, parentComponent)

    if (n2.props.to !== n1.props.to) {
      const nextTarget = document.querySelector(n2.props.to)

      n2.children.forEach(child => move(child, nextTarget, anchor))
    }
  }
}
```
