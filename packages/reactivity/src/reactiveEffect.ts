import { activeEffect } from './effect'

export function track(target, key) {
  // activeEffect 有这个属性说明这个key是在effect中使用的
  // 如果没有这个属性说明这个key是在effect之外使用的
  // 不用进行收集

  if (activeEffect === undefined) {
    return
  }
  console.log('track', key)
}
