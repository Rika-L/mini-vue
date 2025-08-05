# $onAction

## 使用

:::tip
pinia官网介绍: 你可以通过 store.$onAction() 来监听 action 和它们的结果。传递给它的回调函数会在 action 本身之前执行。after 表示在 promise 解决之后，允许你在 action 解决后执行一个回调函数。同样地，onError 允许你在 action 抛出错误或 reject 时执行一个回调函数。这些函数对于追踪运行时错误非常有用
:::

使用示例:

```typescript
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()
```

## 实现

核心是: **传入不同的钩子,在对应的时机使用**

可以利用**发布订阅**模式来实现

先手写一段发布订阅的代码
```typescript
// 订阅事件 传入订阅数组及回调函数
export function addSubscription(subscriptions, callback) {
  subscriptions.push(callback) // 添加回调到订阅数组
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback)
    if (idx > -1) {
      subscriptions.splice(idx, 1)
    }
  }
  return removeSubscription // 返回一个函数，用于移除订阅
}

// 触发所有订阅的回调函数
export function triggerSubscriptions(subscriptions, ...args) {
  // 遍历订阅数组，调用每个回调函数
  subscriptions.slice().forEach((cb) => {
    cb(...args)
  })
}
```

调用`$onAction`会订阅事件

```typescript
$onAction: addSubscription.bind(null, actionSubscriptions)
```

然后修改原有的`wrapAction`方法

```typescript
function wrapAction(actions) {
  return function () {
    const afterCallbacks = [] // 存储after回调
    const onErrorCallbacks = [] // 存储onError回调
    const after = (callback) => { // 在action执行后调用的钩子
      afterCallbacks.push(callback)
    }
    const onError = (callback) => { // 在action抛出错误时调用的钩子
      onErrorCallbacks.push(callback)
    }
    triggerSubscriptions(actionSubscriptions, { after, onError }) // 触发所有订阅的回调函数并传入after和onError钩子
    let ret
    try {
      // eslint-disable-next-line prefer-rest-params
      ret = actions.call(store, ...arguments)
      triggerSubscriptions(afterCallbacks, ret) // 执行after回调
    }
    catch (e) {
      triggerSubscriptions(onErrorCallbacks, e) // 执行onError回调
    }
    if (ret instanceof Promise) {
      return ret.then((value) => {
        triggerSubscriptions(afterCallbacks, value) // 执行after回调
      }).catch((error) => {
        triggerSubscriptions(onErrorCallbacks, error) // 执行onError回调
      })
    }
    return ret
  }
}
```
