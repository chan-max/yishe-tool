/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-17 16:06:52
 * @FilePath: /1s/server/router.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */
import { getBannerModelHook } from "./api/common/getBannerModel.js";
import { injectBaseModelRoute,getBaseModelById } from "./api/baseModel.js";
import { getBaseSkyboxHook } from "./api/common/getSkybox.js";
import { uploadFontHook, getFontsHook ,getFontById} from "./api/font.js";
import { uploadBaseModelHook } from "./api/base/uploadBaseModel.js";
import {
  signupHook,
  getUserListHook,
  updateUserInfoHook,
  loginHook,
  getAccountStatusHook
} from "./api/user.js";
import { imageUploadHook } from "./api/base/imageUpload.js";
import { getImageHook,getImageById } from "./api/common/getImage.js";
import { uploadModelHook } from "./api/base/uploadModel.js";
import { getModelListHook } from "./api/model.js";
import { sendEmailHook } from "./api/email.js";
import { uploadTextSticker, getTextSticker,getTextStickerById } from "./api/textSticker.js";

export const initRouter = (...params) => {
  let hooks = [
    loginHook,
    signupHook,
    getBannerModelHook,
    injectBaseModelRoute,
    getBaseSkyboxHook,
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
    getAccountStatusHook,
    getImageById,
    getBaseModelById,
    getTextStickerById,
    getFontById
  ];
  hooks.forEach((hook) => hook(...params));
};
