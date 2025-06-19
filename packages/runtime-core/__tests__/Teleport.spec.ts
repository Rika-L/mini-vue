import { h, render, Teleport, Text } from '@vue/runtime-dom'

describe('runtime-core: Teleport', () => {
  // 可以更新
  it('happy path', () => {
    const container = document.body
    container.innerHTML = ''
    const app = document.createElement('div')
    app.id = 'app'
    const root = document.createElement('div')
    root.id = 'root'
    container.appendChild(app)
    container.appendChild(root)
    render(h(Teleport, { to: '#root' }, h(Text, 'hello')), container)
    expect(root.innerHTML).toBe('hello')
    render(h(Teleport, { to: '#root' }, h(Text, 'world')), container)
    expect(root.innerHTML).toBe('world')
    render(h(Teleport, { to: '#app' }, h(Text, 'world')), container)
    expect(app.innerHTML).toBe('world')
    expect(root.innerHTML).toBe('')
    render(null, container)
    expect(app.innerHTML).toBe('')
  })
})
