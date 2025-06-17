import { createRenderer } from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import patchProp from './patchProp'

// 将节点操作和属性操作合并
const renderOptions = Object.assign({ patchProp }, nodeOps)

export function render(vnode, container) {
  return createRenderer(renderOptions).render(vnode, container)
}

export * from '@vue/runtime-core'
