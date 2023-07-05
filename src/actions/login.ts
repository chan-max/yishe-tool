import { useLoginStatusStore } from "@/store/stores/user"

const LOGIN_FLAG = '1s_isLogin'

export const isLogin = () => localStorage.getItem(LOGIN_FLAG) === 'true'

export const doLogin = (userInfo) => {
    const loginStatusStore = useLoginStatusStore()
    loginStatusStore.isLogin = true
    loginStatusStore.userInfo = userInfo
    loginStatusStore.loginTime = new Date().getTime()
}

