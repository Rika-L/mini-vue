# runtime-dom

`runtime-dom`是针对浏览器的运行时, 包括dom操作和属性操作并导出一个预设的`render`函数

## patchEvent 中的事件换绑

在`patchEvent`中, 初次传入事件时, 会创建一个调用函数`invoker`, 并绑定在元素的`_vei`(vue_event_invoker)属性中, 该函数有一个`value`属性, 作为函数调用的时候, 会执行`value`属性对应的函数. 初次调用会将这个`invoker`绑定到元素相应的事件监听器

在事件更新中, 会先判断`el`的`_vei`中是否有事件名相对应的`invoker`, 如果有, 会将该`invoker`的`value`属性替换为新的函数, 实现事件换绑, 而不是重新绑定事件,减少性能消耗

在事件移除中,  会将该`invoker`从`_vei`中删除, 并且调用`removeEventListener`方法移除事件
