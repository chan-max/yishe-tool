/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-23 22:50:51
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 14:12:29
 * @FilePath: /1s/src/api/api/comment.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

/*
    获取模型评论
*/

import { apiInstance } from "../apiInstance";
import { Url } from "../url";

// 评论的排序类型
export enum CommentSortType {
    LATEST = 'latest', // 最新
    HOTEST = 'hotest' // 最热
}

export interface ApiParamsGetModelComment {
    id: string | number; // 模型id
    sortType: CommentSortType
}

export interface CommentTree {
    id: string
    parentId: string
}

export const getAvailableModelComment = (params:ApiParamsGetModelComment) => new Promise(async (resolve, reject) => {
    try {
        let res = await apiInstance.post(Url.GET_AVAILABLE_MODEL_COMMENT, params)
        resolve(res.data.data)
    } catch (e) {
        reject(e);
    }
})



// 添加评论
export interface ApiParamsAddModelComment {
    modelId: string | number; // 模型id
    content: string; // 评论内容
    parentId: string; // 评论父id
    userId: string // 用户id
}

export const addModelComment = (params) => new Promise((resolve, reject) => {
    try {
        let res = apiInstance.post(Url.ADD_MODEL_COMMENT, params)
        resolve(res)
    } catch (e) {
        reject(e);
    }
})

export const addAvailableModelComment = (params) => new Promise((resolve, reject) => {
    try {
        let res = apiInstance.post(Url.ADD_AVAILABLE_MODEL_COMMENT, params)
        resolve(res)
    } catch (e) {
        reject(e);
    }
})