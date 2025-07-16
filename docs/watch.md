# watch

## watch

### 用法

`watch` 接受三个参数
* `source` 可以是一个`getter`函数, 可以是一个`ref`也可以是一个响应式对象
* `callback` 回调函数, 当`source`变化时, 会重新执行`callback`回调函数
* `options` 配置项, 可以配置`deep`和`immediate` 等

```ts
const count = ref(0)
watch(count, (newValue, oldValue) => {
  console.log(newValue, oldValue)
})

count.value++ // 1 0
```

### 实现原理

基于`doWatch`方法实现, 首先对`source`进行判断,如果`source`是一个对象,则需要递归这个对象,产生一个可以给`ReactiveEffect`使用的`getter`, 如果`source`是一个函数, 则直接使用这个函数, 如果`source`是一个`ref`对象, 则使用`ref.value`作为`getter`

这个`getter`会作为`ReactiveEffect`的`fn`使用, 当`getter`内数值变化时就会触发`ReactiveEffect`的`run`方法, 从而触发`callback`回调函数

函数返回一个`unWatch`方法, 这个方法会调用`ReactiveEffect` 的`stop`方法, 从而停止监听

`callback`的第三个参数是`onCleanup`, 可以传入清理方法,该方法会在`callback`执行前执行 用于清理资源

- Options
  - `deep` 是否深度监视, 原理: 如果传入`false` 递归遍历对象的时候 只会遍历一层 实现浅层监视
  - `immediate` 是否立即执行一次回调函数 默认为`false` 原理: 执行`doWatch` 时 如果传入选项则会立即执行
  - 

## watchEffect

### 用法

`watchEffect` 接受两个参数
* `effect` 回调函数, 当`effect`内的响应式对象变化时, 会重新执行`effect`回调函数
* `options` 配置项

### 实现原理

也基于`doWatch`实现 不过传入的`getter`是`effect`本身 `callback` 传入的是null

`watchEffect` 实际上是对Vue`effect`Api的一种包装? 存疑