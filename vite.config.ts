import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    server: {},
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/component': path.resolve(__dirname, './src/components'),
            '@/view': path.resolve(__dirname, './src/views'),
            '@/api': path.resolve(__dirname, './src/api/'),
        },
    }
})
