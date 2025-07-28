# props

如果在组件的`props`选项中定义了`props`,则会将这些`props`放到组件实例的`props`上,否则会放到组件实例的`attrs`上。

## 实现

```typescript
function initProps(instance, rawProps) {
  const props = {}
  const attrs = {}

  const propsOptions = instance.propsOptions || {} // 组件中定义的
  if (rawProps) {
    for (const key in rawProps) {
      // 用所有的来分裂
      const value = rawProps[key] // value String | number 应该对props作校验
      if (key in propsOptions) {
        // propsOptions[key]
        props[key] = value
      }
      else {
        attrs[key] = value
      }
    }
  }

  instance.props = reactive(props)
  instance.attrs = attrs
}
```

:::tip
在源码中，`props`是响应式的, 在开发环境下`attrs`也是响应式的, 但在生产环境下`attrs`不是响应式的。
:::

## 代理

会将`attrs`、`props`、`slots`等属性代理到组件实例的`proxy`上, 在`render`中可以拿到这个`proxy`对象, 便于访问

```typescript
instance.proxy = new Proxy(instance, handler)
```

可以像这个测试用例一样使用

```typescript
it('should distinguish attrs and props', () => {
  const VueComponent = {
    props: {
      b: String,
    },
    render(proxy) {
      return h('div', proxy.$attrs.a + proxy.b)
    },
  }
  const container = document.createElement('div')
  render(h(VueComponent, { a: 'hello', b: 'world' }), container)
  expect(container.innerHTML).toBe('<div>helloworld</div>')
})
```
