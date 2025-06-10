export default function patchClass(el, value) {
  if(value === null){
    // 移除class
    el.removeAttribute()
  }else{
    el.className = value
  }
}

