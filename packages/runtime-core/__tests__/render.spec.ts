import { Fragment, h, Text } from '@vue/runtime-core'
import { render } from '@vue/runtime-dom'
// import {render,h} from '../../../public/vue.esm-browser.js'

describe('runtime-core: render', () => {
  it('happy path', () => {
    const vnode = h('div', {}, 'hi')
    const container = document.createElement('div')
    render(vnode, container)
    expect(container.innerHTML).toBe('<div>hi</div>')
  })

  it('should handle array children', () => {
    const vnode = h('div', [h('p', 'hello'), h('p', 'world')])
    const container = document.createElement('div')
    render(vnode, container)
    expect(container.innerHTML).toBe('<div><p>hello</p><p>world</p></div>')
  })

  it('should handle have string in array children', () => {
    const vnode = h('div', [h('p', 'hello'), 'world'])
    const container = document.createElement('div')
    render(vnode, container)
    expect(container.innerHTML).toBe('<div><p>hello</p>world</div>')
  })

  it('should remove el if vnode === null', () => {
    const vnode = h('div')
    const container = document.createElement('div')
    render(vnode, container)
    expect(container.innerHTML).toBe('<div></div>')
    render(null, container)
    expect(container.innerHTML).toBe('')
  })

  it('should render Text', () => {
    const vnode = h(Text, 'hi')
    const container = document.createElement('div')
    render(vnode, container)
    expect(container.innerHTML).toBe('hi')
  })

  it('should update Text', () => {
    const vnode1 = h(Text, 'hi')
    const vnode2 = h(Text, 'hello')
    const container = document.createElement('div')
    render(vnode1, container)
    expect(container.innerHTML).toBe('hi')
    render(vnode2, container)
    expect(container.innerHTML).toBe('hello')
  })

  it('should remove Text', () => {
    const vnode = h(Text, 'hi')
    const container = document.createElement('div')
    render(vnode, container)
    expect(container.innerHTML).toBe('hi')
    render(null, container)
    expect(container.innerHTML).toBe('')
  })

  it('should render Fragment', () => {
    const vnode = h(Fragment, [h('p', 'hello'), h('p', 'world')])
    const container = document.createElement('div')
    render(vnode, container)
    expect(container.innerHTML).toBe('<p>hello</p><p>world</p>')
    // unmount children
    render(null, container)
    expect(container.innerHTML).toBe('')
  })
})
