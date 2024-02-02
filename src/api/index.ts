
import { apiInstance, source } from "./apiInstance";
import { Url } from "./url";

// 注册 ，账号密码手机号
export const signup = (data: any) =>
  new Promise(async (resolve, reject) => {
    let res = await apiInstance.post(Url.SINGUP, data);
    resolve(res.data);
  });

// 登录
export const login = (data) =>
  new Promise(async (resolve, reject) => {
    let res = await apiInstance.post(Url.LOGIN, data);
    resolve(res.data);
  });

// 获取首页展示栏模型
export const getBannerModel = () =>
  new Promise(async (resolve, reject) => {
    const res = await apiInstance.get(Url.GET_BANNER_MODEL);
    resolve(res?.data?.data?.modelInfo);
  });

// 获取可以进行编辑的内置模型
export const getBaseModel = (params?: any) =>
  new Promise(async (resolve, reject) => {
    const res = await apiInstance.post(Url.GET_BASE_MODEL, params);
    resolve(
      res.data.data
    );
  });

// 获取基本盒子天空模型
export const getBaseSkybox = () => apiInstance.get("getBaseSkybox");

// 获取网络热门贴图
export const getWebStickers = () => apiInstance.post("getWebStickers");

// 获取我的贴图
export const getMyStickers = () => apiInstance.post("getMyStickers");

// 上传基础模型
export const uploadBaseModel = (data: any) =>
  apiInstance.post(Url.UPLOAD_BASE_MODEL, data);

// 上传图片
export const uploadImage = (data: any) =>
  apiInstance.post(Url.UPLOAD_IMAGE, data);

// 获取图片列表
export const getImage = (params) =>
  new Promise(async (resolve: any, reject: any) => {
    let res = await apiInstance.post(Url.GET_IMAGE_LIST, params);
    resolve(res.data.data);
  });

// 上传文字字体文件
export const uploadFont = (data) => apiInstance.post(Url.UPLOAD_FONT, data);

// 获取所有字体

export const getFonts = () =>
  new Promise(async (resolve, reject) => {
    const res = await apiInstance.get(Url.GET_FONTS);
    resolve(res.data.data);
  });

export const uploadModel = (data) => apiInstance.post(Url.UPLOAD_MODEL, data);

// 获取模型列表
export const getModelList = (data) =>
  new Promise(async (resolve, reject) => {
    const res = await apiInstance.post(Url.GET_MODEL_LIST, data);
    resolve(res.data.data);
  });

export const getModelById = (id) =>
  new Promise(async (resolve, reject) => {
    const res = await apiInstance.post(Url.GET_MODEL_BY_ID, { id });
    resolve(res.data.data);
  });

// 发送邮件
export const sendEmail = (data) => apiInstance.post(Url.SEND_MAIL, data);

// 获取用户列表
export interface UserListInfo {
  total: number;
  list: any[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
}
export const getUserList = (params?: any) =>
  new Promise(async (resolve, reject) => {
    const res = await apiInstance.post(Url.GET_USER_LIST, params);
    resolve(res.data.data);
  });


// 更新用户信息
export const updateUserInfo = (params) => apiInstance.post(Url.UPDATE_USER_INFO, params)


// 上传文字贴纸
export const uploadTextSticker = (params) => new Promise(async (resolve) => {
  const res = await apiInstance.post(Url.UPLOAD_TEXT_STICKER, params)
  resolve(res.data.data);
})


// 获取文字贴纸
export const getTextSticker = (params?: any) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_TEXT_STICKER, params)
  resolve(res.data.data)
})


// 获取账号的状态，，是否注册，是否已注册，是否是管理员，是否被禁用等
export const getAccountStatus = (params) => new Promise(async (resolve, reject) => {
  const data = await apiInstance.post(Url.GET_ACCOUNT_STATUS, params)
  resolve(data.data)
})

// 根据图片id来查询图片
export const getImageById = (id: string) => new Promise(async (resolve, reject) => {
  const data = await apiInstance.post(Url.GET_IMAGE_BY_ID, { id })
  resolve(data.data.data)
})


// 根据图片id来查询图片
export const getBaseModelById = (id: string) => new Promise(async (resolve, reject) => {
  const data = await apiInstance.post(Url.GET_BASE_MODEL_BY_ID, { id })
  resolve(data.data.data)
})


export const getTextStickerById = (id: string) => new Promise(async (resolve, reject) => {
  const data = await apiInstance.post(Url.GET_TEXT_STICKER_BY_ID, { id })
  resolve(data.data.data)
})


export const getFontById = (id: string) => new Promise(async (resolve, reject) => {
  const data = await apiInstance.post(Url.GET_FONT_BY_ID, { id })
  resolve(data.data.data)
})



export const getBasicConfig = () => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_BASIC_CONFIG)
  resolve(res.data.data)
})


/*
  该接口作为获取列表资源的通用接口
*/

export interface GetListParams {
  type: 'image' | 'textSticker' | 'model',
  page: number
}


export const getList = (params: GetListParams) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_LIST, params)
  resolve(res.data)
})




/*
  点赞模型，
  取消点赞模型
*/

export const likeModel = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.LIKE_MODEL, params)
  resolve(res.data)
})



export const likeModelComment = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.LIKE_MODEl_COMMENT, params)
  resolve(res.data)
})

/*
  获取用于扫码登录的二维码
*/
export const requestQRCodeLoginInfo = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_QRCODE_LOGIN_URL, params)
  resolve(res.data)
})


/*
  发布模型
*/

export const publishModel = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.PUBLISH_MODEL, params)
  resolve(res.data)
})



export const likeAvailableModel = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.LIKE_AVAILABLE_MODEL, params)
  resolve(res.data)
})


export const likeAvailableModelComment = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.LIKE_AVAILABLE_MODEl_COMMENT, params)
  resolve(res.data)
})


export const getAvailableModel = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_AVAILABLE_MODEL, params)
  resolve(res.data.data)
})