import { createApp } from 'vue'
import App from './views/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import router from './router/router'
import './style/cover-elementplus.scss'
import './style/cover-antdesign.less'
import i18n from './i18n/index'
import './style/index.less'
import 'element-plus/theme-chalk/display.css'
import '@icon-park/vue/styles/index.css'
import { setupAction } from './actions/setupAction';
import './resource/fontAwesome'
import 'animate.css';
import './style/base.less'

import { FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(Antd)

app.use(i18n)
 
const pinia = createPinia()

app.use(pinia)

app.use(router)

app.use(ElementPlus)

setupAction(app,router,pinia)

app.config.globalProperties.__DEV__ = import.meta.env.DEV



app.mount('#app')


