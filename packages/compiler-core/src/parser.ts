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
  const c = context.source

  if (c.startsWith('</')) { // 遇到结束标签 也要停止
    return true
  }
  return !context.source
}

function advancePositionMutation(context, c, endIndex) {
  let linesCount = 0 // 第几行
  let linePos = -1 // 换行的位置信息

  for (let i = 0; i < endIndex; i++) {
    if (c.charCodeAt(i) === 10) { // ASCII码 中 10 代表换行符 “LF”
      linesCount++
      linePos = i
    }
  }
  context.offset += endIndex
  context.line += linesCount
  context.column = linePos === -1 ? context.column + endIndex : endIndex - linePos
}

function advanceBy(context, endIndex) {
  const c = context.source
  advancePositionMutation(context, c, endIndex)
  context.source = c.slice(endIndex)
}

function parseTextData(context, endIndex) {
  const content = context.source.slice(0, endIndex)
  advanceBy(context, endIndex)
  return content
}

function advanceSpaces(context) {
  const match = /^[ \t\r\n]+/.exec(context.source)
  if (match) {
    advanceBy(context, match[0].length)
  }
}

function parseAttributeValue(context) {
  const quote = context.source[0] // 引号

  const isQuoted = quote === '"' || quote === '\'' // 是否是

  let content

  const start = getCursor(context) // 记录属性值的开始位置

  if (isQuoted) {
    advanceBy(context, 1) // 删除引号
    const endIndex = context.source.indexOf(quote, 1)

    content = parseTextData(context, endIndex) // 解析内容

    advanceBy(context, 1) // 删除引号
  }
  else {
    content = context.source.match(/([^ \t\r\n/>])+/)[1] // 取出内容，删除空格
    advanceBy(context, content.length)
    advanceSpaces(context)
  }

  const end = getCursor(context) // 记录属性值的结束位置
  return {
    content,
    loc: getSelection(context, start, end),
  }
}

function parseAttribute(context) {
  const start = getCursor(context) // 记录开始位置

  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source) // 匹配属性名

  const name = match[0] // 属性名

  advanceBy(context, name.length) // 删除属性名

  let content

  let loc

  if (/^[\t\r\n\f ]*=/.test(context.source)) { // 匹配 = 号
    advanceSpaces(context) // 删除空格
    advanceBy(context, 1) // 删除 = 号
    advanceSpaces(context) // 删除空格

    const { content: _content, loc: _loc } = parseAttributeValue(context) // 解析属性值
    content = _content
    loc = _loc
  }

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: {
      type: NodeTypes.TEXT,
      content,
      loc,
    },
    loc: getSelection(context, start),
  }
}

function parseAttributes(context) {
  const props = []

  while (context.source.length > 0 && !context.source.startsWith('>')) {
    props.push(parseAttribute(context))

    advanceSpaces(context) // 删除空格
  }

  return props
}

function parseTag(context) {
  const start = getCursor(context)
  // 匹配标签
  const match = /^<\/?([a-z][^ \t\r\n/>]*)/.exec(context.source)

  const tag = match[1]

  advanceBy(context, match[0].length) // 删除匹配到的内容

  advanceSpaces(context) // 删除空格

  const props = parseAttributes(context) // 解析属性

  const isSelfClosing = context.source.startsWith('/>') // 是否自闭合

  advanceBy(context, isSelfClosing ? 2 : 1)

  return {
    type: NodeTypes.ELEMENT,
    tag,
    isSelfClosing,
    loc: getSelection(context, start), // 开头标签解析后的信息
    props,
  }
}

function parseElement(context) {
  const ele = parseTag(context)

  const children = parserChildren(context) // 递归解析 如果是结尾标签则跳过

  if (context.source.startsWith('</')) { // 闭合标签没有意义，直接移除
    parseTag(context)
  }

  (ele as any).children = children;

  (ele as any).loc = getSelection(context, ele.loc.start)

  return ele
}

function getCursor(context) {
  const { line, column, offset } = context
  return { line, column, offset }
}

function getSelection(context, start, e?) {
  const end = e || getCursor(context)
  // eslint 可以根据 start，end找到要报错的位置
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset),
  }
}

function parseInterpolation(context) {
  const start = getCursor(context) // 记录开始位置

  const closeIndex = context.source.indexOf('}}', 2) // 找到结束位置

  advanceBy(context, 2) // 去掉开头的 {{

  // 原本： {{ name }} 去掉之后 : name }}
  const innerStart = getCursor(context) // 记录内部开始位置
  const innerEnd = getCursor(context) // 记录内部结束位置

  // "{{ name }}" -> " name "
  const preTrimContent = parseTextData(context, closeIndex - 2) // 解析内部内容

  // " name " -> "name"
  const content = preTrimContent.trim() // 去掉空格

  const startOffset = preTrimContent.indexOf(content) // 找到偏移量
  if (startOffset > 0) { // 偏移量大于0 说明有空格
    advancePositionMutation(innerStart, preTrimContent, startOffset) // 移动内部开始位置
  }

  const endOffset = startOffset + content.length // 找到内部结束位置
  advancePositionMutation(innerEnd, preTrimContent, endOffset) // 移动内部结束位置

  advanceBy(context, 2) // 去掉结尾的 }}

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      isStatic: false, // 静态
      isConstant: false, // 常量
      content, // 表达式内容
      loc: getSelection(context, innerStart, innerEnd),
    },
    loc: getSelection(context, start),
  }
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

  const start = getCursor(context) // 记录开始位置
  // 0-endIndex 为文字内容
  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    content,
    loc: (getSelection(context, start)),
  }
}

function parserChildren(context) {
  const nodes = [] as any
  while (!isEnd(context)) {
    let node

    // 有限状态机

    const c = context.source

    if (c.startsWith('{{')) {
      node = parseInterpolation(context)
    }
    else if (c[0] === '<') {
      node = parseElement(context)
    }
    else {
      // 文本
      node = parseText(context)
    }

    nodes.push(node)
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.type === NodeTypes.TEXT) { // 文本节点
      if (!/[^\t\r\n\f ]/.test(node.content)) {
        nodes[i] = null
      }
      else {
        node.content.replace(/[\t\r\n\f ]+/g, ' ')
      }
    }
  }

  return nodes.filter(Boolean)
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
