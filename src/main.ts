import { createApp } from 'vue'
import App from './views/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createPinia } from 'pinia'

import router from './router/router'

const app = createApp(App)
app.use(router)

const pinia = createPinia()
app.use(pinia)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')