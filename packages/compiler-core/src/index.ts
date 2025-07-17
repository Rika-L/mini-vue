import { PatchFlags } from '@vue/shared'
import { createCallExpression, NodeTypes } from './ast'
import { parse } from './parser'
import { TO_DISPLAY_STRING } from './runtimeHelper'

// dom 的遍历方式 先序 后续
function transformElement(node, context) {
  if (NodeTypes.ELEMENT === node.type) {
    console.log('处理元素')

    return function () {
      console.log('元素处理后触发')
    }
  }
}

function isText(node) {
  return node.type === NodeTypes.INTERPOLATION || node.type === NodeTypes.TEXT
}

function transformText(node, context) {
  if (NodeTypes.ELEMENT === node.type || node.type === NodeTypes.ROOT) {
    // 注意处理顺序 要等待子节点全部处理后再赋值给父元素
    return function () {
      const children = node.children

      let container = null

      let hasText = false
      for (let i = 0; i < children.length; i++) {
        const child = children[i]

        if (isText(child)) {
          hasText = true
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j]
            if (isText(next)) {
              if (!container) {
                container = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child],
                }
              }
              container.children.push('+', next)
              children.splice(j, 1)
              j-- // 删除后需要回退
            }
            else {
              container = null // 重置
              break
            }
          }
        }
      }
      // 需要看一下文本节点是不是只有一个 只有一个不需要createTextVnode

      if(!hasText || children.length === 1) {
        return
      }

      // createTextVnode

      for(let i = 0; i < children.length; i++){
        const child = children[i]
        if(isText(child) || child.type === NodeTypes.COMPOUND_EXPRESSION) {
          const args = []
          args.push(child)

          if(child.type === NodeTypes.TEXT) {
            args.push(PatchFlags.TEXT)
          }

          children[i] = {
            type: NodeTypes.TEXT_CALL, // createTextVnode
            content: child,
            codegenNode: createCallExpression(context,args)// createCallExpression
          }
          
        }
      }
    }
  }
}

function transformExpression(node, context) {
  if (NodeTypes.INTERPOLATION === node.type) {
    node.content.content = `_ctx.${node.content.content}`
  }
}

function createTransformContext(root) {
  const context = {
    currentNode: root,
    parent: null,
    transformNode: [transformElement, transformText, transformExpression],
    helpers: new Map(), // 记录方法使用的次数
    helper(name) {
      const count = context.helpers.get(name) || 0
      context.helpers.set(name, count + 1)
      return name
    },
  }
  return context
}

function traverseNode(node, context) {
  context.currentNode = node
  const transforms = context.transformNode

  const exits = [] // 元素函数 文本函数 表达式函数
  for (let i = 0; i < transforms.length; i++) {
    const exit = transforms[i](node, context)
    exit && exits.push(exit)
  }

  switch (node.type) {
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      for (let i = 0; i < node.children.length; i++) {
        context.parent = node
        traverseNode(node.children[i], context)
      }
      break
      // 对表达式进行处理
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break
  }

  context.currentNode = node // 因为 traverseNode 是递归的，所以需要在每次递归结束后重置 currentNode

  let i = exits.length

  if (i > 0) {
    while (i--) {
      exits[i]()
    }
  }
}

function transform(ast) {
  // 对语法树进行遍历
  const context = createTransformContext(ast)

  traverseNode(ast, context)

  ast.helpers = [...context.helpers.keys()]
}

function compile(template) {
  const ast = parse(template)

  console.log(ast)
  // 代码转化
  transform(ast)
}

export { compile, parse }
