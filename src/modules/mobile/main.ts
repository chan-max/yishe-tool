/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-30 22:30:56
 * @FilePath: /1s/src/modules/mobile/main.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */

import { createApp } from 'vue'
import App from '../mobile/App.vue'
import { ConfigProvider } from 'vant';
import 'animate.css';
import 'default-passive-events'
import 'vant/lib/index.css';

import VConsole from 'vconsole';
import ElementPlus from 'element-plus'

import { createPinia } from 'pinia'
import { router} from '../mobile/router'

import '@/style/cover-antdesign.less'
import 'animate.css';
import '@/style/base.less'
import 'default-passive-events'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import '@/style/cover-elementplus.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'



export function createMobileApp(){
const app = createApp(App)
const vConsole = new VConsole({ theme: 'dark' });
app.use(ElementPlus)

app.use(ConfigProvider);
const pinia = createPinia()

app.use(pinia)

app.use(router)

app.mount('#app')
}















