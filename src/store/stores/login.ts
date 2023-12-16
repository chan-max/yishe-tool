import { getLocalUserInfo } from "@/store/stores/loginAction";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

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
    isLogin.value = true
    userInfo.value = localUserInfo
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
