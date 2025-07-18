import { CREATE_ELEMENT_VNODE, CREATE_TEST_VNODE, Fragment } from './runtimeHelper'

export enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
  SIMPLE_EXPRESSION, // 简单表达式
  INTERPOLATION, // {{}}
  ATTRIBUTE,
  DIRECTIVE,
  // containers
  COMPOUND_EXPRESSION, // 复合表达式
  IF,
  IF_BRANCH,
  FOR,
  TEXT_CALL, // createVNode()
  // codegen
  VNODE_CALL,
  JS_CALL_EXPRESSION,
  JS_OBJECT_EXPRESSION,
  JS_PROPERTY,
  JS_ARRAY_EXPRESSION,
  JS_FUNCTION_EXPRESSION,
  JS_CONDITIONAL_EXPRESSION,
  JS_CACHE_EXPRESSION,

  // ssr codegen
  JS_BLOCK_STATEMENT,
  JS_TEMPLATE_LITERAL,
  JS_IF_STATEMENT,
  JS_ASSIGNMENT_EXPRESSION,
  JS_SEQUENCE_EXPRESSION,
  JS_RETURN_STATEMENT,
}

export function createCallExpression(context, args) {
  const name = context.helper(CREATE_TEST_VNODE)

  return { // createTextVnode
    type: NodeTypes.JS_CALL_EXPRESSION, // JS调用表达式
    arguments: args, // 参数
    callee: name,
  }
}

export function createVnodeCall(context, tag, props, children) {
  let name
  if (tag !== Fragment) {
    name = context.helper(CREATE_ELEMENT_VNODE)
  }

  return {
    type: NodeTypes.VNODE_CALL,
    tag,
    props,
    children,
    callee: name,
  }
}

export function createObjectExpression(properties) {
  return {
    type: NodeTypes.JS_OBJECT_EXPRESSION,
    properties,
  }
}
