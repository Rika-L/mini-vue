# ref

## 用法

`ref` 接受基本数据类型或者对象，返回一个响应式的 `ref` 对象。与 `reactive` 类似地，在`effect` 中对 `ref.value` 做取值操作会触发**依赖收集**，对 `ref.value` 做赋值操作会**依赖触发**。

## 原理

`ref` 会创建一个`RefImpl`实例并返回，该实例主要维护以下属性，`__v_isRef` 标识、`_value` 响应式数据（如果传入的是个对象，会对该对象进行响应式处理（Reactive），`deps` 表示该ref对象收集的依赖

get value 时会先 **依赖收集** 再返回值。set value 时，如果值有更新 会设置新值并**依赖触发**。

## isRef

检查对象上是否有`__v_isRef`标识，并返回`true`或者`false`

## unRef

如果传入的值是ref，返回`ref.value` 否则返回原值

## toRef

### 用法

基于响应式对象上的一个属性创建一个对应的`ref` 以此方法创建的`ref`会与源属性保持同步, 即改变源属性的值会更新`ref`的值, 改变`ref`的值会更新源属性的值

```ts
const obj = reactive({ a: 1 })
const a = toRef(obj, 'a')
a.value = 2 // obj.a = 2
```

### 原理

会创建一个`ObjectRefImpl`实例并返回, 对该对象上的`value`进行取值实际上会对源对象上被`toRef`包裹的属性进行取值, 可以理解成一个转发, 设置值的时候同理, 会对源对象上被`toRef`包裹的属性进行设置

## toRefs

### 用法

`toRef`每个属性创建一个的`ref`的用法还是过于麻烦, 所以就有了`toRefs`, `toRefs`相当于`toRef`的批量版, 他会将对象上的每一个属性创建一个`ref`并在返回一个包含这些`ref`的对象, 另一个好处是解决了响应式对象解构赋值的问题

```ts
const obj = reactive({ a: 1, b: 2 })
const { a, b } = toRefs(obj)
a.value = 2 // obj.a = 2
b.value = 3 // obj.b = 3
```

### 原理

`toRefs`会遍历对象上的每一个属性, 对每一个属性使用`toRef`创建一个`ref`并在返回一个包含这些`ref`的对象

## proxyRefs

### 用法

`proxyRefs`接受一个`ref`或者对象，返回一个代理对象，在取值时会自动**脱ref** 设置值的时候会自动**设置ref**

```ts
const count = ref(1)

const proxyCount = proxyRefs(count)

console.log(proxyCount) // {value: 1}
proxyCount = 2
console.log(count.value) // {value: 2}
```

### 原理

在`get`部分 直接对返回值做了`unRef`操作,这样拿到的就是`ref.value`

在`set`部分
* 如果不是`ref`类型, 则直接替换成新的值
* 如果是`ref`类型, 则设置`ref.value`
