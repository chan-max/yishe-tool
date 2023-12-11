
import { createApp } from 'vue'
import App from './App.vue'
import "tailwindcss/tailwind.css"
import { ConfigProvider } from 'vant';
import 'animate.css';
import 'default-passive-events'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '../../style/cover-elementplus.scss'
import '../../style/base.less'
import VConsole from 'vconsole';
import "tailwindcss/tailwind.css"
import ElementPlus from 'element-plus'

import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import router from '../main/router'
import 'element-plus/dist/index.css'
import '@/style/cover-elementplus.scss'
import 'element-plus/theme-chalk/display.css'
import '@/style/cover-antdesign.less'
import i18n from '@/i18n/index'


import 'animate.css';
import '@/style/base.less'
import 'default-passive-events'


function isMobile() {
    const mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile'];
    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i]) > 0) return true;
    return false;
}

export function createMainApp(){
    const app = createApp(App)

    app.use(Antd)
    
    app.use(i18n)
    
    const pinia = createPinia()
    
    app.use(pinia)
    
    app.use(router)
    
    app.use(ElementPlus)
    
    app.config.globalProperties.__DEV__ = import.meta.env.DEV
    
    app.mount('#app')
}


















