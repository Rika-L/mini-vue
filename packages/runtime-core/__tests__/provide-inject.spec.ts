import { h, inject, provide, render } from '@vue/runtime-dom'

describe('runtime-core: provide-inject', () => {
  it('happy path', () => {
    const A = {
      setup() {
        const foo = inject('foo')
        return () => h('div', foo)
      },
    }
    const VueComponent = {
      setup() {
        provide('foo', 'bar')
        return () => h(A)
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>bar</div>')
  })

  it('inject should support default value', () => {
    const VueComponent = {
      setup() {
        const foo = inject('foo', 'bar')
        return () => h('div', foo)
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>bar</div>')
  })

  // 可以支持多个provide
  it('should support multiple provide', () => {
    const A = {
      setup() {
        const foo = inject('foo')
        const bar = inject('bar')
        return () => h('div', foo + bar)
      },
    }
    const VueComponent = {
      setup() {
        provide('foo', 'bar')
        provide('bar', 'baz')
        return () => h(A)
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>barbaz</div>')
  })

  // 可以支持爷孙组件通信
  it('should support ancestor descendant communication', () => {
    const A = {
      setup() {
        const foo = inject('foo')
        return () => h('div', foo)
      },
    }
    const B = {
      setup() {
        return () => h(A)
      },
    }
    const VueComponent = {
      setup() {
        provide('foo', 'bar')
        return () => h(B)
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>bar</div>')
  })
})
