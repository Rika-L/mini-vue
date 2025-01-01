export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }

    // 当取值的时候应该让响应式属性和effect关联起来

    // TODO: 依赖收集
    return Reflect.get(target, key, recevier)
  },
  set(target, key, value, recevier) {
    // 找到属性让对应的effect重新执行

    // TODO: 触发更新
    Reflect.set(target, key, value, recevier)
    return true
  },
}
