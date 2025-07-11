/* eslint-disable unused-imports/no-unused-vars */
import { isRef, ReactiveEffect } from '@vue/reactivity'
import { isKeepAlive } from '@vue/runtime-dom'
import { PatchFlags, ShapeFlags } from '@vue/shared'
import { invokeArray } from './apiLifecycle'
import { createComponentInstance, setupComponent } from './component'
import { createVnode, Fragment, isSameVnode, Text } from './createVnode'
import { queueJob } from './scheduler'
import getSequence from './seq'

export function createRenderer(renderOptions) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp,
  } = renderOptions

  // 标准化
  const normalize = (children) => {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        if (
          typeof children[i] === 'string'
          || typeof children[i] === 'number'
        ) {
          children[i] = createVnode(Text, null, String(children[i]))
        }
      }
    }

    return children
  }

  const mountChildren = (children, container, anchor, parentComponent) => {
    children = normalize(children)
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container, anchor, parentComponent)
    }
  }

  const mountElement = (vnode, container, anchor, parentComponent) => {
    const { type, children, props, shapeFlag, transition } = vnode
    // 第一次渲染的时候让虚拟节点和真实dom创建管理
    // 第二次渲染新的vnode 可以和上一次的vnode做比对 之后更新el元素可以后续再复用这个dom
    const el = (vnode.el = hostCreateElement(type))

    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
      hostSetElementText(el, children)
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      mountChildren(children, el, anchor, parentComponent)

    if (transition)
      transition.beforeEnter(el)

    hostInsert(el, container, anchor)

    if (transition)
      transition.enter(el)
  }

  const processElement = (n1, n2, container, anchor, parentComponent) => {
    if (n1 === null) {
      // 初始化操作
      mountElement(n2, container, anchor, parentComponent)
    }
    else {
      patchElement(n1, n2, container, anchor, parentComponent)
    }
  }

  const patchProps = (oldProps, newProps, el) => {
    // 新的要全部生效
    for (const key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key])
    }
    // 删除旧的属性
    for (const key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null)
      }
    }
  }

  const unmountChildren = (children, parentComponent) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i], parentComponent)
    }
  }

  // vue3中分为两种diff 全量diff（递归diff） 和 靶向更新 （基于模板编译）
  const patchKeyedChildren = (c1, c2, el, parentComponent) => {
    // 比较两个儿子的差异来更新el
    // [a,b,c,e,f,d]
    // [a,b,d,q,f,d]

    // 1. 减少比对范围 先从头开始比 在从尾部开始 确定不一样的范围
    // 2 从头比对 再从尾巴比对 如果又多余的或者新增的直接操作即可

    // [a,b,c]
    // [a,b,d,e]
    let i = 0 // 开始比对的索引
    let e1 = c1.length - 1 // 第一个数组的尾部索引
    let e2 = c2.length - 1 // 第二个数组的尾部索引

    while (i <= e1 && i <= e2) {
      // 有任何一方循环结束 就要终止比较
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el)
      }
      else {
        break
      }
      i++
    }
    // 到c的位置终止了
    // 到d的位置终止了
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      // [a,b,c]
      // [d,e,b,c]
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el)
      }
      else {
        break
      }

      e1--
      e2--
    }

    // 处理增加和删除的特殊情况
    // [a,b] [a,b,c] [a,b] [c,a,b]
    // [a,b,c] [a,b] [c,a,b] [a,b]

    // a b
    // a b c --> 1 = 2 e1 = 1 e2 = 2 --> i>el && i <= e2

    // a b
    // c a b --> i = 0 e1 = -1 e2 = 0 --> i > e1 && i <= e2 // 新的多老的少
    if (i > e1) {
      // 新的多
      if (i <= e2) {
        // 有插入的部分
        // insert
        const nextPos = e2 + 1 // 看一下当前下一个元素是存在
        const anchor = c2[nextPos]?.el
        while (i <= e2) {
          patch(null, c2[i], el, anchor)
          i++
        }
      }
    }
    // a,b,c
    // a,b --> i = 2 e1 = 2 e2 = 1 --> i > e2 && i <= e1

    // c,a,b
    // a,b --> i = 0 e1 = 1 e2 = -1 --> i > e2 && i <= e1
    else if (i > e2) {
      if (i <= e1) {
        // remove
        while (i <= e1) {
          unmount(c1[i], parentComponent)
          i++
        }
      }
    }
    else {
      // 以上确认不变化的节点 并且对插入和删除做了处理

      // 后面就是特殊的比对方法
      const s1 = i
      const s2 = i

      const keyToNewIndexMap = new Map() // 用于快速查找 看老的是否在新的里面 没有就删除 有的就更新

      // 根据新的节点找到对应老的位置
      const toBePatched = e2 - s2 + 1 // 要倒序插入的个数
      const newIndexToOldMapIndex = Array.from({ length: toBePatched }).fill(0) // 用于记录新的节点在老的里面的位置

      for (let i = s2; i <= e2; i++) {
        const vnode = c2[i]
        keyToNewIndexMap.set(vnode.key, i)
      }

      for (let i = s1; i <= e1; i++) {
        const vnode = c1[i]
        const newIndex = keyToNewIndexMap.get(vnode.key)
        if (!newIndex) {
          // 如果新的里面找不到
          // 删掉老的
          unmount(vnode, parentComponent)
        }
        else {
          // 找到了
          // 比较前后节点的差异 更新属性和儿子
          newIndexToOldMapIndex[newIndex - s2] = i + 1 // 比完以后 + 1    0 意味着以前就不存在 消除歧义
          patch(vnode, c2[newIndex], el)
        }
      }

      // 调整顺序
      // 可以按照新的队列 倒序插入 通过参照物往前插

      // 插入的过程中可能新的元素变多 需要创建

      const inCreasingSeq = getSequence(newIndexToOldMapIndex)

      // 先从索引为3的位置倒叙插入
      let j = inCreasingSeq.length - 1 // 索引
      for (let i = toBePatched - 1; i >= 0; i--) {
        const newIndex = s2 + i // h 对应的索引 找他的下一个元素作为参照物来进行插入
        const anchor = c2[newIndex + 1]?.el
        const vnode = c2[newIndex]

        if (!vnode.el) {
          // 新增的元素
          patch(null, vnode, el, anchor) // 创建h插入
        }
        else {
          if (i == inCreasingSeq[j]) {
            // 如果索引相同 跳过
            j--
          }
          else {
            hostInsert(vnode.el, el, anchor) // 接着倒叙插入
          }
        }
      }
    }
  }

  const patchChildren = (n1, n2, el, anchor, parentComponent) => {
    // text array null
    const c1 = n1.children
    const c2 = normalize(n2.children)

    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新的是文本 老的是数组 移除老的
        unmountChildren(c1, parentComponent)
      }
      if (c1 !== c2) {
        hostSetElementText(el, c2)
      }
    }
    else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 全量diff 算法 两个数组比对
          patchKeyedChildren(c1, c2, el, parentComponent)
        }
        else {
          unmountChildren(c1, parentComponent)
        }
      }
      else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, '')
        }

        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el, anchor, parentComponent)
        }
      }
    }
  }

  const patchBlockChildren = (n1, n2, el, anchor, parentComponent) => {
    for (let i = 0; i < n2.dynamicChildren.length; i++) {
      patch(n1.dynamicChildren[i], n2.dynamicChildren[i], el, anchor, parentComponent)
    }
  }

  const patchElement = (n1, n2, _container, anchor, parentComponent) => {
    // 1.比较元素的差异 肯定需要复用dom元素
    // 2.比较属性的差异
    const el = (n2.el = n1.el) // 对dom元素的复用

    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    // 在比较元素的时候 针对某个属性去比较
    const { patchFlag, dynamicChildren } = n2

    if (patchFlag) {
      if (patchFlag & PatchFlags.CLASS) {
        if (oldProps.class !== newProps.class) {
          hostPatchProp(el, newProps.class, oldProps.class)
        }
      }

      if (patchFlag & PatchFlags.STYLE) {
        hostPatchProp(el, newProps.style, oldProps.style)
      }
    }
    else {
      patchProps(oldProps, newProps, el)
    }
    if (patchFlag & PatchFlags.TEXT) {
      // 只要儿子是动态的 只比较儿子
      if (n1.children !== n2.children) {
        hostSetElementText(el, n2.children)
      }
    }

    if (dynamicChildren) {
      // 线性比对
      patchBlockChildren(n1, n2, el, anchor, parentComponent)
    }
    else {
      // 全量diff
      patchChildren(n1, n2, el, anchor, parentComponent)
    }
  }

  const processText = (n1, n2, container) => {
    if (n1 == null) {
      // 虚拟节点要关联真实节点
      // 将节点插入到页面中
      hostInsert((n2.el = hostCreateText(n2.children)), container)
    }
    else {
      const el = (n2.el = n1.el)
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children)
      }
    }
  }

  const processFragment = (n1, n2, container, anchor, parentComponent) => {
    if (n1 == null) {
      mountChildren(n2.children, container, anchor, parentComponent)
    }
    else {
      patchChildren(n1, n2, container, anchor, parentComponent)
    }
  }

  const updateComponentPreRender = (instance, next) => {
    instance.next = null
    instance.vnode = next
    // instance.props

    updateProps(instance, instance.props, next.props || {})

    // 组件更新的时候需要更新插槽
    Object.assign(instance.slots, next.children)
  }

  function renderComponent(instance) {
    const { render, vnode, proxy, props, attrs, slots } = instance
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      return render.call(proxy, proxy) // render()
    }
    else {
      return vnode.type(attrs, { slots }) // 函数式组件
    }
  }
  function setupRenderEffect(instance, container, anchor, parentComponent) {
    // props attrs data 应该都可以被直接访问到
    const componentUpdateFn = () => {
      // 要在这里区分是第一个还是之后的
      const { bm, m } = instance
      if (!instance.isMounted) {
        if (bm) {
          invokeArray(bm)
        }

        const subTree = renderComponent(instance)
        patch(null, subTree, container, anchor, instance)
        instance.isMounted = true
        instance.subTree = subTree

        if (m) {
          invokeArray(m)
        }
      }
      else {
        // 基于状态的组件更新

        const { next, bu, u } = instance
        if (next) {
          // 说明属性或插槽有更新
          // 更新属性或插槽
          updateComponentPreRender(instance, next)
          // slots props
        }

        if (bu) {
          invokeArray(bu)
        }

        const subTree = renderComponent(instance)
        patch(instance.subTree, subTree, container, anchor, instance)
        instance.subTree = subTree

        if (u) {
          invokeArray(u)
        }
      }
    }

    const effect = new ReactiveEffect(componentUpdateFn, () =>
      queueJob(update))

    const update = (instance.update = () => effect.run())
    update()
  }
  const mountComponent = (vnode, container, anchor, parentComponent) => {
    // 1 先创建组件实例
    // 2 给实力的属性赋值
    // 3 创建一个effect
    const instance = (vnode.component = createComponentInstance(
      vnode,
      parentComponent,
    ))

    if (isKeepAlive(vnode)) {
      instance.ctx.renderer = {
        createElement: hostCreateElement, // 内部需要创建一个div来缓存dom
        move(vnode, container, anchor) { // 需要把之前渲染的dom放入容器中
          hostInsert(vnode.component.subTree.el, container)
        },
        unmount, // 如果组件切换需要将在容器中的元素移除
      }
    }

    setupComponent(instance)

    setupRenderEffect(instance, container, anchor, parentComponent)
    // 组件可以基于自己的状态重新渲染
  }

  const hasPropsChange = (prevProps, nextProps) => {
    const nKeys = Object.keys(nextProps)
    if (nKeys.length !== Object.keys(prevProps).length) {
      // 长度不一样 肯定变了
      return true
    }

    for (let i = 0; i < nKeys.length; i++) {
      const key = nKeys[i]
      if (prevProps[key] !== nextProps[key]) {
        return true
      }
    }

    return false
  }

  const updateProps = (instance, pervProps, nextProps) => {
    // 如果props发生了变化
    // 更新属性 用新的覆盖掉老的
    // 删除老的
    if (hasPropsChange(pervProps, nextProps)) {
      for (const key in nextProps) {
        instance.props[key] = nextProps[key]
      }

      for (const key in instance.props) {
        if (!(key in nextProps)) {
          delete instance.props[key]
        }
      }
    }
  }

  const shouldComponentUpdate = (n1, n2) => {
    const { props: prevProps, children: prevChildren } = n1
    const { props: nextProps, children: nextChildren } = n2
    if (prevChildren || nextChildren) {
      return true // 有插槽直接走重新渲染
    }

    if (prevProps === nextProps) {
      // props没有变化
      return false
    }

    // 如果属性不一致则更新
    return hasPropsChange(prevProps, nextProps || {})
  }

  const updateComponent = (n1, n2) => {
    const instance = (n2.component = n1.component)

    if (shouldComponentUpdate(n1, n2)) {
      instance.next = n2 // 如果调用update有next属性 说明是属性更新、插槽更新
      instance.update() // 让更新逻辑统一
    }

    // const { props: prevProps } = n1
    // const { props: nextProps } = n2

    // updateProps(instance, prevProps, nextProps)
  }

  const processComponent = (n1, n2, container, anchor, parentComponent) => {
    if (n1 === null) {
      if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
        // 需要走KeepAlive中的激活方法
        parentComponent.ctx.activate(n2, container, anchor)
      }
      else {
        mountComponent(n2, container, anchor, parentComponent)
      }
    }
    else {
      // 组件的更新
      updateComponent(n1, n2)
    }
  }

  // 渲染走这里，更新也走这里
  const patch = (n1, n2, container, anchor = null, parentComponent = null) => {
    if (n1 === n2)
      return // 两次渲染同一个元素，直接跳过即可

    // 不是相同节点
    if (n1 && !isSameVnode(n1, n2)) {
      // 删掉n1换n2
      unmount(n1, parentComponent)
      n1 = null // 就会执行n2的初始化
      // 直接移除老dom元素
    }

    const { type, shapeFlag, ref } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor, parentComponent)
        } // 对元素处理
        else if (shapeFlag & ShapeFlags.TELEPORT) {
          type.process(n1, n2, container, anchor, parentComponent, {
            mountChildren,
            patchChildren,
            move(vnode, container, anchor) {
              // 此方法可以将组件或者dom元素移动到新的位置
              hostInsert(
                vnode.component ? vnode.component.subTree : vnode.el,
                container,
                anchor,
              )
            },
          })
        }
        else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(n1, n2, container, anchor, parentComponent)
        } // 对组件的处理 vue3 中函数式组件已经废弃了 没有性能节约

        if (ref !== null) {
          setRef(ref, n2)
        }
    }
  }

  function setRef(rawRef, vnode) {
    const value
      = vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
        ? vnode.component.exposed || vnode.component.proxy
        : vnode.el
    if (isRef(rawRef)) {
      rawRef.value = value
    }
  }

  const unmount = (vnode, parentComponent) => {
    const { shapeFlag, component: instance, transition, el } = vnode
    // 卸载组件
    const performRemove = () => {
      hostRemove(vnode.el)
    }
    if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
      // 需要找keepAlive走失活逻辑
      parentComponent.ctx.deactivate(vnode)
    }
    else if (vnode.type === Fragment) {
      unmountChildren(vnode.children, parentComponent)
    }
    else if (shapeFlag & ShapeFlags.COMPONENT) {
      const { bum, um } = instance

      if (bum) {
        invokeArray(bum)
      }

      unmount(vnode.component.subTree, parentComponent)

      if (um) {
        invokeArray(um)
      }
    }
    else if (shapeFlag & ShapeFlags.TELEPORT) {
      vnode.type.remove(vnode, unmountChildren)
    }
    else {
      if (transition) {
        transition.leave(el, performRemove)
      }
      else {
        performRemove()
      }
    }
  }

  // 多次调用render会进行虚拟节点的比较 再进行更新
  const render = (vnode, container) => {
    if (vnode == null) {
      // 移除当前容器的dom元素
      if (container._vnode) {
        unmount(container._vnode, null)
      }
    }
    else {
      // 将虚拟节点变成真实节点进行渲染
      patch(container._vnode || null, vnode, container)
      container._vnode = vnode
    }
  }
  return {
    render,
  }
}
