/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 22:31:41
 * @FilePath: /yishe/vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */

import { defineConfig, loadEnv } from "vite";
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
// import AntdvResolver from 'antdv-component-resolver'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import svgLoader from 'vite-svg-loader'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from "unplugin-auto-import/vite";

import { viteObfuscateFile } from 'vite-plugin-obfuscator'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig((config: any) => {

  const isApp = config.mode === 'app'
  const isServer = config.mode === 'server'


  const baseBuild = {
    outDir: 'www',
    assetsDir: './',
    rollupOptions: {
      input: {
        mobile: resolve(__dirname, 'mobile.html'),
        index: resolve(__dirname, 'index.html'),
      },
    }
  }

  const appBuild = {
    outDir: 'app',
    assetsDir: './',
    rollupOptions: {
      input: resolve(__dirname, 'app.html'),
    }
  }

  return {
    plugins: [
      alias(),
      // https dev
      basicSsl(),
      Components({
        resolvers: [VantResolver()],
      }),
      qrcode(),
      legacy(),
      quasar({
        sassVariables: 'src/style/quasar-variables.sass'
      }),
      vue({
        template: { transformAssetUrls }
      }),
      svgLoader(),
      vueJsx({
      }),

      // 自动引入
      AutoImport({
        imports: ["vue", "vue-router"],
        dts: true
      }),

      // 代码加密
      // viteObfuscateFile({
      //   compact: true,
      //   controlFlowFlattening: false,
      //   controlFlowFlatteningThreshold: 0.75,
      //   deadCodeInjection: false,
      //   deadCodeInjectionThreshold: 0.4,
      //   debugProtection: false,
      //   debugProtectionInterval: 0,
      //   disableConsoleOutput: false,
      //   domainLock: [],
      //   domainLockRedirectUrl: 'about:blank',
      //   forceTransformStrings: [],
      //   identifierNamesCache: null,
      //   identifierNamesGenerator: 'hexadecimal',
      //   identifiersDictionary: [],
      //   identifiersPrefix: '',
      //   ignoreImports: false,
      //   inputFileName: '',
      //   log: false,
      //   numbersToExpressions: false,
      //   optionsPreset: 'default',
      //   renameGlobals: false,
      //   renameProperties: false,
      //   renamePropertiesMode: 'safe',
      //   reservedNames: [],
      //   reservedStrings: [],
      //   seed: 0,
      //   selfDefending: false,
      //   simplify: true,
      //   sourceMap: false,
      //   sourceMapBaseUrl: '',
      //   sourceMapFileName: '',
      //   sourceMapMode: 'separate',
      //   sourceMapSourcesMode: 'sources-content',
      //   splitStrings: false,
      //   splitStringsChunkLength: 10,
      //   stringArray: true,
      //   stringArrayCallsTransform: true,
      //   stringArrayCallsTransformThreshold: 0.5,
      //   stringArrayEncoding: [],
      //   stringArrayIndexesType: [
      //     'hexadecimal-number'
      //   ],
      //   stringArrayIndexShift: true,
      //   stringArrayRotate: true,
      //   stringArrayShuffle: true,
      //   stringArrayWrappersCount: 1,
      //   stringArrayWrappersChainedCalls: true,
      //   stringArrayWrappersParametersMaxCount: 2,
      //   stringArrayWrappersType: 'variable',
      //   stringArrayThreshold: 0.75,
      //   target: 'browser',
      //   transformObjectKeys: false,
      //   unicodeEscapeSequence: false
      // }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/icon")],
        // 指定symbolId格式
        symbolId: 'icon-[name]',
      })
    ],
    base: isApp ? './' : '/', // 普通路径与app路径处理方式不同
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
      port: 6699,
      proxy: {
        "/api": {
          target: "http://localhost:7788",
          changeOrigin: true,
          secure: false, // 防止证书引发的🙋
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
