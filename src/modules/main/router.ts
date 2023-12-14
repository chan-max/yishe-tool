import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

import home from "./view/base/home/home.vue";
import signup from "./view/user/signup.vue";
import login from "./view/user/login.vue";
import design from "./view/main/design.vue";
import search from "./view/base/search.vue";
import workspace from "./view/workspace/index.vue";
import market from "./view/market/index.vue";
import unknown from "./view/base/unknown.vue";
import admin from "./view/admin/index.vue";
import adminHome from "./view/admin/view/home.vue";
import modelIndex from "./view/admin/view/model/index/index.vue";
import modelUpload from "./view/admin/view/model/modelUpload.vue";
import imageIndex from "./view/admin/view/image/index/index.vue";
import imageUpload from "./view/admin/view/image/imageUpload.vue";
import fontIndex from "./view/admin/view/font/fontUpload.vue";
import fontUpload from "./view/admin/view/font/fontUpload.vue";
import update from './view/user/update/index.vue'
import adminUserManage from './view/admin/view/user/index.vue'
import ai from './view/ai/index.vue';

const routes = [
  {
    path: "/:catchAll(.*)",
    name: "Unknown",
    component: unknown,
  },
  {
    path: "/",
    name: "Home",
    component: home,
    meta:{
      header:true,
    }
  },
  {
    path: "/admin",
    name: "Admin",
    component: admin,
    meta: {
      header: false,
    },
    children: [
      {
        name: "Admin",
        path: "",
        component: adminHome,
        meta: {
          header: false,
        }
      },
      {
        path: "model",
        name: "Model",
        component: modelIndex,
        meta: {
          header: false,
        }
      },
      {
        path: "model/upload",
        name: "ModelUpload",
        component: modelUpload,
        meta: {
          header: false,
        }
      },
      {
        path: "image",
        name: "Image",
        component: imageIndex,
        meta: {
          header: false,
        }
      },
      {
        path: "image/upload",
        name: "ImageUpload",
        component: imageUpload,
        meta: {
          header: false,
        }
      },

      {
        path: "font",
        name: "Font",
        component: fontIndex,
        meta: {
          header: false,
        }
      },
      {
        path: "font/upload",
        name: "FontUpload",
        component: fontUpload,
        meta: {
          header: false,
        }
      },
      {
        path: "user",
        name: "AdminUserManage",
        component: adminUserManage,
        meta: {
          header: false,
        }
      },
    ],
  },
  {
    path: "/signup",
    name: "Signup",
    component: signup,
    meta: {
      header: false,
    }
  },
  {
    path: "/login",
    name: "Login",
    component: login,
    meta: {
      header: false,
    }
  },
  {
    path: "/design",
    name: "Design",
    component: design,
    meta: {
      header: false,
      title: '设计室'
    }
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
    path: "/update",
    name: "Update",
    component: update,
    meta: {
      header: false
    }
  },
  {
    path: '/ai',
    name: 'Ai',
    component: ai
  }
];


const router = createRouter({
  history: createWebHashHistory(),
  routes: routes as any,
});


import { blockAdminPage, blockLoginPage, initDocumentTitle } from "../../router/routerInterception";

blockLoginPage(router);
blockAdminPage(router);
initDocumentTitle(router)

export default router;
