import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  test: {
    globals: true,
    environmentMatchGlobs: [
      ['packages/{vue,vue-compat,runtime-dom}/**', 'jsdom'],
    ],
  }, 
  resolve:{
    alias: [
      {
        find: /@vue\/([\w-]*)/,
        replacement: path.resolve(__dirname, "packages") + "/$1/src"
      }
    ]
  }
});
