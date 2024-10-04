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
// import 'default-passive-events'
import "tailwindcss/tailwind.css"
import { createPinia } from 'pinia'

import router from '../main/router'
import i18n from '@/i18n/index.ts'
import 'animate.css';
import '@/style/base.less'
import '@/style/vars.less'


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


// 引入注册组件
import 'virtual:svg-icons-register'

// pc 端专有的拦截器
apiInstance.interceptors.response.use(defaultResponseInterceptors);

const app = createApp(App)

app.use(s1Plugin)

app.use(VxeUI).use(VxeUITable)

app.component("InfiniteLoading", InfiniteLoading);

const pinia = createPinia()

app.use(pinia)

app.use(VueVirtualScroller)

app.use(Antd)

app.use(i18n)

app.use(router)

app.use(ElementPlus)

app.config.globalProperties.__DEV__ = import.meta.env.DEV


import { useConfigStore } from '@/store/stores/config.ts';
import { useLoginStatusStore } from '@/store/stores/login';
import to from 'await-to-js';


async function setup() {

    const loginStore = useLoginStatusStore()
    const configStore = useConfigStore()

    const config = await Api.getBasicConfig()
    configStore.$patch(config)

    if (loginStore.isLogin) {
       let [err,res] =  await to(loginStore.getUserInfo())
    }
    app.mount('#app')

}




setup()



















