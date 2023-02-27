import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import design from '../components/designiy.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: home,
    },
    {
        path: '/design',
        name: 'design',
        component: design,
    }
]

 const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
