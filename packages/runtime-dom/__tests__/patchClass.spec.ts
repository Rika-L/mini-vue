import patchClass from "../src/modules/patchClass";

describe('runtime-dom: patchClass', () => {
  it('happy path', () => {
    const el = document.createElement('div')
    patchClass(el, 'a')
    expect(el.className).toBe('a')
    patchClass(el, null)
    expect(el.className).toBe('')
  });
});