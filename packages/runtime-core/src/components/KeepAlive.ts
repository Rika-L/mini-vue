import { ShapeFlags } from '@vue/shared'
import { onMounted, onUpdated } from '../apiLifecycle'
import { getCurrentInstance } from '../component'

export const KeepAlive = {
  __isKeepAlive: true,
  props: {
    max: Number, // LRU缓存算法
  },
  setup(props, { slots }) {
    const { max } = props
    const keys = new Set() // 用来记录哪些组件缓存过
    const cache = new Map() // 缓存表

    let pendingCacheKey = null
    const instance = getCurrentInstance()

    const cacheSubTree = () => {
      cache.set(pendingCacheKey, instance.subTree) // 缓存组件的虚拟节点 里面有组件的dom元素
    }

    // keepalive特有的初始化方法
    // 激活时执行

    const { move, createElement, unmount: _unmount } = instance.ctx.renderer

    function reset(vnode) {
      vnode.shapeFlag &= ~ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
      vnode.shapeFlag &= ~ShapeFlags.COMPONENT_KEPT_ALIVE
    }

    function unmount(vnode) {
      reset(vnode) // 重置标识
      _unmount(vnode)
    }

    const pruneCacheEntry = (key) => {

      const cached = cache.get(key)

      // 真正删除掉dom

      // 还原vnode上的标识 否则无法走移除逻辑
      unmount(cached)

      keys.delete(key)
      cache.delete(key)
    }
    instance.ctx.activate = function (vnode, container, anchor) {
      move(vnode, container, anchor) // 将元素直接移入到容器中
    }

    const storageContent = createElement('div')
    // 卸载时执行
    instance.ctx.deactivate = function (vnode) {
      move(vnode, storageContent, null) // 将dom元素临时移动到这个div中 但是没有被销毁
    }

    onMounted(() => {
      cacheSubTree()
    })

    onUpdated(() => {
      cacheSubTree()
    })

    return () => {
      const vnode = slots.default()

      // 在这个组件中需要一些dom方法可以将元素移动到一个div中
      // 还可以卸载某个元素

      const comp = vnode.type

      const key = vnode.key == null ? comp : vnode.key

      const cacheVNode = cache.get(key)
      pendingCacheKey = key
      if (cacheVNode) {
        vnode.component = cacheVNode.component // 不创建新的组件，直接复用缓存的组件
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE // 告诉他不需要做初始化操作
        keys.delete(key)
        keys.add(key) // 刷新缓存
      }
      else {
        keys.add(key)
        if (max && keys.size > max) {
          // 说明达到最大的缓存个数
          // 获取set中的第一个元素
          pruneCacheEntry(keys.values().next().value)
        }
      }

      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE // 这个组件不需要真的卸载 卸载的元素临时放到存储器中
      return vnode // 等待组件加载完毕后再去缓存
    }
  },
}
export const isKeepAlive = value => value.type.__isKeepAlive
