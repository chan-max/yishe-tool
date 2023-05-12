import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import signup from '../views/user/signup.vue'
import login from '@/views/user/login.vue'
import design from '@/views/main/design.vue'

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
        path: '/login',
        name: 'Login',
        component: login
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
