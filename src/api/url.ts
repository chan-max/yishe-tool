
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


// 区分开发和生产api
function url(url):any{
    return `${import.meta.env.DEV ? '/api' :''}${url}`
}

export enum Url {
    // 图片上传
    UPLOAD_IMAGE = url('/imageUpload') ,  

    // 上传基础模型
    UPLOAD_BASE_MODEL = url('/uploadBaseModel'),

    // 注册
    SINGUP = url('/signup'),

    // 登录
    LOGIN = url('/login'),

    // 获取首页模型信息
    GET_BANNER_MODEL = url('/getBannerModel'),

    // 获取基本模型列表
    GET_BASE_MODEL = url('/getBaseModel'),

    // 获取图片
    GET_IMAGE_LIST = url('/getImageList'),

    // 上传字体
    UPLOAD_FONT = url('/uploadFont'),

    GET_FONTS = url('/getFonts'),

    // 上传模型
    UPLOAD_MODEL = url('/uploadModel'),

    // 获取模型列表
    GET_MODEL_LIST = url('/getModelList'),
    
    SEND_MAIL = url('/sendEmail'),

    // 获取用户列表，后台使用
    GET_USER_LIST = url('/getUserList'),

    // 更新用户信息
    UPDATE_USER_INFO = url('/updateUserInfo'),

    UPLOAD_TEXT_STICKER = url('/uploadTextSticker'),

    // 获取所有文字贴纸
    GET_TEXT_STICKER = url('/getTextSticker'),
}