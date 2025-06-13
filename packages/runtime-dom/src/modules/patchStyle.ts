export default function patchStyle(el, prevValue, nextValue) {
  // 如果没有nextValue 则删除props
  if(!nextValue) {
    el.removeAttribute("style");
    return
  }

  let style = el.style;
  for (let key in nextValue) {
    style[key] = nextValue[key];
  }

  if (prevValue) {
    for (let key in prevValue) {
      // 看以前的属性现在有没有，没用则删除
      if (nextValue) {
        if (nextValue[key] == null) {
          style[key] = null;
        }
      }
    }
  }
}
