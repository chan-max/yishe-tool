
import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css';
import 'default-passive-events'
import "tailwindcss/tailwind.css"
import ElementPlus from 'element-plus'

import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import router from '../main/router'

import '@/style/cover-elementplus.scss'
import '@/style/cover-antdesign.less'
import i18n from '@/i18n/index'


import 'animate.css';
import '@/style/base.less'
import 'default-passive-events'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/dark/css-vars.css'



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


















