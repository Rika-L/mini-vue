import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'

// https://vitepress.dev/reference/site-config
const vitepressOption = defineConfig({
  title: 'mini-vue',
  description: '基于Vue3.4实现最简的Vue3模型',
  base: '/mini-vue/',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Reactivity', link: '/1-reactivity/1-响应式原理' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Rika-L/mini-vue' },
    ],
  },
})

const vitePressSidebarOptions = {
  // VitePress Sidebar's options here...
  documentRootPath: '/docs',
  collapsed: false,
  debugPrint: true,
}

export default withSidebar(vitepressOption, vitePressSidebarOptions)
