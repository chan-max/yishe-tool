
function unifySlashes(input) {
    return input.replace(/(\/+|\\+)/g, '/');
}

export const resolveFilePath = (path) => {

    if(!path){
        return ''
    }

    if(path.startsWith('blob')){
        return path
    }

    path = unifySlashes(path)
    
    if(import.meta.env.DEV){
        if(!path.startsWith('/api') && !path.startsWith('api')){
            return '/api/' +  path
        }
    }else{
        if(path.startsWith('/api')){
            return path.slice(4)
        }
        if(path.startsWith('api')){
            return path.slice(3)
        }
    }

    return path
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
    LOGIN = '/login',

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
}