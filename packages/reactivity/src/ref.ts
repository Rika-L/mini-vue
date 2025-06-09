import { activeEffect, trackEffect, triggerEffects } from "./effect";
import { toReactive } from "./reactive";
import { createDep } from "./reactiveEffect";

export function ref(value) {
  return createRef(value);
}

function createRef(value) {
  return new RefImpl(value);
}

class RefImpl {
  public __v_isRef = true; // 增加ref标识
  public _value; // 用来保存ref的值
  public dep; // 用于收集对应的effect
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (newValue !== this.rawValue) {
      this.rawValue = newValue; // 更新值
      this._value = newValue;
      triggerRefValue(this);
    }
  }
}

function trackRefValue(ref) {
  if (activeEffect) {
    trackEffect(
      activeEffect,
      ref.dep = createDep(() => (ref.dep = undefined), "undefined")
    );
  }
}

function triggerRefValue(ref) {
  let dep = ref.dep;
  console.log(dep);
  if (dep) {
    triggerEffects(dep);
  }
}

export function isRef(value) {
  return !!value.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

class ObjectRefImpl {
  public __v_isRef = true; // 增加ref标识
  constructor(public _object, public _key) {}
  get value(){
    return this._object[this._key]
  }
  set value(newValue){
    this._object[this._key] = newValue
  }
}

export function toRef(object, key){
  return new ObjectRefImpl(object, key)
}

export function toRefs(object) {
  const ret = {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret as any;
}