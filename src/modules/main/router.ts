import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";


const routes = [
  {
    path: "/:catchAll(.*)",
    name: "Unknown",
    component: () => import("./view/base/unknown.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import('./view/base/home/home.vue'),
    meta:{
      header:true,
      footer:true,
      auth:false
    }
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import('./view/admin/index.vue'),
    meta: {
      header: false,
    },
    children: [
      {
        name: "Admin",
        path: "",
        component: () => import('./view/admin/view/home.vue'),
        meta: {
          header: false,
        }
      },
      {
        path: "model",
        name: "Model",
        component: () => import("./view/admin/view/model/index/index.vue"),
        meta: {
          header: false,
        }
      },
      {
        path: "model/upload",
        name: "ModelUpload",
        component: () => import("./view/admin/view/model/modelUpload.vue"),
        meta: {
          header: false,
        }
      },
      {
        path: "image",
        name: "Image",
        component: () => import("./view/admin/view/image/index/index.vue"),
        meta: {
          header: false,
        }
      },
      {
        path: "image/upload",
        name: "ImageUpload",
        component: () => import("./view/admin/view/image/imageUpload.vue"),
        meta: {
          header: false,
        }
      },

      {
        path: "font",
        name: "Font",
        component: () => import("./view/admin/view/font/fontUpload.vue"),
        meta: {
          header: false,
        }
      },
      {
        path: "font/upload",
        name: "FontUpload",
        component: () => import("./view/admin/view/font/fontUpload.vue"),
        meta: {
          header: false,
        }
      },
      {
        path: "user",
        name: "AdminUserManage",
        component: () => import('./view/admin/view/user/index.vue'),
        meta: {
          header: false,
        }
      },
    ],
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("./view/user/signup.vue"),
    meta: {
      header: false,
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("./view/user/login/index.vue"),
    meta: {
      header: false,
    }
  },
  {
    path: "/design",
    name: "Design",
    component: () => import("./view/main/design.vue"),
    meta: {
      header: false,
      title: '设计室'
    }
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("./view/base/search.vue"),
  },
  {
    path: "/workspace",
    name: "Workspace",
    component: () => import("./view/workspace/index.vue"),
    meta: {
      header: true,
      title: '设计室'
    }
  },
  {
    path: "/market",
    name: "Market",
    component: () => import("./view/market/index.vue"),
    meta:{
      header:true
    }
  },
  {
    path: "/seller",
    name: "Seller",
    component: () => import("./view/workspace/index.vue"),
    meta: {
      header: true,
      title: '设计室'
    }
  },
  {
    path: "/update",
    name: "Update",
    component: () => import('./view/user/update/index.vue'),
    meta: {
      header: false
    }
  },
  {
    path: '/ai',
    name: 'Ai',
    component: () => import('./view/ai/index.vue')
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
