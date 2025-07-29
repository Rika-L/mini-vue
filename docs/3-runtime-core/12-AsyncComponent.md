# 异步组件(AsyncComponent)

## 使用

:::tip
可以使用[`defineAsyncComponent`](https://cn.vuejs.org/guide/components/async.html)来定义异步组件
:::

> defineAsyncComponent 是一个异步组件的工厂函数

具有两种重载

* 可以传入一个`loader`,类型是`Promise`, 在`resolve`中返回异步加载的组件
* 也可以传入一个配置对象, 除了传入`loader`外, 还可以传入`loadingComponent`, `errorComponent`, `delay`, `timeout`等配置

在`mini-vue`中 实现了以下选项

```typescript
{
  loader,
  errorComponent,
  timeout,
  loadingComponent,
  delay,
  onError
}
```

## 实现

基于传入当前的状态, 会展示对应的状态组件

```typescript
else if (error.value && errorComponent) {
  return h(errorComponent)
}
else if (loading.value && loadingComponent) {
  return h(loadingComponent)
}
```

### delay

展示`loadingComponent`的延时 使用定时器即可

```typescript
let loadingTimer = null
if (delay) {
  loadingTimer = setTimeout(() => {
    loading.value = true
  }, delay)
}
```

### timeout

如果超时了, 则展示`errorComponent`

也是定时器来实现

```typescript
if (timeout) {
  setTimeout(() => {
    error.value = true
    throw new Error('组件加载失败')
  }, timeout)
}
```

### onError

传入一个回调函数，接受四个参数：

``` typescript
onError?: (
    error: Error, // 错误对象
    retry: () => void, // 重试函数
    fail: () => void, // 失败函数
    attempts: number // 尝试次数
  ) => any
```

通过失败时返回一个`Promise`来实现重试逻辑 保证异步组件的加载逻辑可以重试

```typescript
function loadFunc() {
  attempts++
  return loader().catch((err) => {
    if (onError) {
      return new Promise((resolve, reject) => {
        const retry = () => resolve(loadFunc())
        const fail = () => reject(err)
        onError(err, retry, fail, ++attempts)
      })
    }
    else {
      throw err
    }
  })
}
```
