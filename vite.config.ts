import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    server: {},
    resolve: {
        alias: {
            /*  @/ 代表src 路径下 ， @ 代表全局路径下 */
            '@': path.resolve(__dirname, './src'),
            '@common': path.resolve(__dirname, './common/')
        },
    }
})
