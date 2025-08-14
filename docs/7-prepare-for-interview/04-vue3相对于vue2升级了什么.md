# vue3 相对于 vue2 升级了什么

## 响应式重构

使用`Proxy` + `Reflect`代理整个对象, 在`vue2`中使用`Object.defineProperty`来劫持对象的属性。

|      |         能力          |                 性能 |
| ---- | :-------------------: | -------------------: |
| vue2 | 无法检测新增/删除属性 | 需要递归遍历整个对象 |
| vue3 | 原生支持新增/删除属性 |           不需要遍历 |

vue2 中如果要给一个对象新增属性，需要调用提供的`Vue.set`方法，删除属性需要调用`Vue.delete`方法。
vue3 中新增属性和删除属性都可以直接操作对象，响应式系统会自动检测。

## 编程范式

从`Options API`到`Composition API`，vue3 提供了新的编程范式。

|            |            Options API            |       Composition API |
| ---------- | :-------------------------------: | --------------------: |
| 组织方式   | 分散书写(data,methods,computed等) | 在`setup()`中自由组合 |
| 逻辑复用   |              Mixins               |                 Hooks |
| TypeScript |      类型推断差 需额外装饰器      |   基于TS,类型推断友好 |

## 编译时优化

* 静态提升：将模板中不变的部分提升到渲染函数外部，避免每次渲染都重新创建
* Patch Flag：编译时为虚拟节点添加静态标记，运行时根据标记跳过不必要的比对
* 缓存事件处理器：避免每次渲染都创建新的事件处理器函数

## 运行时优化

* 更快的虚拟DOM：重写了虚拟DOM和Diff算法，提升渲染性能
* 更高效的组件初始化：优化了组件实例的创建和挂载流程
* 按需引入：通过Tree Shaking只打包实际使用的代码，减小包体积

## 其他新特性

* Fragment：组件可以返回多个根节点，减少不必要的包裹元素
* Teleport：将组件的子节点渲染到DOM树的其他位置
* Suspense：支持异步组件加载，提供更好的用户体验
* 更好的TypeScript支持：从设计之初就考虑了TypeScript的使用

## 生命周期名字变化

* beforeCreate/created -> setup()  // 取而代之
* onBeforeMount/onMounted -> onBeforeMount/onMounted
* onBeforeUpdate/onUpdated -> onBeforeUpdate/onUpdated
* onBeforeUnmount/onUnmounted -> onBeforeUnmount/onUnmounted

等等
