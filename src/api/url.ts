

// 区分开发和生产api
function url(url):any{
    return `${String(import.meta.env.DEV) ? '/api' :''}${url}`
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
}