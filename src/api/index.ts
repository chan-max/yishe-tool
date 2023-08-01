import apiInstance from './apiInstance';

// 检验账号是否存在
export const getAccountStatus = (data: any) => apiInstance.get('/getAccountStatus', {
    params: data
})

// 注册 ，账号密码手机号
export const signup = (data: any) => apiInstance.post('/signup', data)

// 登录
export const login = (data: any) => apiInstance.post('/login', data)

// 获取首页展示栏模型 
export const getBannerModel = () => apiInstance.get('/getBannerModel')

// 获取可以进行编辑的内置模型
export const getBaseModelList = () => apiInstance.get('/getBaseModelList')

// 获取基本盒子天空模型
export const getBaseSkybox = () => apiInstance.get('getBaseSkybox')

// 获取网络热门贴图
export const getWebStickers = () => apiInstance.post('getWebStickers')

// 获取我的贴图
export const getMyStickers = () => apiInstance.post('getMyStickers')

// 上传基础模型

export const uploadBaseModel = (data: any) => apiInstance.post('uploadBaseModel', data)
