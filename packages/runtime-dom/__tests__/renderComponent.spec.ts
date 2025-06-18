import { Fragment, h, nextTick, ref, render, Text } from '@vue/runtime-dom'

// import { h, render } from '../../../public/vue.esm-browser.js'

describe('render: renderComponent', () => {
  it('should render component', () => {
    const VueComponent = {
      data() {
        return {
          msg: 'hello',
        }
      },
      render() {
        // this == 组件的示例
        return h('div', this.msg)
      },
    }
    const container = document.createElement('div')
    // 组件由两个虚拟节点组成 h(VueComponent) 产生的是组件的虚拟节点
    // render函数返回的虚拟节点才是最重要渲染的内容 = subTree
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>hello</div>')
  })

  // 区分attrs 和 props
  // 属性 attrs(非响应式) props(响应式)
  // 在开发模式下 attrs 是响应式的
  // 在生产模式下 attrs 是非响应式的
  it('should distinguish attrs and props', () => {
    const VueComponent = {
      props: {
        b: String,
      },
      render(proxy) {
        return h('div', proxy.$attrs.a + proxy.b)
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent, { a: 'hello', b: 'world' }), container)
    expect(container.innerHTML).toBe('<div>helloworld</div>')
  })

  it('should update component by props', async () => {
    const RenderComponent = {
      props: {
        address: String,
      },
      data() {
        return {}
      },
      render() {
        return h(Text, {}, this.address)
      },
    }
    const VueComponent = {
      data() {
        return {
          flag: false,
        }
      },
      render() {
        return h(Fragment, {}, [
          h(
            'button',
            { onClick: () => (this.flag = !this.flag), id: 'toggle' },
            'toggle',
          ),
          h(RenderComponent, { address: this.flag ? 'A' : 'B' }),
        ])
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe(`<button id="toggle">toggle</button>B`)
    const button = container.querySelector('#toggle') as HTMLButtonElement
    button.click()
    await nextTick() // 等待更新完成
    expect(container.innerHTML).toBe(`<button id="toggle">toggle</button>A`)
  })

  // 支持 setup
  // setup 函数 每个组件只会执行一次 可以放入composition api
  // 解决反复横跳问题
  // setup 可以返回函数 也可以返回对象
  it('should support setup; setup return render', () => {
    const VueComponent = {
      setup() {
        return () => h('div', 'hello')
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>hello</div>')
  })

  it('setup: setup return an object', () => {
    const VueComponent = {
      setup() {
        return {
        }
      },
      render() {
        return h('div', 'hello')
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>hello</div>')
  })

  // setup返回一个render并且组件有render的情况下 setup返回的render的优先级更高
  it('setup: return a render and component have render', () => {
    const VueComponent = {
      setup() {
        return () => h('div', 'hello')
      },
      render() {
        return h('div', 'world')
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>hello</div>')
  })

  // 在setup返回的render中使用ref
  it('setup: support ref', () => {
    const VueComponent = {
      setup() {
        const str = ref('hello word')
        return () => h('div', str.value)
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>hello word</div>')
  })

  // 在组件的render中通过proxy使用ref
  it('setup: support ref in Component.render', () => {
    const VueComponent = {
      setup() {
        const str = ref('hello word')
        return { str }
      },
      render(proxy) {
        return h('div', proxy.str)
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>hello word</div>')
  })

  // slot
  it('slot: happy path', () => {
    const RenderComponent = {
      render(proxy) {
        return h(Fragment, [proxy.$slots.default()])
      },
    }
    const VueComponent = {
      render() {
        return h(RenderComponent, null, {
          default: () => h('div', 'slot'),
        })
      },
    }

    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>slot</div>')
  })

  // 作用域插槽
  it('slot: scope', () => {
    const RenderComponent = {
      render(proxy) {
        return h(Fragment, [proxy.$slots.default({ foo: 'bar' })])
      },
    }
    const VueComponent = {
      render() {
        return h(RenderComponent, null, {
          default: ({ foo }) => h('div', foo),
        })
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>bar</div>')
  })

  // 支持响应事件
  it('emit: support render', () => {
    const VueComponent = {
      setup(_props, { emit }) {
        return () => h('button', { onClick: () => emit('myEvent'), id: 'add' })
      },
    }
    const container = document.createElement('div')
    let count = 0
    render(h(VueComponent, { onMyEvent: () => count++ }), container)
    const button = container.querySelector('#add') as HTMLButtonElement
    button.click()
    expect(count).toBe(1)
  })

  // 组件卸载
  it('should unmount component', () => {
    const VueComponent = {
      render() {
        return h('div', 'hello')
      },
    }

    const container = document.createElement('div')
    render(h(VueComponent), container)
    expect(container.innerHTML).toBe('<div>hello</div>')
    render(null, container)
    expect(container.innerHTML).toBe('')
  })
})
