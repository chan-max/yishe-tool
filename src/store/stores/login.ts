/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-07 14:09:46
 * @FilePath: /1s/src/store/stores/login.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { getLocalUserInfo, updateLocalUserInfo } from "@/store/stores/loginAction";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { reactive, ref, watch, toRaw, isReactive, isRef, unref } from "vue";
import Api from '@/api'
import to from 'await-to-js';


export async function initLoginStoreUserInfo() {
  const loginStore = useLoginStatusStore()

  if (loginStore.isLogin) {
    let [err, res] = await to(loginStore.getUserInfo())
  }
}

export const useLoginStatusStore = defineStore("login_status", () => {

  const isLogin = ref(false);
  const loginTime = ref();
  const userInfo = ref();
  const token = useLocalStorage('token', '');
  const once = ref();
  const isAdmin = ref(false);


  if (token.value) {
    isLogin.value = true
  }

  async function getUserInfo() {
    const loginStore = useLoginStatusStore()
    const _userInfo = await Api.getUserInfo()
    if (_userInfo) {
      userInfo.value = _userInfo
      loginStore.isAdmin = _userInfo.isAdmin
      isLogin.value = true
    } else {
      isLogin.value = false
    }
  }


  // getUserInfo()改为在启动程序时调用


  function logout() {
    isLogin.value = false
    userInfo.value = null
    token.value = null
  }

  return {
    isLogin, //
    userInfo,
    loginTime,
    token,
    once,
    isAdmin,
    logout,
    getUserInfo
  };
});




// 同步用户信息到本地
// export function syncUserInfoToLocal() {
//   const loginStore = useLoginStatusStore()
//   // 同步登录信息到本地
//   watch(loginStore.$state, () => {
//     updateLocalUserInfo(deepToRaw(loginStore.$state))
//   })
// }




function deepToRaw(data) {
  if (isRef(data)) {
    return deepToRaw(unref(data))
  }

  if (isReactive(data)) {
    return deepToRaw(toRaw(data))
  }

  if (Array.isArray(data)) {
    return data.map(deepToRaw)
  }

  if (data !== null && typeof (data) === 'object') {
    const result = {}
    for (let key in data) {
      result[key] = deepToRaw(data[key])
    }
    return result
  }

  return data
}