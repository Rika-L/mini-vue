import patchAttr from '../src/modules/patchAttr'

describe('runtime-dom: patchAttr', () => {
  it('happy path', () => {
    const el = document.createElement('div')
    expect(el.getAttribute('foo')).toBe(null)
    patchAttr(el, 'foo', 'bar')
    expect(el.getAttribute('foo')).toBe('bar')
    patchAttr(el, 'foo', null)
    expect(el.getAttribute('foo')).toBe(null)
  })
})
