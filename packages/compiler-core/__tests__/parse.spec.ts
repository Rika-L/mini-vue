import { parse } from '@vue/compiler-core'
import { NodeTypes } from '../src/ast'

describe('compiler-core: parse', () => {
  it('can resolve text', () => {
    expect(parse('666')).toStrictEqual({
      type: NodeTypes.ROOT,
      children: [
        {
          type: NodeTypes.TEXT,
          content: '666',
        },
      ],
    })
  })

  it('can resolve element', () => {
    expect(parse('<div></div>')).toStrictEqual({
      type: NodeTypes.ROOT,
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: 'div',
          children: [],
        },
      ],
    })
  })
})
