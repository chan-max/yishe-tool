import { createRouter, createWebHashHistory } from "vue-router";
import login from './view/user/login/index.vue'

const routes = [
    {
        path: "/",
        name: "Home",
        component: {},
    },
    {
        path: "/login",
        name: "Login",
        component: login,
    },
] 

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});