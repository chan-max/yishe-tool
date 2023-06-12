import { createApp } from 'vue'
import App from './views/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router/router'
import './style/cover-elementplus.scss'
import './style/cover-antdesign.less'
import i18n from './i18n/index'


const app = createApp(App)
app.use(router)

app.use(Antd)

app.use(i18n)

const pinia = createPinia()
app.use(pinia)

app.use(ElementPlus)


app.mount('#app')