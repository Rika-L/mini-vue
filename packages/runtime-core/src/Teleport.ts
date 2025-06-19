import { ShapeFlags } from "@vue/shared"

export const Teleport = {
  __isTeleport: true,
  remove(vnode, unmountChildren) {
    
    const {shapeFlag, children} = vnode

    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      unmountChildren(children)
    }
  },
  process: (n1, n2, container, anchor, parentComponent, internals) => {
    const { mountChildren, patchChildren, move } = internals

    // 看n1 n2 的关系
    if (!n1) {
      const target = document.querySelector(n2.props.to)
      if (target) {
        mountChildren(n2.children, n2.target = target, anchor, parentComponent)
      }
    }
    else {
      patchChildren(n1, n2, n2.target, anchor, parentComponent)

      if(n2.props.to !== n1.props.to) {
        const nextTarget = document.querySelector(n2.props.to)

        n2.children.forEach(child => move(child, nextTarget, anchor))
      }
    }
  },
}

export const isTeleport = type => type.__isTeleport
