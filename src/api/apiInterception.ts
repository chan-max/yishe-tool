/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-07 12:53:33
 * @FilePath: /1s/src/api/apiInterception.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { useLoginStatusStore } from "@/store/stores/login";
import { ElMessage } from 'element-plus'
import { message } from 'ant-design-vue'
import { doLogout } from "@/store/stores/loginAction";
import { useRouter } from "vue-router";

const router = useRouter()

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

/*
 暂时不需要兼容文件上传
*/
export const formDataFormatRequestInterceptor = (request) => {
    // request.data = ensureFormData(request.data);
    return request
}

/*
   保存token
*/
export const tokenResponseInterceptor = (response) => {
    let loginStore = useLoginStatusStore();
    if (response.headers.authorization) {
        loginStore.token = response.headers.authorization
    }
    return response;
}

export const tokenRequestInterceptor = (request) => {
    let loginStore = useLoginStatusStore();
    if (loginStore.token) {
        request.headers.authorization = `Bearer ${loginStore.token}`;
    }
    return request
}

/*
    建议处理接口定义的消息提示
*/
export const messageResponseInterceptor = (response) => {
    return response
}



function isMobile() {
    const mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile'];
    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i]) > 0) return true;
    return false;
}


export const defaultResponseInterceptors = async (response) => {
    if (response?.data?.code === 401) {

        doLogout()
        message.error('登录状态失效，请重新登录')
        
        throw new Error()
    } else if (response.data.code == 0) {
        return response
    } else {
        message.error(response?.data?.message)
        throw new Error(response)
    }
}