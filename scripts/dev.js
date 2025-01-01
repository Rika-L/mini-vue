import minimist from "minimist";
import {fileURLToPath} from "url";
import {resolve,dirname} from "path";
import { createRequire } from "module";

// node中的命令行参数通过process.argv获取
const args = minimist(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const target = args._[0] || "reactivity";
const format = args.f || "iife";

// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);