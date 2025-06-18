import { proxyRefs, reactive } from '@vue/reactivity'
import { hasOwn, isFunction } from '@vue/shared'
import { ShapeFlags } from '../../shared/src/shapeFlags'

export function createComponentInstance(vnode) {
  const instance = {
    data: null, // 组件的状态
    vnode, // 虚拟节点
    subTree: null, // 子树
    isMounted: false, // 是否挂载
    update: null, // 更新
    props: {},
    attrs: {},
    slots: {}, // 插槽
    propsOptions: vnode.type.props, // 用户声明的属性
    component: null,
    proxy: null, // 用来代理props attrs data 让用户更方便的访问
    setupState: {},
    exposed: null,
  }

  return instance
}

// 组件实例和原始props 初始化属性
function initProps(instance, rawProps) {
  const props = {}
  const attrs = {}

  const propsOptions = instance.propsOptions || {} // 组件中定义的
  if (rawProps) {
    for (const key in rawProps) {
      // 用所有的来分裂
      const value = rawProps[key] // value String | number 应该对props作校验
      if (key in propsOptions) {
        // propsOptions[key]
        props[key] = value
      }
      else {
        attrs[key] = value
      }
    }
  }

  instance.props = reactive(props)
  instance.attrs = attrs
}

const publicProperty = {
  $attrs: instance => instance.attrs,
  $slots: instance => instance.slots,
}

const handler = {
  get(target, key) {
    const { data, props, setupState } = target

    if (data && hasOwn(data, key)) {
      return data[key]
    }
    else if (props && hasOwn(props, key)) {
      return props[key]
    }
    else if (setupState && hasOwn(setupState, key)) {
      return setupState[key]
    }

    // 对于一些无法修改的属性 $slots $attrs $slots => instance.slots
    const getter = publicProperty[key] // 通过不同的策略来访问对应的方法
    if (getter) {
      return getter(target)
    }
  },
  set(target, key, value) {
    const { data, props, setupState } = target
    if (data && hasOwn(data, key)) {
      data[key] = value
    }
    else if (props && hasOwn(props, key)) {
      props[key] = value
      console.warn('props is readonly')
    }
    else if (setupState && hasOwn(setupState, key)) {
      setupState[key] = value
    }
    return true
  },
}

export function initSlots(instance, children) {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    instance.slots = children
  }
  else {
    instance.slots = {}
  }
}
export function setupComponent(instance) {
  const { vnode } = instance
  initProps(instance, vnode.props)
  initSlots(instance, vnode.children)

  instance.proxy = new Proxy(instance, handler)

  const { data = () => ({}), render, setup } = vnode.type

  if (setup) {
    const setupContext = {
      slots: instance.slots,
      attrs: instance.attrs,
      emit(event, ...payload) {
        const eventName = `on${event[0].toUpperCase() + event.slice(1)}`

        const handler = instance.vnode.props[eventName]

        handler(...payload)
      },
      expose: (value) => {
        instance.exposed = value
      },
    }
    const setupResult = setup(instance.props, setupContext)
    if (isFunction(setupResult)) {
      instance.render = setupResult
    }
    else {
      instance.setupState = proxyRefs(setupResult) // 将返回值脱ref
    }
  }

  if (!isFunction(data)) {
    console.warn('data should be a function')
  }
  else {
    // data中可以拿到props
    instance.data = reactive(data.call(instance.proxy))
  }

  if (!instance.render) // 没有render用自己的render
    instance.render = render
}
