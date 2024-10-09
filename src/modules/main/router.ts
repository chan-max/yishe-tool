import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

export const adminRoute = {
  path: "/admin",
  name: "Admin",
  component: () => import('./view/admin/index.vue'),
  meta: {
    header: false,
    title: '衣设管理系统'
  },
  children: [
    {
      name: "AdminHome",
      path: "home",
      component: () => import('./view/admin/view/home.vue'),
      meta: {
        title: '首页',
        header: false,
      }
    },
    {
      name: "AdminSource",
      path: "source",
      meta: {
        title: '资源管理',
        header: false,
      },
      children: [
        {
          name: "AdminProductModel",
          path: "productModel",
          component: () => import('./view/admin/view/source/productModel/index.vue'),
          meta: {
            title: '基础产品模型',
            header: false,
          },
        },
        {
          name: "AdminCustomModel",
          path: "customModel",
          component: () => import('./view/admin/view/source/customModel/index.vue'),
          meta: {
            title: '自定义模型',
            header: false,
          },
        },
        {
          name: "AdminResource",
          path: "resource",
          component: () => import('./view/admin/view/source/resource/index.vue'),
          meta: {
            title: '服装管理',
            header: false,
          },
        },
      ],
    },
    {
      name: "AdminUser",
      path: "user",
      meta: {
        title: '用户管理',
        header: false,
      },
      children: [
        {
          name: "AdminCompany",
          path: "company",
          component: () => import('./view/admin/view/user/company/index.vue'),
          meta: {
            title: '公司管理',
            header: false,
          },
          children: [

          ]
        },
        {
          name: "AdminUserList",
          path: "UserList",
          component: () => import('./view/admin/view/user/userList/index.vue'),
          meta: {
            title: '用户',
            header: false,
          },
          children: [

          ]
        },
      ]
    },
  ],
}

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
    meta: {
      header: true,
      footer: true,
      auth: false
    }
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
    meta: {
      header: true
    }
  },
  // {
  //   path: "/seller",
  //   name: "Seller",
  //   component: () => import("./view/workspace/index.vue"),
  //   meta: {
  //     header: true,
  //     title: '设计室'
  //   }
  // },
  {
    path: "/UserProfile",
    name: "UserProfile",
    component: () => import('./view/user/update/index.vue'),
    meta: {
      header: false
    }
  },
  {
    path: '/ai',
    name: 'Ai',
    component: () => import('./view/ai/index.vue')
  },
  {
    path: '/stickerDesign',
    name: 'StickerDesign',
    component: () => import('./view/design/sticker/index.vue')
  },
  {
    path: '/1s',
    name: '1s',
    component: () => import('./view/design/core/index.vue')
  },
  adminRoute
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
