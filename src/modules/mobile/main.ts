/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 14:18:59
 * @FilePath: /yishe/src/modules/mobile/main.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */

import { createApp } from 'vue'

import { ConfigProvider } from 'vant';
import 'vant/lib/index.css';

import VConsole from 'vconsole';
import ElementPlus from 'element-plus'

import { createPinia } from 'pinia'
import { router } from '../mobile/router'

import '@/style/cover-antdesign.less'
import 'animate.css';
import '@/style/base.less'
// import 'default-passive-events'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from '../mobile/App.vue'
import 'element-plus/dist/index.css'
import '@/style/cover-elementplus.scss'
import { s1Plugin } from '@/components/export.ts'
import AnimateOnScroll from 'primevue/animateonscroll';
import 'animate.css'
import { useConfigStore ,initConfigStoreBasicConfig} from '@/store/stores/config.ts';
import { useLoginStatusStore,initLoginStoreUserInfo } from '@/store/stores/login';
import to from 'await-to-js';
import { apiInstance } from "@/api/apiInstance";
import Antd from 'ant-design-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 引入中文语言包

import './cover-vant.less'
import './index.less'


import { mobileDefaultResponseInterceptors } from '@/api/apiInterception'

export async function createMobileApp() {

    apiInstance.interceptors.response.use(mobileDefaultResponseInterceptors);

    const app = createApp(App)
    const vConsole = new VConsole({ theme: 'dark' });
    const pinia = createPinia()
    app.directive('animateonscroll', AnimateOnScroll);
    app.use(s1Plugin)
    app.use(ElementPlus,{
        locale: zhCn,
    })
    app.use(ConfigProvider);
    app.use(pinia)
    app.use(router)
    app.use(Antd)


    await initLoginStoreUserInfo()

    await initConfigStoreBasicConfig()

    app.mount('#app')
}















