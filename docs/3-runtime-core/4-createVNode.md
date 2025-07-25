# createVNode

::: tip
`createVNode`是一个标准化的创建虚拟节点方法
:::

## 入参

* type
* props
* children?

返回一个虚拟节点，会根据type的类型决定虚拟节点上的`patchFlag`

虚拟节点的结构大致如下所示

```ts
{
    "__v_isVnode": true, // 虚拟节点标记
    "type": "div", // 类型
    "props": { // props
        "class": "foo"
    },
    "children": "Hello World!", // children
    "key": undefined, // diff 算法需要用key
    "el": null, // 虚拟节点需要对应真实dom
    "ref": undefined, // 模板引用
    "shapeFlag": 9 // shapeFlag标记
}
```

## shapeFlag处理

会根据`type`的类型确定 shapeFlag 的值

