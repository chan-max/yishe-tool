import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import home from '../views/base/home.vue'
import signup from '../views/user/signup.vue'
import login from '../views/user/login.vue'
import design from '../views/main/design.vue'
import search from '@/views/base/search.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: home,
    },
    {
        path: '/signup',
        name: 'Signup',
        component: signup,
        meta:{
            hideHeader:true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: login,
        meta:{
            hideHeader:true
        }
    },
    {
        path: '/design',
        name: 'Design',
        component: design,
        meta:{
            hideHeader:true
        }
    },
    {
        path: '/search',
        name: 'Search',
        component: search,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})



export default router
