import { h, KeepAlive, onMounted } from '@vue/runtime-core'
import { render } from '@vue/runtime-dom'

describe('runtime-core: KeepAlive', () => {
  it('happy path', () => {
    let aMountedCount = 0
    const A = {
      setup() {
        onMounted(() => aMountedCount++)
        return () => h('div')
      },
    }
    const B = {
      setup() {
        return () => h('div')
      },
    }
    const container = document.createElement('div')
    render(h(KeepAlive, null, { default: () => h(A) }), container)
    render(h(KeepAlive, null, { default: () => h(B) }), container)
    render(h(KeepAlive, null, { default: () => h(A) }), container)
    expect(aMountedCount).toBe(1)
  })

  // 支持缓存个数
  it('should KeepAlive max', () => {
    let aMountedCount = 0
    const A = {
      setup() {
        onMounted(() => aMountedCount++)
        return () => h('div')
      },
    }
    const B = {
      setup() {
        return () => h('div')
      },
    }
    const container = document.createElement('div')
    render(h(KeepAlive, { max: 1 }, { default: () => h(A) }), container)
    render(h(KeepAlive, { max: 1 }, { default: () => h(B) }), container)
    render(h(KeepAlive, { max: 1 }, { default: () => h(A) }), container)
    expect(aMountedCount).toBe(2)
  })
})
