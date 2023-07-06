import { getLocalUserInfo } from '@/actions/loginAction'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'



export const useLoginStatusStore = defineStore('login_status', () => {

    const isLogin = ref(false)
    const loginTime = ref()
    const userInfo = ref()

    const account = ref()
    

    // 初始化用户登录状态
    const localUserInfo = getLocalUserInfo()

    if(localUserInfo){
        // 登录过
        isLogin.value = true
        loginTime.value = localUserInfo
        userInfo.value = localUserInfo
    }

    return {
        isLogin,
        userInfo,
        loginTime
    }
})

