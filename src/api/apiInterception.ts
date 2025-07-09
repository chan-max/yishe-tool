/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-10 06:17:46
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
import { openLoginDialog, showLoginFormModal } from '@/modules/main/view/user/login/index.tsx'

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
    对象转 formData
*/
function objectToFormData(obj, form, namespace) {
  const formData = form || new FormData();

  for (let property in obj) {
    if (!obj.hasOwnProperty(property)) {
      continue;
    }

    const key = namespace ? `${namespace}[${property}]` : property;
    const value = obj[property];

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value instanceof Array) {
      value.forEach((element, index) => {
        const arrayKey = `${key}[${index}]`;
        if (typeof element === 'object' && !(element instanceof File)) {
          objectToFormData(element, formData, arrayKey);
        } else {
          formData.append(arrayKey, element);
        }
      });
    } else if (typeof value === 'object' && !(value instanceof File)) {
      objectToFormData(value, formData, key);
    } else {
      formData.append(key, value);
    }
  }
  return formData;
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



import router from '@/modules/main/router'

export const defaultResponseInterceptors = (response) => {

  if (response?.data?.code === 400) {
    message.error(response.data.message)
    return Promise.reject()
  }



  // 无权限
  if (response?.data?.code === 401) {
    let loginStore = useLoginStatusStore()
    loginStore.logout()
    openLoginDialog()
    message.error('请登录 :-)')
    return Promise.reject()
  }

  if (response.data.code == 0) {
    return response
  }

  message.error(response?.data?.message)
  throw new Error(response)
}


import { showToast } from "vant";
export const mobileDefaultResponseInterceptors = (response) => {

  if (response?.data?.code === 400) {
    showToast(response.data.message)
    return Promise.reject()
  }

  // 无权限
  if (response?.data?.code === 401) {
    let loginStore = useLoginStatusStore()
    loginStore.logout()
    showToast('登录状态已失效，请重新登录')
    return Promise.reject()
  }

  if (response.data.code == 0) {
    return response
  }

  showToast(response?.data?.message)
  throw new Error(response)
}