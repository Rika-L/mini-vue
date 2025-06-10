// 本来watch应该在runtime-core下的 现在写在这边

import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isRef } from "./ref";

export function watch(source, cb, options = {} as any) {
  return doWatch(source, cb, options);
}

export function watchEffect(source, options = {} as any) {
  return doWatch(source, null, options);
}

// 控制depth已经当前遍历到了哪一层
function traverse(source, depth, currentDepth = 0, seen = new Set()) {
  if (!isObject(source)) {
    return source;
  }
  if (depth) {
    if (currentDepth >= depth) {
      return source;
    }
    currentDepth++;
  }
  if (seen.has(source)) {
    return source;
  }
  for (let key in source) {
    traverse(source[key], depth, currentDepth, seen);
  }
  return source;
}

function doWatch(source, cb, { deep, immediate } = {} as any) {
  console.log(isFunction(source));
  // source => getter?
  // 产生一个可以给ReactiveEffect来使用的getter 需要对这个对象进行取值操作 会关联当前的reactiveEffect
  const reactiveGetter = (source) =>
    traverse(source, deep === false ? 1 : undefined);
  let getter;
  if (isReactive(source)) {
    // 是响应式对象
    getter = () => reactiveGetter(source);
  } else if (isRef(source)) {
    getter = () => source.value;
  

  } else if (isFunction(source)) {
    getter = source;
  }
  let oldValue;

  let clean

  const onCleanup = (fn) => {
    clean = () => {
      fn()
      clean = undefined
    }
  }

  const job = () => {
    if (cb) {
      const newValue = effect.run();
      cb(newValue, oldValue, onCleanup);
    
      if (clean) {
        clean() // 在执行回调前先调用上一次的清理操作 进行清理
      }

      oldValue = newValue;
    }else{
      effect.run();
    }
  };

  const effect = new ReactiveEffect(getter, job);

  if (cb) {
    if (immediate) {
      // 立即执行一次用户的回调
      job();
    } else {
      oldValue = effect.run();
    }
  } else {
    // watchEffect
    effect.run(); // 直接执行即可
  }

  const unwatch = () => {
    effect.stop()
  }

  return unwatch
}
