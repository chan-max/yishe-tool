import {getBannerModelHook} from './api/common/getBannerModel.js'
import {getBaseModelListHook} from './api/common/getBaseModelList.js'
import {getBaseSkyboxHook } from "./api/common/getSkybox.js";
import { getWebStickersHook } from "./api/design/getStickers.js";
import { textStickerHook,uploadFontHook,getFontsHook } from "./api/text/textSticker.js";
import { baseModelUploadHook } from "./api/base/baseModelUpload.js";
import { signupHook ,getUserListHook,updateUserInfoHook,loginHook } from "./api/user.js";
import {imageUploadHook} from './api/base/imageUpload.js'
import { getImageListHook } from './api/common/getImageList.js';
import { uploadModelHook } from './api/base/uploadModel.js';
import {getModelListHook} from './api/model.js';
import {sendEmailHook} from './api/email.js'

export const initRouter = (router, sequelize, app) => {
    let hooks = [
        loginHook,
        signupHook,
        getBannerModelHook,
        getBaseModelListHook,
        getBaseSkyboxHook,
        getWebStickersHook,
        baseModelUploadHook,
        imageUploadHook,
        getImageListHook,
        textStickerHook,
        uploadFontHook,
        getFontsHook,
        uploadModelHook,
        getModelListHook,
        sendEmailHook,
        getUserListHook,
        updateUserInfoHook
    ]
    hooks.forEach((hook) => hook(router, sequelize, app))
}