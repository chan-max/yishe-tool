import { createRouter, createWebHashHistory } from "vue-router";
import login from './view/user/login/index.vue'
import index from './view/index/index.vue';
import signup from './view/user/signup/index.vue';
import scan from './view/scan/index.vue';

const routes = [
    {
        path: "/",
        name: "Home",
        component: index,
        meta:{
            footer:true,
            header:true
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
        meta:{
            header:false,
            footer:false,
        }
    },
] 

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});