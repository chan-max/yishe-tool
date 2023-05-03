import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import designiy from '@component/design/index.vue'
import signup from '../views/user/signup.vue'
import signin from '@view/user/signin.vue'


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
        component: designiy,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
