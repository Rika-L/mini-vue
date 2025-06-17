function createInvoker(value) {
  const invoker = e => invoker.value(e)
  invoker.value = value // 更改invoker中的value可以修改对应的调用函数
  return invoker
}

export default function patchEvent(el, name, nextValue) {
  // vue_event_invoker
  const invokers = el._vei || (el._vei = {})

  const eventName = name.slice(2).toLowerCase()

  const existingInvokers = invokers[name] // 是否存在同名事件绑定

  if (nextValue && existingInvokers) {
    return existingInvokers.value = nextValue // 时间换绑
  }

  if (nextValue) {
    const invoker = (invokers[name] = createInvoker(nextValue)) // 创建一个调用函数 并且内部会执行nextValue
    return el.addEventListener(eventName, invoker)
  }
  if (existingInvokers) {
    // 现在没有 以前有
    el.removeEventListener(eventName, existingInvokers)
    invokers[name] = undefined
  }
}
