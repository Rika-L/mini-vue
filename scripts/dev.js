// 这个文件会帮我们打包packages下的模块 最终打包出js文件

// node dev.js 要打包的名字 -f 打包的格式

import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))
const __fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(__fileName)
const require = createRequire(import.meta.url)

const target = args._[0] || 'reactivity' // 打包哪个项目
const format = args.f || 'iife' // 打包后的模块规范

console.log(__dirname, __fileName)

// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
const pkg = require(`../packages/${target}/package.json`)

// 根据需要进行打包
esbuild
  .context({
    entryPoints: [entry],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`), // 出口
    bundle: true,
    platform: 'browser',
    sourcemap: true,
    format, // cjs esm iife
    globalName: pkg.buildOptions?.name,
  })
  .then((ctx) => {
    console.log('start dev')

    ctx.watch() // 监控入口文件并持续进行打包
  })
