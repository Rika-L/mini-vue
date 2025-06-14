import path from "path";
import { defineConfig } from "rolldown";

export default defineConfig({
  input: "./packages/vue/src/index.ts",
  resolve: {
    alias: {
      "@vue/runtime-dom": path.resolve(__dirname, "./packages/runtime-dom/src"),
      "@vue/runtime-core": path.resolve(
        __dirname,
        "./packages/runtime-core/src"
      ),
      "@vue/shared": path.resolve(__dirname, "./packages/shared/src"),
      "@vue/reactivity": path.resolve(__dirname, "./packages/reactivity/src"),
    },
  },
  output: [
    {
      format: "cjs",
      file: "./packages/vue/dist/vue.cjs.js",
      minify: true,
      sourcemap: true,
    },
    {
      name: "vue",
      format: "es",
      file: "./packages/vue/dist/vue.esm-bundler.js",
      minify: false,
      sourcemap: true,
    },
  ],
});
