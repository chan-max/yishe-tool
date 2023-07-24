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
        header:false,
        children:adminRoutes,
    },
    {
        path: '/signup',
        name: 'Signup',
        component: signup,
    },
    {
        path: '/login',
        name: 'Login',
        component: login,
    },
    {
        path: '/design',
        name: 'Design',
        component: design,
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
    },
]   


let _routes = routeTransform(routes as any)

const router = createRouter({
    history: createWebHashHistory(),
    routes:_routes ,
})



import { blockAdminPage,blockLoginPage } from './routerInterception'
import { routeTransform } from './routeTransform'

blockLoginPage(router)
blockAdminPage(router)

export default router
