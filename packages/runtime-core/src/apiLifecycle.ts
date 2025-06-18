import { currentInstance, setCurrentInstance, unsetCurrentInstance } from './component'

export enum LifeCycles {
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATE = 'u',
  BEFORE_UNMOUNT = 'bum',
  UNMOUNTED = 'um',
}

function createHook(type) {
  // 将当前的实例存到了此钩子上
  return (hook, target = currentInstance) => {
    if (target) {
      // 当前钩子是在组件中运行的
      // 看当前钩子是否存放过 // 发布订阅
      const hooks = target[type] || (target[type] = [])

      // 让currentInstance存到这个函数里面
      const wrapHook = () => {
        // 在钩子执行前对实例进行矫正
        setCurrentInstance(target)
        hook.call(target)
        unsetCurrentInstance()
      }

      // 在执行函数内部保证实例是正确的
      hooks.push(wrapHook) // setup执行完毕就会把instance清空 所以有坑
    }
  }
}

export const onBeforeMount = createHook(LifeCycles.BEFORE_MOUNT)
export const onMounted = createHook(LifeCycles.MOUNTED)
export const onBeforeUpdate = createHook(LifeCycles.BEFORE_UPDATE)
export const onUpdate = createHook(LifeCycles.UPDATE)
export const onBeforeUnmount = createHook(LifeCycles.BEFORE_UNMOUNT)
export const onUnmounted = createHook(LifeCycles.UNMOUNTED)

export function invokeArray(fns) {
  fns.forEach(fn => fn())
}
