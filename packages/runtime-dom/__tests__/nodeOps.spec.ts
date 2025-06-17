import { nodeOps } from '../src/nodeOps'

describe('runtime-dom: nodeOps', () => {
  it('happy path', () => {
    const el = nodeOps.createElement('div')
    expect(el.tagName).toBe('DIV')
    nodeOps.insert(el, document.body, null)
    expect(document.body.contains(el)).toBe(true)
    nodeOps.remove(el)
    expect(document.body.contains(el)).toBe(false)
    // createText
    const text = nodeOps.createText('hello')
    expect(text.textContent).toBe('hello')
    // setText
    nodeOps.setText(text, 'world')
    expect(text.textContent).toBe('world')
    // setElementText
    nodeOps.setElementText(el, 'hello')
    expect(el.textContent).toBe('hello')
    // parentNode
    expect(nodeOps.parentNode(el)).toBe(null)
    nodeOps.insert(el, document.body, null)
    expect(nodeOps.parentNode(el)).toBe(document.body)
    // nextSibling
    expect(nodeOps.nextSibling(el)).toBe(null)
    const el2 = nodeOps.createElement('div')
    nodeOps.insert(el2, document.body, null)
    expect(nodeOps.nextSibling(el)).toBe(el2)
  })
})
