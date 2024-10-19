import { createRouter, createWebHashHistory } from "vue-router";
import login from './view/user/login/index.vue'
import index from './view/index/index.vue';
import signup from './view/user/signup/index.vue';
import scan from './view/scan/index.vue';
import me from './view/me/index.vue';


const routes = [
    {
        path: "/",
        name: "Home",
        component: index,
        meta: {
            footer: true,
            header: true
        }
    },
    {
        path: "/me",
        name: "Me",
        component: me,
        meta: {
            footer: true,
            header: true
        }
    },
    {
        path: "/login",
        name: "Login",
        component: login,
    },
    {
        path: "/signup",
        name: "Signup",
        component: signup,
    },
    {
        path: "/scan",
        name: "Scan",
        component: scan,
        meta: {
            header: false,
            footer: false,
        }
    },
    {
        path: "/customModel",
        name: "customModel",
        component: () => import('./view/content/customModel/index.vue'),
        meta: {
            header: false,
            footer: false,
        }
    },
    {
        path: "/productModel",
        name: "productModel",
        component: () => import('./view/content/productModel/index.vue'),
        meta: {
            header: false,
            footer: false,
        }
    },
    {
        path: "/sticker",
        name: "sticker",
        component: () => import('./view/content/sticker/index.vue'),
        meta: {
            header: false,
            footer: false,
        }
    },
    {
        path: "/createSticker",
        name: "createSticker",
        component: () => import('./view/create/sticker/index.vue'),
        meta: {
            header: false,
            footer: false,
        }
    },
    {
        path: "/quickCreate",
        name: "quickCreate",
        component: () => import('./view/create/index.vue'),
        meta: {
            header: false,
            footer: false,
        }
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});