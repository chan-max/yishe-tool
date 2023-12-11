import { isLogin } from "@/store/stores/loginAction";
import { useLoginStatusStore } from "@/store/stores/login";

export const blockLoginPage = (router) => {
  router.beforeEach((to, from, next) => {
    if (to.name === "Login" && isLogin()) {
      next({ name: "Home" });
    } else {
      next();
    }
  });
};


export const blockAdminPage = (router) => {
  router.beforeEach((to, from, next) => {
    let loginStatusStore = useLoginStatusStore();
    if (to.name === "Admin" && !loginStatusStore.isAdmin) {
      next({ name: "Home" });
    } else {
      next();
    } 
  });
};


export const initDocumentTitle = (router) => {
  router.beforeEach((to,from,next) => {
    document.title = to.meta.title || '1s'
    next()
  })
}