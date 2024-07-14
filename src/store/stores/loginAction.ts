/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 13:17:16
 * @FilePath: /1s/src/store/stores/loginAction.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { useLoginStatusStore } from "@/store/stores/login";
import router from "@/modules/main/router";

const LOGIN_FLAG = "1s_login";

// 是否为单次登录

export const getLocalUserInfo = () =>
  JSON.parse(
    localStorage.getItem(LOGIN_FLAG) || sessionStorage.getItem(LOGIN_FLAG)
);

  
export const clearLocalUserInfo = () => {
  localStorage.removeItem(LOGIN_FLAG);
  sessionStorage.removeItem(LOGIN_FLAG);
};

export const updateLocalUserInfo = (data: Record<string, any>) => {
  const localUserInfo = getLocalUserInfo();
  const newLocalUserInfo = {
    ...localUserInfo,
    ...data,
  };

  if (useLoginStatusStore().once) {
    sessionStorage.setItem(LOGIN_FLAG, JSON.stringify(newLocalUserInfo));
  } else {
    localStorage.setItem(LOGIN_FLAG, JSON.stringify(newLocalUserInfo));
  }
};

export const isLogin = () => {
  let local =  getLocalUserInfo()
  return local && local.isLogin
};

export const doLoginAction = (data, once = false) => {
  // 保存登录时间
  const now = new Date().getTime();
  const {userInfo,token} = data

  // 同步用户信息
  const loginStatusStore = useLoginStatusStore();
  loginStatusStore.isLogin = true;
  loginStatusStore.userInfo = userInfo;
  loginStatusStore.loginTime = now;
  loginStatusStore.once = once;
  loginStatusStore.token = token;
  loginStatusStore.isAdmin = userInfo.isAdmin;
};



export const doLogout = () => {
  const loginStatusStore = useLoginStatusStore();
  loginStatusStore.isLogin = false;
  loginStatusStore.userInfo = null;
  loginStatusStore.loginTime = null;
};
