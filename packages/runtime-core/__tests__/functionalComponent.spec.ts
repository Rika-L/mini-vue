import { h } from '@vue/runtime-core'
import { render } from '@vue/runtime-dom'

describe('runtime-core: functionalComponent', () => {
  // 此写法已经不再使用 vue3中没有对它做任何优化
  it('happ path', () => {
    function FunctionalComponent(props) {
      return h('div', props.a + props.b)
    }
    const container = document.createElement('div')
    render(h(FunctionalComponent, { a: 1, b: 2 }), container)
    expect(container.innerHTML).toBe('<div>3</div>')
  })
})
