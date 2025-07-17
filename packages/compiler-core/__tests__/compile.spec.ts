import { compile } from '@vue/compiler-core'

describe('compiler-core', () => {
  it('compile', () => {
    const template = `{{name}}`
    console.log(compile(template))
    expect(1).toBe(1)
  })
})
