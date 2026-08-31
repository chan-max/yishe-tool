import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: {
      name: "Design",
    },
  },
  {
    path: "/design",
    alias: ["/1s"],
    name: "Design",
    component: () => import("./view/main/design.vue"),
    meta: {
      header: true,
      title: "设计工具",
    },
  },
  {
    path: "/oauth/callback",
    name: "OAuthCallback",
    component: () => import("./view/user/login/OAuthCallback.vue"),
    meta: {
      title: "授权登录",
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: {
      name: "Design",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

import { initDocumentTitle } from "../../router/routerInterception";

initDocumentTitle(router);

export default router;
