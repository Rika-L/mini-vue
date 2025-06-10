import { isFunction } from "@vue/shared";
import { ReactiveEffect, effect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";

class ComputedRefImpl {
  public _value;
  public effect;
  public dep
  constructor(getter, public setter) {
    // 需要创建一个effect来管理当前计算属性的dirty
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        // 计算属性依赖的值变化后应该触发渲染
        triggerRefValue(this); // 依赖的属性变化后 还要将dirty设置为脏
      }
    );
  }
  get value() {
    // 需要做额外处理 防止重复计算
    if(this.effect.dirty) { // 默认取值一定是脏的 但是执行一次后就不脏了
    this._value = this.effect.run();

    trackRefValue(this)
    // 如果当前在effect中访问了计算属性 计算属性是可以收集这个effect的
    }
    return this._value
  }
  set value(v){ // 这个就是ref的setter
    this.setter(v)
  }
}

export function computed(getterOrOptions) {
  let onlyGetter = isFunction(getterOrOptions);

  let getter;
  let setter;

  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {};
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new ComputedRefImpl(getter, setter);
}

// 计算属性实现的几个步骤：

// 1. 计算属性维护了一个dirty属性 默认是true 稍后运行过一次会将 dirty 变成 false 并且稍后依赖的值变化后会再次让 dirty 变成 true
// 2. 计算属性也是一个effect 依赖的属性会收集这个计算属性 当前值变化后 会让computedEffect里的dirty变为true
// 3. 计算属性具备依赖收集能力 可以收集对应的 effect 依赖的值变化后会触发effect重新执行
