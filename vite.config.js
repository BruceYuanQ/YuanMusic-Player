import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'

import path from 'path'
import { fileURLToPath } from 'url'
const __filenameNew = fileURLToPath(import.meta.url)
const __dirnameNew = path.dirname(__filenameNew)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirnameNew, 'src'),
      apis: path.resolve(__dirnameNew, 'src/apis'),
      assets: path.resolve(__dirnameNew, 'src/assets'),
      base: path.resolve(__dirnameNew, 'src/base'),
      components: path.resolve(__dirnameNew, 'src/components'),
      views: path.resolve(__dirnameNew, 'src/views')
    }
  },
  css: {
    // vite 中配置 less 的全局变量，即 var.less 和 mixin.less 中的变量（这样我们在其他文件中使用时不需要手动导入）
    preprocessorOptions: {
      less: {
        additionalData: `@import "src/styles/var.less";
                         @import "src/styles/mixin.less";`
      }
    }
  }
})
