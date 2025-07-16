// 编译主要分为三部
// 1 将模板转化为ast语法树
// 2 转化生成code gen node
// 3 转化成为render函数

import { NodeTypes } from './ast'

function createParserContext(content) {
  return {
    originalSource: content,
    source: content,
    line: 1,
    column: 1,
    offset: 0,
  }
}

function isEnd(context) {
  return !context.source
}

function advanceBy(context, endIndex) {
  const c = context.source
  context.source = c.slice(endIndex)
}

function parseTextData(context, endIndex) {
  const content = context.source.slice(0, endIndex)
  advanceBy(context, endIndex)
  return content
}

function parseText(context) {
  const tokens = ['<', '{{'] // 找当前离得最近的词法

  let endIndex = context.source.length // 先假设找不到

  // 找到尾部索引
  for (let i = 0; i < tokens.length; i++) {
    const index = context.source.indexOf(tokens[i], 1)
    if (index !== -1 && index < endIndex) {
      endIndex = index
    }
  }

  // 0-endIndex 为文字内容
  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    content,
  }
}

function parserChildren(context) {
  const nodes = [] as any
  while (!isEnd(context)) {
    let node

    // 有限状态机

    const c = context.source

    if (c.startsWith('{{')) {
      node = '表达式'
    }
    else if (c[0] === '<') {
      node = '元素'
    }
    else {
      // 文本
      node = parseText(context)
    }

    nodes.push(node)
  }
  return nodes
}

function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children,
  }
}

function parse(template) {
  // 根据template产生一棵树 line column offset

  const context = createParserContext(template)
  return createRoot(parserChildren(context))
}

export { parse }
