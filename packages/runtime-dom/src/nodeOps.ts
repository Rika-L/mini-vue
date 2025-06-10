// 主要是对节点元素的增删改查

export const nodeOps = {
  // 如果第三个元素不传递 等价于appendChild
  insert(el, parent, anchor) {
    parent.insertBefore(el, anchor || null);
  },

  remove(el) {
    const parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  },
  createElement(type) {
    return document.createElement(type);
  },
  createText(text) {
    return document.createTextNode(text);
  },
  setText(node, text) {
    node.nodeValue = text;
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  parentNode(node) {
    return node.parentNode;
  },
  nextSibling(node) {
    return node.nextSibling;
  },
};
