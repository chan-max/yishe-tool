/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-20 08:07:02
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 15:06:56
 * @FilePath: /yishe/src/modules/main/main.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import { createApp } from 'vue'
import 'animate.css';
import 'default-passive-events'
import "tailwindcss/tailwind.css"
import { createPinia } from 'pinia'

import router from '../main/router'
import i18n from '@/i18n/index.ts'
import 'animate.css';
import '@/style/base.less'
import 'default-passive-events'

import Antd from 'ant-design-vue'
//  import "ant-design-vue/dist/antd.css";
import '@/style/cover-antdesign.less'

import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'element-plus/dist/index.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import {syncUserInfoToLocal} from '@/store/stores/login.ts'
import App from './App.vue'
import 'element-plus/dist/index.css'
import '@/style/cover-elementplus.scss'

const app = createApp(App)

 const pinia = createPinia()

app.use(pinia)

syncUserInfoToLocal()

app.use(VueVirtualScroller)

app.use(Antd)

app.use(i18n)

app.use(router)

app.use(ElementPlus)

app.config.globalProperties.__DEV__ = import.meta.env.DEV

app.mount('#app')



















