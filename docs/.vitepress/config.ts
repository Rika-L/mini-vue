import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'mini-vue',
  description: '基于Vue3.4实现最简的Vue3模型',
  base: '/mini-vue/',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Reactivity', link: '/响应式原理' },
    ],

    sidebar: [
      {
        text: 'Reactivity',
        items: [
          { text: '响应式原理', link: '/响应式原理' },
          { text: 'ref', link: '/ref' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Rika-L/mini-vue' },
    ],
  },
})
