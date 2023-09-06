import { handlerStaticFilePath } from "./url";
import apiInstance from "./apiInstance";
import { Url } from "./url";
import { buildURL } from "@/common/url";

// todo
const URL: any = Url;

// 注册 ，账号密码手机号
export const signup = (data: any) => apiInstance.post(URL.SINGUP, data);

// 登录
export const login = (data: any) => apiInstance.post(URL.LOGIN, data);

// 获取首页展示栏模型
export const getBannerModel = () =>
  new Promise(async (resolve, reject) => {
    const res = await apiInstance.get(URL.GET_BANNER_MODEL);
    resolve({
      url: handlerStaticFilePath(res.data.data.url),
    });
  });

// 获取可以进行编辑的内置模型
export const getBaseModelList = () =>
  new Promise(async (resolve, reject) => {
    const res = await apiInstance.get(URL.GET_BASE_MODEL_LIST);
    resolve(
      res.data.data.map((item) => {
        return {
          name: item.name,
          desc: item.description,
          img: handlerStaticFilePath(item.imgPath),
          file: handlerStaticFilePath(item.filePath),
        };
      })
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
  apiInstance.post(URL.UPLOAD_BASE_MODEL, data);

// 上传图片
export const uploadImage = (data: any) =>
  apiInstance.post(URL.UPLOAD_IMAGE, data);

// 获取图片列表
export const getImageList = () =>
  new Promise(async (resolve: any, reject: any) => {
    let res = await apiInstance.get(URL.GET_IMAGE_LIST);
    
    let data = res.data.map((item: any) => ({
      path: handlerStaticFilePath(item.path),
      name: item.name,
      description: item.description,
    }));
    resolve(data);
  });

// 获取文字贴图地址
export interface TextStickerQuerys {
  color: string;
  text: string;
}
export const getTextStickerURL = (querys: any) =>
  buildURL(URL.GET_TEXT_STICKER, querys);
