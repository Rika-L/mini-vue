# $subscribe

当状态发生变化时，Pinia 提供了一个 `$subscribe` 方法来监听状态的变化。这个方法可以让你在状态更新时执行一些副作用操作，比如记录日志、发送网络请求等。

## 使用

```typescript
counterStore.$subscribe((mutation, state) => {
  console.log('mutation', mutation)
  console.log('state', state)
})
```

##  实现

> 其实是调用了`watch`

```typescript
$subscribe(callback) {
  watch(pinia.state.value[id], state => {
    callback({id}, state)
  })
}
```
