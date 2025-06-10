// 本来watch应该在runtime-core下的 现在写在这边

import { isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";

export function watch(source, cb, options = {} as any) {
  return doWatch(source, cb, options);
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

function doWatch(source, cb, { deep }) {
  // source => getter?
  // 产生一个可以给ReactiveEffect来使用的getter 需要对这个对象进行取值操作 会关联当前的reactiveEffect
  const reactiveGetter = (source) =>
    traverse(source, deep === false ? 1 : undefined);
  let getter = () => reactiveGetter(source);
  let oldValue;

  const job = () => {
    const newValue = effect.run();
    cb(newValue, oldValue);
    oldValue = newValue;
  };

  const effect = new ReactiveEffect(getter, job);

  oldValue = effect.run();

}
