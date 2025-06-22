# ref

## 用法

ref 接受基本数据类型或者对象，返回一个响应式的 ref 对象。与 reactive 类似地，在effect 中对 ref.value 做取值操作会触发**依赖收集**，对 ref.value 做赋值操作会**依赖触发**。

## 原理

ref 会创建一个`RefImpl`实例并返回，该实例主要维护以下属性，`__v_isRef` 标识、`_value` 响应式数据（如果传入的是个对象，会对该对象进行响应式处理（Reactive）），`deps` 表示该ref对象收集的依赖

get value 时会先 **依赖收集** 再返回值。set value 时，如果值有更新 会设置新值并**依赖触发**。

## isRef

检查对象上是否有`__v_isRef`标识，并返回`true`或者`false`

## unRef

如果传入的值是ref，返回`ref.value` 否则返回原值
