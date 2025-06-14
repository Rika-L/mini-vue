// h具有多种重载

import { isObject } from "@vue/shared";
import { createVnode, isVnode } from "./createVnode";

// 参数可以有 1(类型),2(类型,属性/儿子),3(标准的) 或 更多个(从第三个开始都是儿子)
// h(类型, 属性, 儿子)
// h(类型, 儿子)

// 1两个参数 第二个参数可能是属性 或者虚拟节点
// 2 第二个参数是一个数组
// 3 其他情况就是属性
// 4 直接传递非对象文本
// 5 不能出现三个参数的时候 第二个不是属性
// 6 如果超过三个参数 后面的都是儿子

export function h(type, propsOrChildren?, children?) {
  let l = arguments.length;

  if (l === 2) {
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      // 虚拟节点
      if (isVnode(propsOrChildren)) {
        // h("div", h("a"))
        return createVnode(type, null, [propsOrChildren]);
      } else {
        // 属性
        return createVnode(type, propsOrChildren);
      }
    }
    return createVnode(type, null, propsOrChildren);
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2);
    }
    if (l === 3 && isVnode(children)) {
      children = [children];
    }
    // == 3 | == 1

    return createVnode(type, propsOrChildren, children);
  }
}


