import { currentInstance } from './component'

export function provide(key, value) {
  // 子用的是父 子提供了属性
  // 子提供的新属性应该和父亲没关系

  if (!currentInstance)
    return // 建立在组件基础上的
  const parentProvide = currentInstance.parent?.provides

  let provides = currentInstance.provides

  if (parentProvide === provides) {
    // 如果在子组件上新增了provides要拷贝一份全新的
    provides = currentInstance.provides = Object.create(provides)
  }

  provides[key] = value
}

export function inject(key, defaultValue?) {
  if (!currentInstance)
    return
  const provides = currentInstance.parent?.provides

  if (provides && key in provides) {
    return provides[key] // 从provide中取出来使用
  }
  else {
    return defaultValue // 默认值
  }
}
