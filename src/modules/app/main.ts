
/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-02 19:17:55
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-26 22:18:52
 * @FilePath: /1s/src/modules/app/main.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonButton, IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import 'animate.css';

import VConsole from 'vconsole';

/* Theme variables */
import './theme/variables.less';
import './theme/native.less'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/style/cover-elementplus.scss'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import "tailwindcss/tailwind.css"

import { ConfigProvider } from 'vant';
import 'vant/lib/index.css';

import { IonicVue } from '@ionic/vue';


import { createPinia } from 'pinia'

import { syncUserInfoToLocal } from '@/store/stores/login.ts'


if (true || import.meta.env.DEV) {
  const vConsole = new VConsole({ theme: 'dark' });
}

const app = createApp(App)

app.use(ConfigProvider);

const pinia = createPinia()

app.use(pinia)

app.use(router);

app.use(ElementPlus);

app.use(IonicVue, {
  mode: "ios",
  // animated: false, // 不设置该值会存在右滑返回时的错误动画
  swipeGesture: false,
  swipeBackEnabled: false,
  backButtonText:''
});

import { initIonicComponents } from './helper/ionic.ts'

initIonicComponents(app)

import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

router.isReady().then(() => {
  syncUserInfoToLocal()
  app.mount('#app');
});

