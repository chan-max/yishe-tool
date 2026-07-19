import { publicAppConfig } from "@/config/public";
import { setBaseDocumentTitle } from "@/services/designTabStatus";

export const initDocumentTitle = (router) => {
  router.beforeEach((to, from, next) => {
    const title = to.meta.title
      ? `${publicAppConfig.appName} - ${to.meta.title}`
      : publicAppConfig.appName
    setBaseDocumentTitle(title)
    next()
  })
}
