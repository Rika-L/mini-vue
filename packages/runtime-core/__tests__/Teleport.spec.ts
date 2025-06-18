import { h, render, Teleport } from '@vue/runtime-dom'

describe.skip('runtime-core: Teleport', () => {
  it('happy path', () => {
    const container = document.createElement('div')
    const app = document.createElement('div')
    app.id = 'app'
    const root = document.createElement('div')
    root.id = 'root'
    container.appendChild(app)
    container.appendChild(root)
    render(h(Teleport, { to: '#root' }, 'hello'), app)
    expect(root.innerHTML).toBe('hello')
  })
})
