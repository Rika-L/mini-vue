import { activeEffect, trackEffect, triggerEffects } from './effect'

export function createDep(cleanup, key) {
  const dep = new Map() as any
  dep.cleanup = cleanup
  dep.name = key
  return dep
}

const targetMap = new WeakMap() // 存放依赖收集的关系
export function track(target, key) {
  // activeEffect 有这个属性说明这个key是在effect中使用的
  // 如果没有这个属性说明这个key是在effect之外使用的
  // 不用进行收集
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) { // 如果是新增的依赖,先创建一个新map
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, dep = createDep(() => {
        depsMap.delete(key)
      }, key)) // 后面用于清理不需要的属性
    }
    trackEffect(activeEffect, dep) // 将当前的effect放入dep中。后续可以根据值得变化触发此dep中存放的effect
  }
}

export function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) { // 找不到对象，直接return即可
    return
  }
  const dep = depsMap.get(key)
  if (dep) {
    // 修改的属性对应了effect
    triggerEffects(dep)
  }
}

// Map
// {
//   {name:'rika',age:18}:{
//     age:{
//       effect
//     },
//     name:{
//       effect,
//       effect
//     }
//   }
// }
