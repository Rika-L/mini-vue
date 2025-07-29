# slot

插槽允许我们在组件的模板中定义占位符，以便在使用组件时填充内容。

## 用法

```typescript
// slot
it('slot: happy path', () => {
  const RenderComponent = {
    render(proxy) {
      return h(Fragment, [proxy.$slots.default()])
    },
  }
  const VueComponent = {
    render() {
      return h(RenderComponent, null, {
        default: () => h('div', 'slot'),
      })
    },
  }

  const container = document.createElement('div')
  render(h(VueComponent), container)
  expect(container.innerHTML).toBe('<div>slot</div>')
})
```

## 实现

在创建虚拟节点时 如果`createVnode`的第三个参数`children`是一个对象, 则会被打上插槽的标记

```typescript
else if (isObject(children)) {
  vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN // 插槽
}
```

在初始化组件时 会检查该标记， 如果有会把`children`放到组件实例的`slots`上

```typescript
export function initSlots(instance, children) {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    instance.slots = children
  }
  else {
    instance.slots = {}
  }
}
```

使用时只用调用`proxy`上对应的插槽即可

### 默认插槽

插槽名字叫`default`

### 具名插槽

修改对应的插槽名字即可

### 作用域插槽

子组件调用插槽时可以传递数据到父组件的插槽中

```typescript
// 作用域插槽
it('slot: scope', () => {
  const RenderComponent = {
    render(proxy) {
      return h(Fragment, [proxy.$slots.default({ foo: 'bar' })])
    },
  }
  const VueComponent = {
    render() {
      return h(RenderComponent, null, {
        default: ({ foo }) => h('div', foo),
      })
    },
  }
  const container = document.createElement('div')
  render(h(VueComponent), container)
  expect(container.innerHTML).toBe('<div>bar</div>')
})
```
