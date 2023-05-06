import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import signup from '../views/user/signup.vue'
import signin from '@/views/user/signin.vue'
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
        path: '/signin',
        name: 'Signin',
        component: signin
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
