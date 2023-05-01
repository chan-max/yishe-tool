import { signUpHook } from "./api/signup.js";

export function initRouter(router, sequelize, app) {
    signUpHook.call(null,...arguments)
}