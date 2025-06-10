export default function patchStyle(el, prevValue, nextValue){
  let style = el.style
  for(let key in nextValue) {
    style[key] = nextValue[key]
  }

  if(prevValue) {
    for(let key in prevValue) {
      // 看以前的属性现在有没有，没用则删除
      if(nextValue[key] === null){
        style[key] = null
      }
    }
  }
}