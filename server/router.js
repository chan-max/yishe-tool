import { signUpHook } from "./api/base/signUp.js";
import { signInHook } from './api/base/signIn.js'

export const initRouter = (router, sequelize, app) => {
    let hooks = [
        signInHook,
        signUpHook
    ]
    hooks.forEach((hook) => hook(router, sequelize, app))
}