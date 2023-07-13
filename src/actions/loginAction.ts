import { useLoginStatusStore } from "@/store/stores/user"
import router from "@/router/router"

import { LoginTypeEnum } from '../../common/enum/loginType.js';

const LOGIN_FLAG = '1s_login'


export const getLocalUserInfo = () => JSON.parse(localStorage.getItem(LOGIN_FLAG) || sessionStorage.getItem(LOGIN_FLAG))

export const isLogin = () => getLocalUserInfo() ? true : false

export const doLogin = (userInfo,loginType) => {
    const now = new Date().getTime()
    const loginStatusStore = useLoginStatusStore()
    loginStatusStore.isLogin = true
    loginStatusStore.userInfo = userInfo
    loginStatusStore.loginTime = now
    
    const localUserInfo = JSON.stringify({
        ...userInfo,
        loginTime: now
    })

    if(loginType === LoginTypeEnum.ONCE){
        // 会话级别
        sessionStorage.setItem(LOGIN_FLAG, localUserInfo)
    }else if(loginType === LoginTypeEnum.ALWAYS){
        // 永久级别
        localStorage.setItem(LOGIN_FLAG, localUserInfo)
    }

    router.push({name:'Home'})
}


export const doLogout = () => {
    const loginStatusStore = useLoginStatusStore()
    loginStatusStore.isLogin = false
    loginStatusStore.userInfo = null
    loginStatusStore.loginTime = null

    // 清空本地登录信息
    localStorage.removeItem(LOGIN_FLAG)
    sessionStorage.removeItem(LOGIN_FLAG)
}
