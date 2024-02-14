/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-14 21:37:32
 * @FilePath: /yishe/server/router.js
 * @Description:
 *
 * Copyright (c) 2023 by 1s, All Rights Reserved.
 */


import { getBannerModelHook } from "./api/common/getBannerModel.js";
import {
  injectBaseModelRoute,
  getBaseModelById,
  uploadBaseModelHook,
} from "./api/baseModel.js";
import { getBaseSkyboxHook } from "./api/common/getSkybox.js";
import { uploadFontHook, getFontsHook, getFontById } from "./api/font.js";

import {
  signupHook,
  getUserListHook,
  updateUserInfoHook,
  loginHook,
  getAccountStatusHook,
} from "./api/user.js";

import { getImageHook, getImageById, imageUploadHook } from "./api/image.js";

import { getModelListHook, getModelById, uploadModelHook, likeModel } from "./api/model.js";
import { sendEmailHook } from "./api/email.js";
import {
  uploadTextSticker,
  getTextSticker,
  getTextStickerById,
} from "./api/textSticker.js";

import { getList } from "./api/list.js";
import { addModelComment, getModelComment } from "./api/comment.js";

import { test } from "./api/test.js";

import { commentController } from "./controller/comment.controller.js";
import { loginController } from "./controller/login.controller.js";
import { imageGroupController } from "./controller/imageGroup.controller.js";
import { availableModelController } from './controller/availableModel.controller.js';
import { fileController } from "./controller/file.controller.js";
import { followerController } from './controller/follower.controller.js'

import { configController } from './controller/config.controller.js';

import { messageController } from "./controller/message.controller.js";
import { communicationController } from "./controller/communication.controller.js";

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
    getFontById,
    getModelById,
    getList,
    addModelComment,
    getModelComment,
    test,
    likeModel
  ];
  hooks.forEach((hook) => hook(...params));
};


let controllers = [
  commentController,
  loginController,
  imageGroupController,
  availableModelController,
  fileController,
  followerController,
  configController,
  messageController,
  communicationController
];

export const initController = (...params) => {
  controllers.forEach((controller) => controller(...params));
}
