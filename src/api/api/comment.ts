


/*
    获取模型评论
*/

import { apiInstance } from "../apiInstance";
import { Url } from "../url";

export interface ApiParamsGetModelComment {
    id: string|number; // 模型id
}

export interface CommentTree {
    id: string
    parentId:string
}

export const getModelComment = (params) => new Promise(async (resolve, reject) => {
    try{
       let res =  await apiInstance.post(Url.GET_MODEL_COMMENT,params)
       resolve(res.data.data)
    }catch(e){
        reject(e);
    }
})

// 添加评论
export interface ApiParamsAddModelComment {
    modelId: string|number; // 模型id
    content:string; // 评论内容
    parentId:string; // 评论父id
    userId:string // 用户id
}

export const addModelComment = (params) => new Promise((resolve, reject) => {
    try{
       let res =  apiInstance.post(Url.ADD_MODEL_COMMENT,params)
       resolve(res)
    }catch(e){
        reject(e);
    }
})