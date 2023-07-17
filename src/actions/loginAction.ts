import { useLoginStatusStore } from "@/store/stores/user";
import router from "@/router/router";

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

export const isLogin = () => (getLocalUserInfo() ? true : false);

export const doLogin = (userInfo, once) => {
  // 保存登录时间
  const now = new Date().getTime();

  // 同步用户信息
  const loginStatusStore = useLoginStatusStore();
  loginStatusStore.isLogin = true;
  loginStatusStore.userInfo = userInfo;
  loginStatusStore.loginTime = now;
  loginStatusStore.once = once;

  // 保存用户信息到本地
  const localUserInfo = {
    loginTime: now,
    ...userInfo,
    once,
  };


  updateLocalUserInfo(localUserInfo);
  router.push({ name: "Home" });
};



export const doLogout = () => {
  const loginStatusStore = useLoginStatusStore();

  loginStatusStore.isLogin = false;
  loginStatusStore.userInfo = null;
  loginStatusStore.loginTime = null;
  // 清空本地登录信息
  clearLocalUserInfo();
};
