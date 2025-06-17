const queue: any[] = [] // 微任务队列

const p = Promise.resolve()
let isFlushPending = false

// p是当前的微任务队列 nextTick 中传入fn会在组件更新时执行
// 另一种常用方法 await nextTick 会等待组件更新
export function nextTick(fn?) {
  return fn ? p.then(fn) : p
}

export function queueJob(job) {
  if (!queue.includes(job)) { // 对任务去重 如果是重复的任务则不放入微任务队列中
    queue.push(job)
    // 执行所有的 job
    queueFlush() // 执行所有任务
  }
}

function queueFlush() {
  // 如果同时触发了两个组件的更新的话
  // 这里就会触发两次 then （微任务逻辑）
  // 但是着是没有必要的
  // 我们只需要触发一次即可处理完所有的 job 调用
  // 所以需要判断一下 如果已经触发过 nextTick 了
  // 那么后面就不需要再次触发一次 nextTick 逻辑了
  if (isFlushPending)
    return
  isFlushPending = true
  nextTick(flushJobs)
}

function flushJobs() {
  isFlushPending = false
  // 执行更新方法

  // 这里是执行 queueJob 的
  // 比如 render 渲染就是属于这个类型的 job
  let job
  while (job = queue.shift()) {
    job()
  }
}
