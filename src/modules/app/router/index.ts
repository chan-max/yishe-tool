/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-11-28 01:16:00
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-01 22:17:57
 * @FilePath: /1s/src/modules/app/router/index.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */
import { createRouter, createWebHistory,createWebHashHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import home from '../views/home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home/index'
  },
  {
    path:'/scan',
    name:'Scan',
    component:() => import('../views/scan/index.vue')
  },
  {
    path:'/login',
    name:'Login',
    component:() => import('../views/login/index.vue')
  },
  {
    path: '/home/',
    name:'Home',
    component: home,
    children: [ 
      {
        path: '',
        redirect: '/home/index'
      },
      {
        name:'HomeIndex',
        path: 'index',
        component: () => import('../views/index/index.vue')
      },
      {
        path: 'market',
        component: () => import('../views/market/index.vue')
      },
      {
        path: 'workspace',
        component: () => import('../views/workspace/index.vue')
      },
      {
        path: 'talk',
        component: () => import('../views/talk/index.vue')
      },
      {
        path: 'user',
        component: () => import('../views/user/index.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
