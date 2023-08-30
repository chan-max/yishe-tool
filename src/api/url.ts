

// 区分开发和生产api
function getUrl(url):any{
    return `${String(import.meta.env.DEV) ? '/api' :''}${url}`
}


export enum Url {
    // 图片上传
    UPLOAD_IMAGE = getUrl('/imageUpload') ,  

    // 上传基础模型
    UPLOAD_BASE_MODEL = getUrl('/uploadBaseModel'),

    // 注册
    SINGUP = getUrl('/signup'),

    // 登录
    LOGIN = getUrl('/login'),

    // 获取首页模型信息
    GET_BANNER_MODEL = getUrl('/getBannerModel'),

    // 获取基本模型列表
    GET_BASE_MODEL_LIST = getUrl('/getBaseModelList'),

    // 获取图片
    GET_IMAGE_LIST = getUrl('/getImageList'),
}