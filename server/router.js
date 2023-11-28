import { getBannerModelHook } from "./api/common/getBannerModel.js";
import { injectBaseModelRoute } from "./api/baseModel.js";
import { getBaseSkyboxHook } from "./api/common/getSkybox.js";
import { getWebStickersHook } from "./api/design/getStickers.js";
import { uploadFontHook, getFontsHook } from "./api/font.js";
import { uploadBaseModelHook } from "./api/base/uploadBaseModel.js";
import {
  signupHook,
  getUserListHook,
  updateUserInfoHook,
  loginHook,
} from "./api/user.js";
import { imageUploadHook } from "./api/base/imageUpload.js";
import { getImageHook } from "./api/common/getImage.js";
import { uploadModelHook } from "./api/base/uploadModel.js";
import { getModelListHook } from "./api/model.js";
import { sendEmailHook } from "./api/email.js";
import { uploadTextSticker, getTextSticker } from "./api/sticker.js";

export const initRouter = (router, sequelize, app) => {
  let hooks = [
    loginHook,
    signupHook,
    getBannerModelHook,
    injectBaseModelRoute,
    getBaseSkyboxHook,
    getWebStickersHook,
    uploadBaseModelHook,
    imageUploadHook,
    getImageHook,
    uploadFontHook,
    getFontsHook,
    uploadModelHook,
    getModelListHook,
    sendEmailHook,
    getUserListHook,
    updateUserInfoHook,
    uploadTextSticker,
    getTextSticker,
  ];
  hooks.forEach((hook) => hook(router, sequelize, app));
};
