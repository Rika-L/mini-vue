export function effect(fn, options?) {
  // 创建一个响应式effect 数据变量后可以重新执行

  // 只要依赖的属性变化了就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run()
  })
  _effect.run()
}

export let activeEffect

class ReactiveEffect {
  _trackId = 0 // 用于记录当前effect执行了几次
  deps = [] // 用于存放effect中用到的属性
  _depsLength = 0 // 用于记录deps的长度
  public active = true // 创建的effect是响应式的
  // fn 用户编写的函数
  // 如果fn依赖的数据变化后，需要重新调用scheduler
  constructor(public fn, public scheduler) {

  }

  run() {
    // 让fn执行
    if (!this.active) {
      return this.fn() // 如果不是响应式的effect 直接执行
    }
    const lastEffect = activeEffect
    try {
      activeEffect = this
      return this.fn()
    }
    finally {
      activeEffect = lastEffect
    }
  }
}

export function trackEffect(effect, dep) {
  dep.set(effect, effect._trackId)
  // 让effect和dep关联起来
  effect.deps[effect._depsLength++] = dep
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler() // => effect.run
    }
  }
}
