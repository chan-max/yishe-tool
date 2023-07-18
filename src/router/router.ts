import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import home from '../views/base/home.vue'
import signup from '../views/user/signup.vue'
import login from '../views/user/login.vue'
import design from '../views/main/design.vue'
import search from '@/views/base/search.vue'
import admin from '@/admin/index.vue'
import unknown from '@/views/base/unknown.vue'

import {adminRoutes} from '@/admin/router'




const routes = [
    {
        path: '/',
        name: 'Home',
        component: home,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: admin,
        children:adminRoutes,
        meta:{
            hideHeader:true
        }
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
    {
        path: '/:catchAll(.*)',
        name: 'Unknown',
        component: unknown,
        meta:{
            hideHeader:true
        }
    },
]   

const router = createRouter({
    history: createWebHashHistory(),
    routes:routes as any
})



import { blockAdminPage,blockLoginPage } from './routerInterception'

blockLoginPage(router)
blockAdminPage(router)

export default router
