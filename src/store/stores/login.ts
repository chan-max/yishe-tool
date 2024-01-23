/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 13:44:10
 * @FilePath: /1s/src/store/stores/login.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { getLocalUserInfo, updateLocalUserInfo } from "@/store/stores/loginAction";
import { defineStore } from "pinia";
import { reactive, ref, watch, toRaw, isReactive, isRef, unref } from "vue";

export const useLoginStatusStore = defineStore("login_status", () => {
  const isLogin = ref(false);
  const loginTime = ref();
  const userInfo = ref();
  const token = ref();
  const once = ref();
  const isAdmin = ref(false);
  // 初始化用户登录状态
  const localUserInfo = getLocalUserInfo();
  if (localUserInfo) {
    // 已经登录
    isLogin.value = localUserInfo && localUserInfo.isLogin
    userInfo.value = localUserInfo.userInfo
    loginTime.value = localUserInfo.loginTime
    token.value = localUserInfo.token
    once.value = localUserInfo.once
    isAdmin.value = localUserInfo.isAdmin
  }
  
  return {
    isLogin, //
    userInfo,
    loginTime,
    token,
    once,
    isAdmin
  };
});


// 同步用户信息到本地
export function syncUserInfoToLocal(){
  const loginStore = useLoginStatusStore()
  // 同步登录信息到本地
  watch(loginStore.$state, () => {
    updateLocalUserInfo(deepToRaw(loginStore.$state))
  })
}

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