import { isObject } from "@vue/shared";
import { track, trigger } from "./reactiveEffect";
import { reactive } from "./reactive";
import { ReactiveFlags } from "./constants";


// proxy 需要搭配 reflect 来使用
export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // 当取值的时候 应该让响应式属性 和 effect 映射起来

    // 依赖收集

    track(target, key); // 收集这个对象上的这个属性 和effect关联在一起

    let res = Reflect.get(target, key, recevier);

    if(isObject(res)){ // 递归代理
      return reactive(res)
    }

    return res
  },
  set(target, key, value, recevier) {
    // 找到属性 让对应的effect重新执行

    let oldValue = target[key];

    let result = Reflect.set(target, key, value, recevier);

    if (oldValue !== value) {
      // 触发更新
      trigger(target, key, value, oldValue);
    }

    return result;
  },
};
