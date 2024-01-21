/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 12:58:35
 * @FilePath: /1s/src/api/apiInterception.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { useLoginStatusStore } from "@/store/stores/login";
import { ElMessage } from 'element-plus'

function ensureFormData(obj) {
    if (obj instanceof FormData) {
        return obj;
    } else if (obj instanceof Object) {
        const formData = new FormData();
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                formData.append(key, obj[key]);
            }
        }
        return formData;
    }
    return new FormData()
}

export const formDataFormatRequestInterceptor = (request) => {
    request.data = ensureFormData(request.data);
    return request
}

/*
   保存token
*/
export const tokenResponseInterceptor = (response) => {
    let loginStore = useLoginStatusStore();
    if (response.headers.token) {
        loginStore.token = response.headers.token
    }
    return response;
}

export const tokenRequestInterceptor = (request) => {
    let loginStore = useLoginStatusStore();
    if (loginStore.token) {
        request.headers.token = loginStore.token;
    }
    return request
}

/*
    建议处理接口定义的消息提示
*/
export const messageResponseInterceptor = (response) => {
    if (response.data.message && response.data.type) {
        ElMessage({
            message: response.data.message,
            type: response.data.type,
        })
    }
    return response
}