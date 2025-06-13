import { ShapeFlags } from "@vue/shared";
import { isSameVnode } from "./h";

export function createRenderer(renderOptions) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp,
  } = renderOptions;

  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      // children[i]可能是纯文本 此时会出bug，暂不考虑
      patch(null, children[i], container);
    }
  };

  const mountElement = (vnode, container) => {
    const { type, children, props, shapeFlag } = vnode;
    // 第一次渲染的时候让虚拟节点和真实dom创建管理
    // 第二次渲染新的vnode 可以和上一次的vnode做比对 之后更新el元素可以后续再复用这个dom
    let el = (vnode.el = hostCreateElement(type));

    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) hostSetElementText(el, children);
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) mountChildren(children, el);

    hostInsert(el, container);
  };

  const processElement = (n1, n2, container) => {
    if (n1 === null) {
      // 初始化操作
      mountElement(n2, container);
    } else {
      patchElement(n1, n2, container);
    }
  };

  const patchProps = (oldProps, newProps, el) => {
    // 新的要全部生效
    for (let key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }
    // 删除旧的属性
    for (let key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  };

  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i]);
    }
  };

  const patchChildren = (n1, n2, el) => {
    // text array null
    const c1 = n1.children;
    const c2 = n2.children;

    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新的是文本 老的是数组 移除老的
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(el, c2);
      }
    }else {
      if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 全量diff 算法 两个数组比对
        }else {
          unmountChildren(c1)
        }
      }else{
        if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, "");
        }

        if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el);
        }
      }
    }
  };

  const patchElement = (n1, n2, container) => {
    // 1.比较元素的差异 肯定需要复用dom元素
    // 2.比较属性的差异
    let el = (n2.el = n1.el); // 对dom元素的复用

    let oldProps = n1.props || {};
    let newProps = n2.props || {};
    patchProps(oldProps, newProps, el);

    patchChildren(n1, n2, el);
  };

  // 渲染走这里，更新也走这里
  const patch = (n1, n2, container) => {
    if (n1 === n2) return; // 两次渲染同一个元素，直接跳过即可

    // 不是相同节点
    if (n1 && !isSameVnode(n1, n2)) {
      // 删掉n1换n2
      unmount(n1);
      n1 = null; // 就会执行n2的初始化
      // 直接移除老dom元素
    }

    // n1.shapeFlag
    processElement(n1, n2, container); // 对元素处理
  };

  const unmount = (vnode) => {
    hostRemove(vnode.el);
  };

  // 多次调用render会进行虚拟节点的比较 再进行更新
  const render = (vnode, container) => {
    if (vnode == null) {
      // 移除当前容器的dom元素
      if (container._vnode) {
        unmount(container._vnode);
      }
    } else {
      // 将虚拟节点变成真实节点进行渲染
      patch(container._vnode || null, vnode, container);
      container._vnode = vnode;
    }
  };
  return {
    render,
  };
}
