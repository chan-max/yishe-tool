
export const resolveFilePath = (path) => {

    if(!path){
        return ''
    }

    path = path.replaceAll('\\','/')
    path = path.replaceAll('//','/')

    
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
    GET_BASE_MODEL_LIST = url('/getBaseModelList'),

    // 获取图片
    GET_IMAGE_LIST = url('/getImageList'),

    // 获取文字贴图
    GET_TEXT_STICKER = url('/textSticker'),

    UPLOAD_FONT = url('/uploadFont'),

    GET_FONTS = url('/getFonts'),

    // 上传模型
    UPLOAD_MODEL = url('/uploadModel'),

    // 获取模型列表
    GET_MODEL_LIST = url('/getModelList'),
    
    SEND_MAIL = url('/sendEmail')
}