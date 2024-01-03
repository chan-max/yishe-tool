/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-01 10:02:57
 * @FilePath: /1s/vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */


import { defineConfig ,loadEnv} from "vite";
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
// 移动端扫码进入项目
import { qrcode } from 'vite-plugin-qrcode';
// 开发环境使用 https 
import basicSsl from '@vitejs/plugin-basic-ssl'
// 编译文件支持旧游览器
import legacy from '@vitejs/plugin-legacy';
import AntdvResolver from 'antdv-component-resolver'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig((config:any) => {
  console.log('load vite config',config)

  const isApp = config.mode === 'app'

  const baseBuild =   {
    outDir:'www',
    assetsDir:'./',
    rollupOptions: {
      input: {
        mobile: resolve(__dirname, 'mobile.html'),
        index: resolve(__dirname, 'pc.html'),
      },
    }
  }

  const appBuild =   {
    outDir:'app',
    assetsDir:'./',
    rollupOptions: {
      input:resolve(__dirname, 'index.html'),
    }
  }

  return {
    plugins: [
      alias(),
      // https dev
      basicSsl(),
      svgSprites({
        exclude: ['node_modules/**']
      }),
      Components({
        resolvers: [VantResolver(),AntdvResolver()],
      }),
      qrcode(),
      legacy(),
      quasar({
        sassVariables: 'src/style/quasar-variables.sass'
      }),
      vue({
        template: { transformAssetUrls }
      })
    ],
    base:'./',
    build: isApp ? appBuild : baseBuild,
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
      port:6699,
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
  }
});
