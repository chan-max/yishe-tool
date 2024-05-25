/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-15 11:37:40
 * @FilePath: /yishe/src/api/url.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */

function unifySlashes(input) {
    return input.replace(/(\/+|\\+)/g, '/');
}

export function toRealPath(path){
    path = unifySlashes(path)
    return path.replace('api','')
}


export enum Url {
    // 图片上传
    UPLOAD_IMAGE = '/imageUpload' ,  

    // 上传基础模型
    UPLOAD_BASE_MODEL = '/uploadBaseModel',

    // 注册
    SINGUP = '/signup',

    // 登录
    LOGIN = '/api/auth/login',

    // 获取首页模型信息
    GET_BANNER_MODEL = '/getBannerModel',

    // 获取基本模型列表
    GET_BASE_MODEL = '/getBaseModel',

    // 获取图片
    GET_IMAGE_LIST = '/getImage',

    // 上传字体
    UPLOAD_FONT = '/uploadFont',

    GET_FONTS = '/getFonts',

    // 上传模型
    UPLOAD_MODEL = '/uploadModel',

    // 获取模型列表
    GET_MODEL_LIST = '/getModelList',
    
    SEND_MAIL = '/sendEmail',

    // 获取用户列表，后台使用
    GET_USER_LIST = '/getUserList',

    // 更新用户信息
    UPDATE_USER_INFO = '/updateUserInfo',

    UPLOAD_TEXT_STICKER = '/uploadTextSticker',

    // 获取所有文字贴纸
    GET_TEXT_STICKER = '/getTextSticker',

    GET_ACCOUNT_STATUS = '/getAccountStatus',

    GET_IMAGE_BY_ID = '/getImageById',

    GET_BASE_MODEL_BY_ID = '/getBaseModelById',

    GET_TEXT_STICKER_BY_ID = '/getTextStickerById',

    GET_FONT_BY_ID = '/getFontById',

    GET_MODEL_BY_ID = '/getModelById',


    GET_BASIC_CONFIG = '/getBasicConfig',

    GET_LIST = '/getList',

    ADD_MODEL_COMMENT = '/addModelComment',

    GET_MODEL_COMMENT = '/getModelComment',

    LIKE_MODEL = '/likeModel',

    LIKE_MODEl_COMMENT = '/likeModelComment',

    // 获取用于扫码登录的地址
    GET_QRCODE_LOGIN_URL = '/requestQRCodeLoginInfo',


    // 发布模型
    PUBLISH_MODEL = '/publishAvailableModel',

    // 移除发布的模型
    REMOVE_MODEL = '/removeAvailableModel',

    ADD_AVAILABLE_MODEL_COMMENT = '/addAvailableModelComment',

    // 删除模型评论
    DELETE_AVAILABLE_MODEL_COMMENT = '/deleteAvailableModelComment',

    GET_AVAILABLE_MODEL_COMMENT = '/getAvailableModelComment',

    LIKE_AVAILABLE_MODEL = '/likeAvailableModel',

    LIKE_AVAILABLE_MODEl_COMMENT = '/likeAvailableModelComment',

    GET_AVAILABLE_MODEL = '/getAvailableModel',

    GET_INDEX_AVAILABLE_MODEL = '/getIndexAvailableModel',

    FOLLOW = 'follow',

    UNFOLLOW = 'unfollow',

    GET_MY_FRIENDS = 'getMyFriends',

    GET_MY_FOLLOWERS = 'getMyFollowers',

    GET_MY_FOLLOWINGS = 'getMyFollowings',

    GET_MY_COMMUNICATION_LIST = 'getMyCommunicationList',

    GET_COMMUNICATION_MESSAGE = 'getCommunicationMessage'
}