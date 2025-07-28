# emit

##原理

```typescript
emit(event, ...payload) {
  const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
  const handler = instance.vnode.props[eventName]
  handler(...payload)
}
```

就是在`props`中找到对应的事件去执行

## 用法

```typescript
// 支持响应事件
it('emit: support render', () => {
  const VueComponent = {
    setup(_props, { emit }) {
      return () => h('button', { onClick: () => emit('myEvent'), id: 'add' })
    },
  }
  const container = document.createElement('div')
  let count = 0
  render(h(VueComponent, { onMyEvent: () => count++ }), container)
  const button = container.querySelector('#add') as HTMLButtonElement
  button.click()
  expect(count).toBe(1)
})
```
