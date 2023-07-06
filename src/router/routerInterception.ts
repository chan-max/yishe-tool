import { isLogin } from "@/actions/loginAction"

export const blockLoginPage = (router) => {
    router.beforeEach((to, from, next) => {
        if(to.name === 'Login' && isLogin()){
            next({name:'Home'})
        }else{
            next()
        }
    })
}