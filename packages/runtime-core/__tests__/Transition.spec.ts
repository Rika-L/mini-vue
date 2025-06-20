import { render, Transition } from '@vue/runtime-dom'
import { h } from '@vue/runtime-dom'

describe('runtime-core: Transition', () => {
  it('happy path', () => {
    const props = {
      onBeforeEnter(el) {
        console.log(arguments, 'beforeenter')
      },
      onEnter(el) {
        console.log(arguments, 'enter')
      },
      onLeave(el) {
        console.log(arguments, 'leave')
      },

    }
    const container = document.createElement('div')
    render(h(Transition, props, {
      default: () => h('div', 'content'),
    }), container)
  })
})
