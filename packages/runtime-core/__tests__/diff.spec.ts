import { h, render } from '@vue/runtime-dom'

describe('diff', () => {
  it('should update props', () => {
    const vnode1 = h('div', { style: { color: 'red' } })
    const vnode2 = h('div', { style: { color: 'blue' } })
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div style="color: red;"></div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div style="color: blue;"></div>')
  })

  it('should remove old props', () => {
    const vnode1 = h('div', { style: { color: 'red' } })
    const vnode2 = h('div')
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div style="color: red;"></div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div></div>')
  })

  it('should update children (text to text)', () => {
    const vnode1 = h('div', 'hello')
    const vnode2 = h('div', 'world')
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div>hello</div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div>world</div>')
  })

  it('should update children (text to null)', () => {
    const vnode1 = h('div', 'hello')
    const vnode2 = h('div')
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div>hello</div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div></div>')
  })

  it('should update children (text to array)', () => {
    const vnode1 = h('div', 'hello')
    const vnode2 = h('div', [h('p', 'world')])
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div>hello</div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div><p>world</p></div>')
  })

  it('should update children (array to array)', () => {
    const vnode1 = h('div', [h('p', 'hello'), h('p', 'world')])
    const vnode2 = h('div', [h('p', 'hello'), h('p', 'diff')])
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div><p>hello</p><p>world</p></div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div><p>hello</p><p>diff</p></div>')
  })

  it('should update children (array to text)', () => {
    const vnode1 = h('div', [h('p', 'hello'), h('p', 'world')])
    const vnode2 = h('div', 'hello')
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div><p>hello</p><p>world</p></div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div>hello</div>')
  })

  it('should update children(array to null)', () => {
    const vnode1 = h('div', [h('p', 'hello'), h('p', 'world')])
    const vnode2 = h('div')
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div><p>hello</p><p>world</p></div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div></div>')
  })

  it('should update children(null to array)', () => {
    const vnode1 = h('div')
    const vnode2 = h('div', [h('p', 'hello'), h('p', 'world')])
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div></div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div><p>hello</p><p>world</p></div>')
  })

  it('should update children(null to text)', () => {
    const vnode1 = h('div')
    const vnode2 = h('div', 'hello')
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div></div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div>hello</div>')
  })

  it('should update children(null to null)', () => {
    const vnode1 = h('div')
    const vnode2 = h('div')
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('<div></div>')
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div></div>')
  })

  it('diff: 尾部增加新节点', () => {
    const vnode1 = h('div', { key: 'a' }, [
      h('div', { key: 'b' }),
      h('div', { key: 'c' }),
    ])
    const vnode2 = h('div', { key: 'a' }, [
      h('div', { key: 'b' }),
      h('div', { key: 'c' }),
      h('div', { key: 'd' }),
    ])
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe(
      '<div key="a"><div key="b"></div><div key="c"></div></div>',
    )
    render(vnode2, container)
    expect(container.innerHTML).toBe(
      '<div key="a"><div key="b"></div><div key="c"></div><div key="d"></div></div>',
    )
  })

  it('diff: 头部增加新节点', () => {
    const vnode1 = h('div', { key: 'a' }, [
      h('div', { key: 'b' }),
      h('div', { key: 'c' }),
    ])
    const vnode2 = h('div', { key: 'a' }, [
      h('div', { key: 'd' }),
      h('div', { key: 'b' }),
      h('div', { key: 'c' }),
    ])
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe(
      '<div key="a"><div key="b"></div><div key="c"></div></div>',
    )
    render(vnode2, container)
    expect(container.innerHTML).toBe(
      '<div key="a"><div key="d"></div><div key="b"></div><div key="c"></div></div>',
    )
  })

  it('diff 尾部删除节点', () => {
    const vnode1 = h('div', { key: 'a' }, [
      h('div', { key: 'b' }),
      h('div', { key: 'c' }),
    ])
    const vnode2 = h('div', { key: 'a' }, [h('div', { key: 'b' })])
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe(
      '<div key="a"><div key="b"></div><div key="c"></div></div>',
    )
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div key="a"><div key="b"></div></div>')
  })

  it('diff: 头部删除节点', () => {
    const vnode1 = h('div', { key: 'a' }, [
      h('div', { key: 'b' }),
      h('div', { key: 'c' }),
    ])
    const vnode2 = h('div', { key: 'a' }, [h('div', { key: 'c' })])
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe(
      '<div key="a"><div key="b"></div><div key="c"></div></div>',
    )
    render(vnode2, container)
    expect(container.innerHTML).toBe('<div key="a"><div key="c"></div></div>')
  })

  it('diff: 未知序列对比', () => {
    const vnode1 = h('h1', [
      h('div', { key: 'a' }, 'a'),
      h('div', { key: 'b' }, 'b'),
      h('div', { key: 'c' }, 'c'),
      h('div', { key: 'd' }, 'd'),
      h('div', { key: 'e' }, 'e'),
      h('div', { key: 'f' }, 'f'),
      h('div', { key: 'g' }, 'g'),
    ])

    const vnode2 = h('h1', [
      h('div', { key: 'a' }, 'a'),
      h('div', { key: 'b' }, 'b'),
      h('div', { key: 'e' }, 'e'),
      h('div', { key: 'c' }, 'c'),
      h('div', { key: 'd' }, 'd'),
      h('div', { key: 'h' }, 'h'),
      h('div', { key: 'f' }, 'f'),
      h('div', { key: 'g' }, 'g'),
    ])
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe(
      '<h1><div key="a">a</div><div key="b">b</div><div key="c">c</div><div key="d">d</div><div key="e">e</div><div key="f">f</div><div key="g">g</div></h1>',
    )
    render(vnode2, container)
    expect(container.innerHTML).toBe(
      '<h1><div key="a">a</div><div key="b">b</div><div key="e">e</div><div key="c">c</div><div key="d">d</div><div key="h">h</div><div key="f">f</div><div key="g">g</div></h1>',
    )
  })
})
