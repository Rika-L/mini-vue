import {
  h,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdate,
  ref,
  render,
  Text,
} from '@vue/runtime-dom'

describe('runtime-core: lifecycle', () => {
  it('should support onMount onBeforeMount', () => {
    const container = document.createElement('div')
    const VueComponent = {
      setup() {
        onBeforeMount(() => {
          expect(container.innerHTML).toBe('')
        })
        onMounted(() => {
          expect(container.innerHTML).toBe('<div>hello</div>')
        })
        return () => h('div', 'hello')
      },
    }
    render(h(VueComponent), container)
  })

  it('should support onBeforeUpdate onUpdate', () => {
    const container = document.createElement('div')
    const VueComponent = {
      setup() {
        onBeforeUpdate(() => expect(container.innerHTML).toBe('1'))
        onUpdate(() => expect(container.innerHTML).toBe('2'))
        const count = ref(1)
        setTimeout(() => count.value++)
        return () => h(Text, count.value)
      },
    }
    render(h(VueComponent), container)
  })

  it('should support onBeforeUnmount onUnmounted', () => {
    const container = document.createElement('div')
    const VueComponent = {
      setup() {
        onBeforeUnmount(() => {
          expect(container.innerHTML).toBe('<div>hello</div>')
        })
        onUnmounted(() => {
          expect(container.innerHTML).toBe('')
        })
        return () => h('div', 'hello')
      },
    }
    render(h(VueComponent), container)
    render(null, container)
  })
})
