import { isObject, isString, ShapeFlags } from "@vue/shared";

export const Text = Symbol("Text");
export const Fragment = Symbol("Fragment");

export function createVnode(type, props, children?) {
  // 如果是字符串就是元素
  // 如果是对象就是vue组件
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;
  const vnode = {
    __v_isVnode: true,
    type,
    props,
    children,
    key: props?.key, // diff算法需要的key
    el: null, // 虚拟节点需要对应的真实节点
    shapeFlag,
  };

  if (children) {
    if (Array.isArray(children)) {
      vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    } else {
      children = String(children);
      vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
  }

  return vnode;
}

export function isVnode(value) {
  return value?.__v_isVnode;
}

export function isSameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
