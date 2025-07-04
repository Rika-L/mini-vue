import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandler'
import { ReactiveFlags } from './constants'

// 用于记录代理后的结果，可以复用
const reactiveMap = new WeakMap()

function createReactiveObject(target) {
  // 统一做判断 响应式对象必须是对象才可以
  if (!isObject(target)) {
    return target
  }

  // 如果是响应式对象 则不代理 直接返回
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 取缓存 如果有直接返回
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

export function toReactive(value) {
  return isObject(value) ? reactive(value) : value
}

export function isReactive(value) {
  return value && value[ReactiveFlags.IS_REACTIVE]
}
