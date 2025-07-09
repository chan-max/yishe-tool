/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-10 06:31:15
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

  // 虚拟登录方法：设置 token 并获取用户信息
  async function virtualLogin(tokenValue: string) {
    try {
      // 清理 token 格式，确保不包含 Bearer 前缀
      const cleanToken = tokenValue
      
      // 设置 token
      token.value = cleanToken;


      console.log('设置token',token.value)

      // 设置登录状态
      isLogin.value = true;
      
      // 设置登录时间
      loginTime.value = new Date().toISOString();
      
      // 获取用户信息
      await getUserInfo();
      
      console.log('虚拟登录成功，用户信息已获取');
      return true;
    } catch (error) {
      console.error('虚拟登录失败:', error);
      // 如果获取用户信息失败，回滚登录状态
      isLogin.value = false;
      token.value = null;
      loginTime.value = null;
      return false;
    }
  }

  return {
    isLogin, //
    userInfo,
    loginTime,
    token,
    once,
    isAdmin,
    logout,
    getUserInfo,
    virtualLogin
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