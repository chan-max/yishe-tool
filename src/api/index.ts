
import { apiInstance, source } from "./apiInstance";
import { deleteCOSFile, downloadCOSFile, uploadToCOS } from "./cos";
import { Url } from "./url";
export { uploadToCOS, deleteCOSFile, downloadCOSFile } from './cos'

interface FetchFileOptions {
  filename: string  // 请求的文件名
}


/**
 * @description 根据一个地址 请求文件
*/
export async function fetchFile(url, options) {
  const response = await fetch(url, options as RequestInit);

  var { filename }: any = {
    ...{
      filename: String(new Date().getTime())
    },
    ...options
  }

  if (!response.ok) {
    throw new Error("file request failed");
  }

  const blob = await response.blob();

  const file = new File([blob], filename);
  return file;
}

// 注册 ，账号密码手机号
export const register = (data: any) => apiInstance.post(Url.SINGUP, data);

// 登录
export const login = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      let res = await apiInstance.post(Url.LOGIN, data);
      resolve(res.data);
    } catch (e) {
      reject()
    }
  });

//  更新用户信息

const updateUserInfo = (data) => apiInstance.post(Url.UPDATE_USER_INFO, data)

const getUserInfo = async (data) => {
  const res = await apiInstance.post('/api/user/getUserInfo', data)

  return res.data.data
}



// 根据图片id来查询图片
export const logout = () => new Promise(async (resolve, reject) => {
  const data = await apiInstance.post('/api/user/logout')
  resolve(null)
})




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



// 上传文字贴纸
export const uploadTextSticker = (params) => new Promise(async (resolve) => {
  const res = await apiInstance.post(Url.CREATE_TEXT_STICKER, params)
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

export const getIndexAvailableModel = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_INDEX_AVAILABLE_MODEL, params)
  resolve(res.data.data)
})

export const follow = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.FOLLOW, params)
  resolve(res.data.data)
})


export const unfollow = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.UNFOLLOW, params)
  resolve(res.data.data)
})

// 获取我的关注列表
export const getMyFollowings = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_MY_FOLLOWINGS, params)
  resolve(res.data.data)
})

// 获取我的关注列表
export const getMyFollowers = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_MY_FOLLOWERS, params)
  resolve(res.data.data)
})

// 获取我的好友列表
export const getMyFriends = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_MY_FRIENDS, params)
  resolve(res.data.data)
})


// 获取我的聊天列表
export const getMyCommunicationList = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_MY_COMMUNICATION_LIST, params)
  resolve(res.data.data)
})




// 获取聊天信息
export const getCommunicationMessage = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post(Url.GET_COMMUNICATION_MESSAGE, params)
  resolve(res.data.data)
})


/*
    通用的上传文件接口,
    先上传到cos，再存储路径到服务器
*/
export const uploadManyFile = (params) => new Promise(async (resolve, reject) => {
  await Promise.all(params.map(uploadFile))
  resolve(undefined)
})



export const uploadFile = (params) => new Promise(async (resolve, reject) => {

  const data = {
    ...params,
    thumbnail: params.thumbnail,
    name: params.name,
    type: params.type,
    size: params.size,
    meta: params.meta || {},
  }

  await apiInstance.post('/api/file/create', data)
  resolve(void 0)
})


/* 
  获取商品模型列表
*/
export const getProductModelList = (data) => new Promise(async (resolve, reject) => {
  let res = await apiInstance.post('/api/product-model/page', data)
  resolve(res.data.data)
})


/*
    获取所有贴纸
*/
export const getStickerList = (data) => new Promise(async (resolve, reject) => {
  let res = await apiInstance.post('/api/sticker/page', data)
  resolve(res.data.data)
})


export const deleteSticker = (data) => new Promise(async (resolve, reject) => {
  let res = await apiInstance.post('/api/sticker/delete', {
    id: data
  })
  resolve(res.data.data)
})


/*
 创建贴纸
*/
export const createSticker = (data) => new Promise(async (resolve, reject) => {
  let res = await apiInstance.post('/api/sticker/create', data)
  resolve(res.data.data)
})

export const updateSticker = (data) => new Promise(async (resolve, reject) => {
  let res = await apiInstance.post('/api/sticker/update', data)
  resolve(res.data.data)
})



/**
 * 获取文件列表
*/
export const getFileListApi = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post('/api/file/page', params)
  resolve(res.data.data)
})

export const updateFile = (data) => new Promise(async (resolve, reject) => {
  let res = await apiInstance.post('/api/file/update', data)
  resolve(res.data.data)
})



/* 获取字体列表 */
export const getFontListApi = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post('/api/file/page', {
    ...params,
    type: 'ttf,woff,otf'
  })
  resolve(res.data.data)
})


export const deleteFile = (data) => new Promise(async (resolve, reject) => {
  let res = await apiInstance.post('/api/file/delete', {
    id: data
  })
  resolve(res.data.data)
})



/*
 上传自定义的模型
*/
export const createCustomModelApi = (data) => apiInstance.post(Url.UPLOAD_CUSTOM_MODEL, data);


export const getCustomModelList = (params) => new Promise(async (resolve, reject) => {
  const res = await apiInstance.post('/api/custom-model/page', params)
  resolve(res.data.data)
})

export const deleteCustomModel = (id) => new Promise(async (resolve, reject) => {
  let res = await apiInstance.post('/api/custom-model/delete', {
    id: id
  })
  resolve(res.data.data)
})




// 根据图片id来查询图片
export const getProductModelById = (id: string) => new Promise(async (resolve, reject) => {
  const data = await apiInstance.get('/api/product-model', { params: { id } })
  resolve(data.data.data)
})

export const getStickerById = (id: string) => new Promise(async (resolve, reject) => {
  const data = await apiInstance.get('/api/sticker', { params: { id } })
  resolve(data.data.data)
})

class Api {


  /* 用户相关 */
  logout = logout

  /*
  更新个人用户的元数据
  */
  async updateUserMeta(params) {
    const data = await apiInstance.post(Url.UPDATE_USER_META, params)
    return
  }


  async getUserMeta(params) {
    const res = await apiInstance.post(Url.GET_USER_META, params)
    return res.data.data
  }

  uploadToCOS = uploadToCOS

  deleteCOSFile = deleteCOSFile

  downloadCOSFile = downloadCOSFile

  createSticker = createSticker

  getFileListApi = getFileListApi


  /* 用户关系处理 */
  follow = follow
  unfollow = unfollow

  // 获取系统通用配置
  getBasicConfig = getBasicConfig

  getCustomModelList = getCustomModelList

  getProductModelById = getProductModelById

  getStickerById = getStickerById

  updateUserInfo = updateUserInfo

  getUserInfo = getUserInfo

  getStickerList = getStickerList

  updateSticker = updateSticker

  deleteSticker = deleteSticker

  deleteFile = deleteFile

  deleteCustomModel = deleteCustomModel

  updateFile = updateFile

  getProductModelList = getProductModelList
}

export default new Api()
