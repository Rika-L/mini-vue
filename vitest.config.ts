import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environmentMatchGlobs: [
      ['packages/{vue,vue-compat,runtime-dom,runtime-core}/**', 'jsdom'],
    ],
  },
  resolve: {
    alias: [
      {
        find: /@vue\/([\w-]*)/,
        replacement: `${path.resolve(__dirname, 'packages')}/$1/src`,
      },
    ],
  },
})
