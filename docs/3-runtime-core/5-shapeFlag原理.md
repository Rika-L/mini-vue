# 位移操作

## 位移

```ts
export enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
```

在vue中 类型标记以如上的形式存储

位移实际上是将二进制位向左移一位

例：

```
ELEMENT = 1
```
的二进制表示为
```
0 0 0 1
```

---

```
TEXT_CHILDREN = 1 << 3
```
的二进制表示为
```
1 0 0 0
```

## 按位或

要是想表示一个元素有文本children,可以对`ELEMENT`与`TEXT_CHILDREN`做**按位或**`|`操作

即

```ts
ELEMENT | TEXT_CHILDREN
```

:::tip
详情可以查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_OR)
:::

这个操作具体为:
```
0 0 0 1
1 0 0 0

1 0 0 1
```
> 得出的值是唯一的

这样就得出了一个新的组合而来的`shapeFlag`

## 按位与

假设有一个组合过的`shapeFlag`,现在想知道它是否是元素ELEMENT, 可以使用**按位与**`&`操作

:::tip
详情可以查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)
:::

原理是在两个操作书对应的二进制位都是`1`时 该位的结果值才为`1`

```
// 示例

0 0 1 1
0 0 0 1

0 0 0 1
```

如果一个组合出来的`shapeFlag`做按位与操作之后等于0, 则说明无关

比如上一节组合出来的`1 0 0 1`

现在需要判断是否是元素ELEMENT

```ts
shapeFlag & ELEMENT
```

```
1 0 0 1
0 0 0 1

0 0 0 1
```
说明是元素

```ts
shapeFlag & COMPONENT
```

```
1 0 0 1
0 1 1 0

0 0 0 0
```

说明不是组件
