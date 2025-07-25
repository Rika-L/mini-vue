# computed 计算属性

## 用法

`computed`接收一个函数`getter`或者一个对象`Options`(该对象形如{get: getter, set: setter}), 并返回一个新对象, 这个对象的`value`属性的值是`getter`函数的返回值, 当`getter`内的响应式数据发生变化时, 下次访问`value`属性时会重新计算`getter`函数的返回值. 如果传入`setter`, 该函数会在`value`属性被修改时触发.

```ts
const obj = reactive({ count: 1 })

const count = computed(() => obj.count)

console.log(count.value) // 1
obj.count = 2
console.log(count.value) // 2
```

## 原理

首先, `computed` 会判断传参类型, 并对参数参数进行处理. 然后创建一个`ComputedRefImpl`实例并返回.

该实例具备**依赖收集**的能力, 可以收集到依赖与当前计算属性的`effect`,在该实例内部维护一个`effect`, fn是`getter`, 调度函数会触发依赖了当前计算属性收集的依赖的重新执行.

如果每次取值都重新计算, 会存在严重的性能问题, 有如下处理方法: `ReactiveEffect` 内部维护一个`dirty`属性, 默认是`dirty`, 在首次执行后, 该值变为`no dirty` 重复取值时判断`dirty`的值, 如果`no dirty` 则直接返回上次缓存的结果. 依赖每次发生变化(触发更新)后, 将`dirty`设置为`dirty`.等待下次重新取值, 每次完成重新取值后, 将`dirty`设置为`no dirty`.

对于`set`函数, 会在`value`属性被修改时触发
