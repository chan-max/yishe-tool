import { signupHook } from "./api/base/signup.js";
import { loginHook } from './api/base/login.js'

export const initRouter = (router, sequelize, app) => {
    let hooks = [
        loginHook,
        signupHook
    ]
    hooks.forEach((hook) => hook(router, sequelize, app))
}