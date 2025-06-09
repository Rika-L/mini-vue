import { activeEffect } from "./effect";
import { track } from "./reactiveEffect";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

// proxy 需要搭配 reflect 来使用
export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
  // 当取值的时候 应该让响应式属性 和 effect 映射起来


  // 依赖收集

  track(target, key); // 收集这个对象上的这个属性 和effect关联在一起

  return Reflect.get(target, key, recevier)
  },
  set(target, key, value, recevier) {
    // 找到属性 让对应的effect重新执行


    // 触发更新
    
    return Reflect.set(target, key, value, recevier);
  },
};
