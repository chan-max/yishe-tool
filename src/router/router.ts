import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import design from '../components/design/designiy.vue'
import signup from '../views/user/signup.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: home,
    },
    {
        path: '/signup',
        name: 'Signup',
        component: signup
    },
    {
        path: '/design',
        name: 'design',
        component: design,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
