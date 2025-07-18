import { PatchFlags } from '@vue/shared'
import { createCallExpression, createObjectExpression, createVnodeCall, NodeTypes } from './ast'
import { parse } from './parser'
import { CREATE_ELEMENT_BLOCK, CREATE_ELEMENT_VNODE, Fragment, OPEN_BLOCK, TO_DISPLAY_STRING } from './runtimeHelper'

// dom 的遍历方式 先序 后续
function transformElement(node, context) {
  if (NodeTypes.ELEMENT === node.type) {
    return function () {
      const { tag, props, children } = node
      const vnodeTag = tag // createElementVNode(div)
      const properties = []
      for (let i = 0; i < props.length; i++) {
        properties.push({ key: props[i].name, value: props[i].value })
      }
      const propsExpression
        = properties.length > 0 ? createObjectExpression(properties) : null

      let vnodeChildren = null
      if (children.length === 1) {
        vnodeChildren = children[0]
      }
      else if (children.length > 1) {
        vnodeChildren = children
      }

      node.codegenNode = createVnodeCall(context, vnodeTag, propsExpression, vnodeChildren)
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

      if (!hasText || children.length === 1) {
        return
      }

      // createTextVnode

      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (isText(child) || child.type === NodeTypes.COMPOUND_EXPRESSION) {
          const args = []
          args.push(child)

          if (child.type === NodeTypes.TEXT) {
            args.push(PatchFlags.TEXT)
          }

          children[i] = {
            type: NodeTypes.TEXT_CALL, // createTextVnode
            content: child,
            codegenNode: createCallExpression(context, args), // createCallExpression
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
    removeHelper(name) {
      const count = context.helpers.get(name)

      if (count) {
        const c = count - 1

        if (!c) {
          context.helpers.delete(name)
        }
        else {
          context.helpers.set(name, c)
        }
      }
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

function createRootCodegenNode(ast, context) {
  const { children } = ast
  if (children.length === 1) {
    const child = children[0]
    if (child.type === NodeTypes.ELEMENT) {
      ast.codegenNode = child.codegenNode
      context.removeHelper(CREATE_ELEMENT_VNODE)
      context.helper(CREATE_ELEMENT_BLOCK)
      context.helper(OPEN_BLOCK)
      ast.codegenNode.isBlock = true // 需要创建一个块
    }
    else {
      ast.codegenNode = child
    }
  }
  else {
    ast.codegenNode = createVnodeCall(context, context.helper(Fragment), undefined, children)

    context.helper(CREATE_ELEMENT_BLOCK)
    context.helper(OPEN_BLOCK)
  }
}

function transform(ast) {
  // 对语法树进行遍历
  const context = createTransformContext(ast)

  traverseNode(ast, context)

  // 对根节点做处理 1 文本 2 一个元素 3 多个元素

  createRootCodegenNode(ast, context)

  ast.helpers = [...context.helpers.keys()]
}

function compile(template) {
  const ast = parse(template)

  // 代码转化
  transform(ast)
}

export { compile, parse }
