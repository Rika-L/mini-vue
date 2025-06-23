// vue在模板编译阶段做了优化 在不稳定的结构中增加标识 以支持靶向更新

import { reactive, toRefs } from '@vue/reactivity'
import { createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, openBlock as _openBlock, toDisplayString as _toDisplayString, h, nextTick, render } from '@vue/runtime-dom'

describe('targeted update 靶向更新', () => {
  it('happy path', async () => {
    const VueComponent = {
      setup() {
        const state = reactive({ name: 'rika' })

        setTimeout(() => {
          state.name = 'rika2'
        }, 1000)
        return {
          ...toRefs(state),
        }
      },
      render(_ctx) {
        return (_openBlock(), _createElementBlock('div', null, [
          _createElementVNode('h1', null, 'Hello Rika'),
          _createElementVNode('button', {
            id: 'toggle',
            onClick: () => {
              _ctx.name = 'rika2'
            },
          }, 'toggle'),
          _createElementVNode('span', null, _toDisplayString(_ctx.name), 1, /* TEXT */ // 模板编译的时候vue会加
          ),
        ]))
      },
    }
    const container = document.createElement('div')
    render(h(VueComponent), container);
    (container.querySelector('#toggle') as HTMLButtonElement).click()
    await nextTick()
    expect(container.innerHTML).toBe('<div><h1>Hello Rika</h1><button id="toggle">toggle</button><span>rika2</span></div>')
  })
})
