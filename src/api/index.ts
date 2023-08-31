import { handlerStaticFilePath } from './apiHelper';
import apiInstance from './apiInstance';
import {Url as _Url} from './url'

// todo
const Url:any = _Url

// 检验账号是否存在
export const getAccountStatus = (data: any) => apiInstance.get('/getAccountStatus', {
    params: data
})

// 注册 ，账号密码手机号
export const signup = (data: any) => apiInstance.post(Url.SINGUP, data)

// 登录
export const login = (data: any) => apiInstance.post(Url.LOGIN, data)

// 获取首页展示栏模型 
export const getBannerModel = () => apiInstance.get(Url.GET_BANNER_MODEL)

export const bannerModelAdapter = (data) => {
    return {
        url: handlerStaticFilePath(data.url)
    }
}


// 获取可以进行编辑的内置模型
export const getBaseModelList = () => apiInstance.get(Url.GET_BASE_MODEL_LIST)

export function baseModelListAdapter(data){
    return data.map((item) => {
        return {
            name:item.name,
            desc:item.description,
            img: handlerStaticFilePath(item.imgPath) ,
            file:handlerStaticFilePath(item.filePath),
        }
    })
}

// 获取基本盒子天空模型
export const getBaseSkybox = () => apiInstance.get('getBaseSkybox')

// 获取网络热门贴图
export const getWebStickers = () => apiInstance.post('getWebStickers')

// 获取我的贴图
export const getMyStickers = () => apiInstance.post('getMyStickers')

// 上传基础模型
export const uploadBaseModel = (data: any) => apiInstance.post(Url.UPLOAD_BASE_MODEL, data)

// 上传图片
export const uploadImage = (data:any) => apiInstance.post(Url.UPLOAD_IMAGE,data)

// 获取图片列表
export const getImageList = () => new Promise(async (resolve:any,reject:any) => {
    let res = await apiInstance.get(Url.GET_IMAGE_LIST)

    let data = res.data.map((item:any) => ({
        path:handlerStaticFilePath(item.path),
        name:item.name,
        description:item.description
    }))

    resolve(data);
})

