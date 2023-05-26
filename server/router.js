import { signupHook } from "./api/base/signup.js";
import { loginHook } from './api/base/login.js'
import {getBannerModelHook} from './api/common/getBannerModel.js'
import {getBaseModelListHook} from './api/common/getBaseModelList.js'

export const initRouter = (router, sequelize, app) => {
    let hooks = [
        loginHook,
        signupHook,
        getBannerModelHook,
        getBaseModelListHook
    ]
    hooks.forEach((hook) => hook(router, sequelize, app))
}