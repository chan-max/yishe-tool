/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-20 08:07:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-27 06:06:52
 * @FilePath: /yishe/src/modules/main/main.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import { createApp } from 'vue'
import 'animate.css';
// import 'default-passive-events'
import "tailwindcss/tailwind.css"
import { createPinia } from 'pinia'

import router from '../main/router'
import i18n from '@/i18n/index.ts'
import '@/style/base.less'
import '@/style/vars.less'

// 引入 Puppeteer 桥接对象
import '@/common/utils/puppeteerBridge'

import Antd from 'ant-design-vue'
//  import "ant-design-vue/dist/antd.css";


import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import App from './App.vue'
import 'element-plus/dist/index.css'
import '@/style/cover-elementplus.scss'
import { apiInstance } from "@/api/apiInstance";
import { defaultResponseInterceptors } from '@/api/apiInterception'
import { RecycleScroller } from 'vue-virtual-scroller'
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css"; //required if you're not going to override default slots
import Api from '@/api'

import '@/style/cover-antdesign.less'
import { s1Plugin } from '@/components/export.ts'

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import Utils from '@/common/utils'

// 引入注册组件
import 'virtual:svg-icons-register'
import AnimateOnScroll from 'primevue/animateonscroll';
import VueMagnifier from '@websitebeaver/vue-magnifier'
import '@websitebeaver/vue-magnifier/styles.css'

// 引入自动化遮罩层组件
import AutomationOverlay from '@/components/automationOverlay.vue'

import { useConfigStore, initConfigStoreBasicConfig } from '@/store/stores/config.ts';
import { useLoginStatusStore, initLoginStoreUserInfo } from '@/store/stores/login';
import to from 'await-to-js';
import { NativeWindowMessenger } from '@/utils/nativeWindowMessenger'
import { setAdminConnected } from '@/store/stores/connectionStatus'


async function setup() {


    // pc 端专有的拦截器
    apiInstance.interceptors.response.use(defaultResponseInterceptors);

    const app = createApp(App)

    const pinia = createPinia()

    app.use(s1Plugin)

    app.use(VxeUI).use(VxeUITable)

    app.component("InfiniteLoading", InfiniteLoading);

    app.component('s1Mangnifier', VueMagnifier)

    // 注册自动化遮罩层组件
    app.component('AutomationOverlay', AutomationOverlay)

    app.directive('animateonscroll', AnimateOnScroll);

    app.use(pinia)

    app.use(VueVirtualScroller)

    app.use(Antd)

    app.use(i18n)

    app.use(router)

    app.use(ElementPlus)

    app.config.globalProperties.__DEV__ = import.meta.env.DEV

    await initLoginStoreUserInfo()

    await initConfigStoreBasicConfig()

    app.mount('#app')

}

import { createMobileApp } from '@/modules/mobile/main'

console.log("%c 希望小李天天开心! %c", "background: pink;color:#fff;padding:2px 5px;border-radius: 5px;line-height: 16px;", "")

if (Utils.isMobile) {
    createMobileApp()
} else {
    setup()
}

if (window.opener) {
  const messenger = new NativeWindowMessenger()
  // 监听父窗口请求
  messenger.on('test', () => {
    messenger.send('customEvent', 'connected')
  })
  // 监听 ping 并回复 pong
  messenger.on('ping', () => {
    messenger.send('pong', null)
  })
  // 管理系统心跳检测
  let adminPongTimeout: number | null = null
  function sendAdminPing() {
    messenger.send('adminPing', null)
    // 超时未收到 adminPong 认为断开
    adminPongTimeout = window.setTimeout(() => {
      setAdminConnected(false)
    }, 3000)
  }
  // 监听 adminPong
  messenger.on('adminPong', () => {
    setAdminConnected(true)
    if (adminPongTimeout) {
      clearTimeout(adminPongTimeout)
      adminPongTimeout = null
    }
  })
  // 定时发送 adminPing
  setInterval(sendAdminPing, 5000)
  // 首次立即检测
  sendAdminPing()
}



















