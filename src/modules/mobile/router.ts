import { createRouter, createWebHashHistory } from "vue-router";
import login from './view/user/login/index.vue'
import index from './view/index/index.vue';
import signup from './view/user/signup/index.vue';
import scan from './view/scan/index.vue';
import me from './view/me/index.vue';
import { ref } from 'vue'

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
    {
        path: "/design",
        name: "design",
        component: () => import('./view/design/index.vue'),
        meta: {
            header: false,
            footer: false,
        }
    },
]




const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});

// 用于存储访问过的路由信息
export const routeRecords = ref([])

// 导航守卫
router.beforeEach((to, from, next) => {
    // 记录当前访问的路由
    const routeInfo = {
        name: to.name,
        path: to.path,
        timestamp: new Date().toISOString(), // 记录访问时间
    };

    routeRecords.value.push(routeInfo); // 将当前路由信息添加到数组中
    next();
});

// 提供一个方法来获取访问过的路由信息
export function getVisitedRoutes() {
    return routeRecords.value;
}


export {
    router
}