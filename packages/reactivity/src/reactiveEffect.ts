import { activeEffect } from "./effect";

const targetMap = new WeakMap() // 存放依赖收集的关系
export function track(target, key) {
// activeEffect 有这个说明实在effect中访问的 没有说明在effect之外进行访问 不需要进行收集
  if(activeEffect) {
    console.log(key, activeEffect)

    let depsMap = targetMap.get(target)
    if(!depsMap){ // 新增的
        targetMap.set(target, (depsMap = new Map()))
    }
    console.log(targetMap)
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