# mini-vue
实现vue的最小复现

```
├── docs // 文档目录
│   ├── 1-reactivity
│   ├── 2-runtime-dom
│   ├── 3-runtime-core
│   ├── 4-compiler-core
│   ├── 5-mini-pinia
│   ├── 6-mini-vue-router
│   ├── 7-prepare-for-interview  // 相关面试题
│   └── index.md
└── packages // 包目录
    ├── compiler-core
    ├── reactivity
    ├── runtime-core
    ├── runtime-dom
    ├── shared
    └── vue
```

## How to use

### install

```
pnpm install
```

### dev

```
pnpm dev
```

### build

output `packages/vue/dist`

```
pnpm build
```

### test

```
pnpm test
```

or

```
pnpm test:ui
```

### docs

```
pnpm docs:dev

pnpm docs:build
```
