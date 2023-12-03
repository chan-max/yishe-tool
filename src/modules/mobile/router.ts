import { createRouter, createWebHashHistory } from "vue-router";
import login from './view/user/login/index.vue'
import index from './view/index/index.vue';
import signup from './view/user/signup/index.vue';
const routes = [
    {
        path: "/",
        name: "Home",
        component: index,
        meta:{
            footer:true
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
] 

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});