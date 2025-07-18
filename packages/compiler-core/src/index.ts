import { NodeTypes } from './ast'
import { parse } from './parser'
import { CREATE_ELEMENT_BLOCK, CREATE_ELEMENT_VNODE, helperNameMap, OPEN_BLOCK, TO_DISPLAY_STRING } from './runtimeHelper'
import { transform } from './transform'

function createCodegenContext(ast) {
  const context = {
    code: ``,
    level: 0,
    helper(name) {
      return `_${helperNameMap[name]}`
    },
    push(code) {
      context.code += code
    },
    indent() {
      newLine(++context.level)
    },
    deindent(noNewLine?) {
      if (noNewLine)
        --context.level
      else
        newLine(--context.level)
    },
    newLine() {
      newLine(context.level)
    },
  }
  function newLine(n) {
    context.push(`\n${'  '.repeat(n)}`)
  }

  return context
}

function genFunctionPreamble(ast, context) {
  const { push, indent, deindent, newLine } = context

  if (ast.helpers.length > 0) {
    push(`const {${ast.helpers.map(item => `${helperNameMap[item]}:${context.helper(item)}`)}} = Vue`)
  }

  newLine()
  push(`return function render(_ctx) {`)
}

function genText(node, context) {
  context.push(JSON.stringify(node.content))
}

function genInterpolation(node, context) {
  const { push, indent, deindent, newLine, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(')')
}

function genExpression(node, context) {
  context.push(node.content)
}

function genVnodeCall(node, context) {
  const { push, indent, deindent, newLine, helper } = context
  const { tag, props, children, isBlock } = node
  if (isBlock) {
    push(`(${helper(OPEN_BLOCK)}(),`)
  }

  const h = isBlock ? CREATE_ELEMENT_BLOCK : CREATE_ELEMENT_VNODE
  push(`${helper(h)}(`)

  if (isBlock)
    push(')')
  push(')')
}

function genNode(node, context) {
  const { push, indent, deindent, newLine } = context

  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    case NodeTypes.VNODE_CALL:
      genVnodeCall(node, context)
      break
  }
}

function generate(ast) {
  const context = createCodegenContext(ast)
  const { push, indent, deindent, newLine } = context

  genFunctionPreamble(ast, context)

  indent()
  push(`return `)

  if (ast.codegenNode) {
    genNode(ast.codegenNode, context)
  }
  else {
    push(`null`)
  }
  deindent()
  push(`}`)

  return context.code
}

function compile(template) {
  const ast = parse(template)

  // 代码转化
  transform(ast)

  return generate(ast)
}

export { compile, parse }
