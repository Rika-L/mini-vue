import { isObject } from '@vue/shared'
import { mutableHandlers, ReactiveFlags } from './baseHandler'

// 用于记录代理后的结果，可以复用
const reactiveMap = new WeakMap()

function createReactiveObject(target) {
  // 统一做判断响应式对象必须是对象
  if (!isObject(target)) {
    return target
  }

  // 如果对象已经是响应式对象，就直接返回
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 如果对象已经被代理过了，就直接返回
  const exitsProxy = reactiveMap.get(target)
  if (exitsProxy) {
    return exitsProxy
  }
  const proxy = new Proxy(target, mutableHandlers)
  // 根据对象缓存代理后的结果
  reactiveMap.set(target, proxy)
  return proxy
}

export function reactive(target) {
  return createReactiveObject(target)
}
