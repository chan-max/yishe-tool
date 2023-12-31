
import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css';
import 'default-passive-events'
import "tailwindcss/tailwind.css"
import { createPinia } from 'pinia'

import router from '../main/router'
import i18n from '@/i18n/index'
import 'animate.css';
import '@/style/base.less'
import 'default-passive-events'

import Antd from 'ant-design-vue'
//  import "ant-design-vue/dist/antd.css";
import '@/style/cover-antdesign.less'

import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import '@/style/cover-elementplus.scss'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'


export function createMainApp(){
    const app = createApp(App)

    app.use(VueVirtualScroller)

    app.use(Antd)
    
    app.use(i18n)
    
    const pinia = createPinia()
    
    app.use(pinia)
    
    app.use(router)
    
    app.use(ElementPlus)
    
    app.config.globalProperties.__DEV__ = import.meta.env.DEV
    
    app.mount('#app')
}


















