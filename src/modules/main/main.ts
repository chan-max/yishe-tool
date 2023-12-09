import { createApp } from 'vue'
import App from './view/App.vue'
import "tailwindcss/tailwind.css"
import ElementPlus from 'element-plus'

import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import router from './router'
import 'element-plus/dist/index.css'
import '@/style/cover-elementplus.scss'
import 'element-plus/theme-chalk/display.css'
import '@/style/cover-antdesign.less'
import i18n from '@/i18n/index'

import { setupAction } from '@/actions/setupAction';
import 'animate.css';
import '@/style/base.less'
import 'default-passive-events'



const app = createApp(App)


app.use(Antd)

app.use(i18n)
 
const pinia = createPinia()

app.use(pinia)

app.use(router)

app.use(ElementPlus)

setupAction(app,router,pinia)

app.config.globalProperties.__DEV__ = import.meta.env.DEV

app.mount('#app')
