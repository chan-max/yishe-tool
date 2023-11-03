import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

import home from "../views/base/home/home.vue";
import signup from "../views/user/signup.vue";
import login from "../views/user/login.vue";
import design from "../views/main/design.vue";
import search from "@/views/base/search.vue";
import workspace from "@/views/workspace/index.vue";
import market from "@/views/market/index.vue";
import unknown from "@/views/base/unknown.vue";
import admin from "@/views/admin/index.vue";
import index from "@/views/admin/index.vue";
import adminHome from "@/views/admin/view/home.vue";
import modelIndex from "@/views/admin/view/model/index/index.vue";
import modelUpload from "@/views/admin/view/model/modelUpload.vue";

import imageIndex from "@/views/admin/view/image/index/index.vue";
import imageUpload from "@/views/admin/view/image/imageUpload.vue";

import fontIndex from "@/views/admin/view/font/fontUpload.vue";
import fontUpload from "@/views/admin/view/font/fontUpload.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: home,
  },
  {
    path: "/admin",
    name: "Admin",
    component: admin,
    header: false,
    children: [
      {
        name: "Admin",
        path: "",
        component: adminHome,
        header: false,
      },
      {
        path: "model",
        name: "Model",
        component: modelIndex,
        header: false,
      },
      {
        path: "model/upload",
        name: "ModelUpload",
        component: modelUpload,
        header: false,
      },
      {
        path: "image",
        name: "Image",
        component: imageIndex,
        header: false,
      },
      {
        path: "image/upload",
        name: "ImageUpload",
        component: imageUpload,
        header: false,
      },

      {
        path: "font",
        name: "Font",
        component: fontIndex,
        header: false,
      },
      {
        path: "font/upload",
        name: "FontUpload",
        component: fontUpload,
        header: false,
      },
    ],
  },
  {
    path: "/signup",
    name: "Signup",
    component: signup,
    header: true,
  },
  {
    path: "/login",
    name: "Login",
    component: login,
    header: true,
  },
  {
    path: "/design",
    name: "Design",
    component: design,
    header: false,
  },
  {
    path: "/search",
    name: "Search",
    component: search,
  },
  {
    path: "/workspace",
    name: "Workspace",
    component: workspace,
  },
  {
    path: "/market",
    name: "Market",
    component: market,
  },
  {
    path: "/:catchAll(.*)",
    name: "Unknown",
    component: unknown,
  },
];

let _routes = routeTransform(routes as any);

const router = createRouter({
  history: createWebHashHistory(),
  routes: _routes,
});

import { blockAdminPage, blockLoginPage } from "./routerInterception";
import { routeTransform } from "./routeTransform";

blockLoginPage(router);
blockAdminPage(router);

export default router;
