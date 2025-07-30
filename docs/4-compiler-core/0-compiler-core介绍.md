# compiler-core 介绍

`compiler-core` 是 `vue` 的编译器核心部分，主要负责将模板编译成渲染函数。

## 主要流程

1. **模板解析**：将模板字符串解析成抽象语法树（AST）。 template -> AST
2. **代码转化**：将 `AST`转化为 code gen node 。 AST -> code gen node
3. **代码生成**：将 code gen node 生成渲染函数。 code gen node -> render function

:::tip
这一部分的代码比较细碎，主要为了了解 `vue` 的编译器是如何工作的，实际使用中不需要深入了解。
:::
