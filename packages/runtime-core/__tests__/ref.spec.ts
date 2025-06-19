import { ref } from '@vue/reactivity'
import { h, onMounted } from '@vue/runtime-core'
import { render } from '@vue/runtime-dom'

describe('runtime-core: ref', () => {
  it('ref: get component instance without exposed', () => {
    const My = {
      props: { a: Number },
      setup(props) {
        return () => h('div', props.a)
      },
    }
    const VueComponent = {
      setup() {
        const comp = ref(null)
        onMounted(() => expect(comp.value.a).toBe(100)) // 获取的是组件的实例
        return () => h(My, { ref: comp, a: 100 })
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
  })

  it('ref: get component instance with exposed', () => {
    const My = {
      props: { a: Number },
      setup(props, { expose }) {
        expose({ a: 200 })
        return () => h('div', props.a)
      },
    }
    const VueComponent = {
      setup() {
        const comp = ref(null)
        onMounted(() => expect(comp.value.a).toBe(200)) // 获取的是组件的实例
        return () => h(My, { ref: comp, a: 100 })
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
  })

  it('ref: get dom', () => {
    const VueComponent = {
      setup() {
        const el = ref(null)
        onMounted(() => expect(el.value).toBeInstanceOf(HTMLDivElement))
        return () => h('div', { ref: el })
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container)
  })
})
