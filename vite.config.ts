import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import alias from "@rollup/plugin-alias";
import { resolve } from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import svgSprites from 'rollup-plugin-svg-sprites'
import { basename } from 'path';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
  plugins: [
    vue(), 
    alias(),
    svgSprites({
      exclude: ['node_modules/**']
    }),
    Components({
      resolvers: [VantResolver()],
    }),
    qrcode()
  ],
  build: {
    outDir:'www',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'main.html'),
        mobile: resolve(__dirname, 'mobile.html'),
        index: resolve(__dirname, 'index.html'),
      },
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ]
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port:6969,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      /*  @/ 代表src 路径下 ， @ 代表全局路径下 */
      "@": path.resolve(__dirname, "./src"),
      "@common": path.resolve(__dirname, "./common/"),
    },
  },
  define: {
    '__DEV__': process.env.NODE_ENV !== 'production',
  }
});
