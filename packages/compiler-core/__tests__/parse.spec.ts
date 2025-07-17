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
          loc: {
            start: {
              column: 1,
              line: 1,
              offset: 0,
            },
            end: {
              column: 4,
              line: 1,
              offset: 3,
            },
            source: '666',
          },
        },
      ],
    })
  })

  it('can resolve interpolation', () => {
    expect(parse('{{ name }}')).toStrictEqual({
      type: NodeTypes.ROOT,
      children: [
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            isStatic: false,
            isConstant: false,
            content: 'name',
            loc: {
              start: {
                column: 4,
                line: 1,
                offset: 3,
              },
              end: {
                column: 8,
                line: 1,
                offset: 7,
              },
              source: 'name',
            },
          },
          loc: {
            start: {
              column: 1,
              line: 1,
              offset: 0,
            },
            end: {
              column: 11,
              line: 1,
              offset: 10,
            },
            source: '{{ name }}',
          },
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
          isSelfClosing: false,
          children: [],
          props: [],
          loc: {
            start: {
              column: 1,
              line: 1,
              offset: 0,
            },
            end: {
              column: 12,
              line: 1,
              offset: 11,
            },
            source: '<div></div>',
          },
        },
      ],
    })
  })

  it('can resolve element with props', () => {
    expect(parse('<div id="app"></div>')).toStrictEqual({
      type: NodeTypes.ROOT,
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: 'div',
          props: [
            {
              type: NodeTypes.ATTRIBUTE,
              name: 'id',
              value: {
                type: NodeTypes.TEXT,
                content: 'app',
                loc: {
                  start: {
                    column: 9,
                    line: 1,
                    offset: 8,
                  },
                  end: {
                    column: 14,
                    line: 1,
                    offset: 13,
                  },
                  source: '"app"',
                },
              },
              loc: {
                start: {
                  column: 6,
                  line: 1,
                  offset: 5,
                },
                end: {
                  column: 14,
                  line: 1,
                  offset: 13,
                },
                source: 'id="app"',
              },
            },
          ],
          isSelfClosing: false,
          children: [],
          loc: {
            start: {
              column: 1,
              line: 1,
              offset: 0,
            },
            end: {
              column: 21,
              line: 1,
              offset: 20,
            },
            source: '<div id="app"></div>',
          },
        },
      ],
    })
  })
})
