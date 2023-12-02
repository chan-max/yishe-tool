import { createApp } from 'vue'
import App from './App.vue'
import "tailwindcss/tailwind.css"
import { ConfigProvider } from 'vant';
import { createPinia } from 'pinia'
import 'animate.css';
import 'default-passive-events'
import ElementPlus from 'element-plus'


import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '../../style/cover-elementplus.scss'
import '../../style/base.less'



import {router} from './router'

const app = createApp(App)

app.use(ElementPlus)

app.use(ConfigProvider);
const pinia = createPinia()

app.use(pinia)

app.use(router)

app.mount('#app')



