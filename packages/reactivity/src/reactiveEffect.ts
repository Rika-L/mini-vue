import { activeEffect, trackEffect, triggerEffects } from './effect'

export function createDep(cleanup, key) {
  const dep = new Map() as any
  dep.cleanup = cleanup
  dep.name = key // 自定义的 为了表示这个映射表是给哪个属性服务的
  return dep
}

const targetMap = new WeakMap() // 存放依赖收集的关系
export function track(target, key) {
  // activeEffect 有这个说明实在effect中访问的 没有说明在effect之外进行访问 不需要进行收集
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      // 新增的
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = createDep(() => depsMap.delete(key), key))) // 后面用于清理不需要的属性
    }
    trackEffect(activeEffect, dep) // 将当前的effect放入到dep中 后续可以根据值的变化触发此dep中存放的effect
  }
}

export function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // 找不到对象直接return
    return
  }
  const dep = depsMap.get(key)
  if (dep) {
    // 修改属性对应了effect
    triggerEffects(dep)
  }
}

// map
/* {
  {name: 'rika', age:21}: {
    age: {
      effect1, effect2
    },
    name: {
      effect1
    }
  }
} */
