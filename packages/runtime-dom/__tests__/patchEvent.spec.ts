import patchEvent from "../src/modules/patchEvent";

describe('runtime-dom: patchEvent', () => {
  it('happy path', () => {
    const el = document.createElement('div')
    const fn = vi.fn()
    patchEvent(el, 'onClick', fn)
    el.dispatchEvent(new Event('click'))
    expect(fn).toHaveBeenCalledTimes(1)
    el.dispatchEvent(new Event('click'))
    expect(fn).toHaveBeenCalledTimes(2)
    el.dispatchEvent(new Event('click'))
    expect(fn).toHaveBeenCalledTimes(3)
  });

  it('should update event handler', () => {
    const el = document.createElement('div')
    const fn = vi.fn()
    const fn2 = vi.fn()
    patchEvent(el, 'onClick', fn)
    el.dispatchEvent(new Event('click'))
    expect(fn).toHaveBeenCalledTimes(1)
    patchEvent(el, 'onClick', fn2)
    el.dispatchEvent(new Event('click'))
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
  });
});