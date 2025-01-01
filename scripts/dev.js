import minimist from "minimist";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { createRequire } from "module";
import esbuild from "esbuild";

// node中的命令行参数通过process.argv获取
const args = minimist(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const target = args._[0] || "reactivity";
const format = args.f || "iife";

// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

esbuild.context({
  entryPoints: [entry],
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
  bundle: true, // 打包到一个文件
  platform: "browser", // 打包成浏览器可用的代码
  sourcemap: true, // 可以调试源代码
  format,
  globalName: pkg.buildOptions?.name,
}).then((ctx)=>{
  console.log("start dev");

  return ctx.watch(); // 监听文件变化
})