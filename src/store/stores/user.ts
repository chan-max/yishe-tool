import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useLoginStatusStore = defineStore('login_status', () => {

    // 初始化用户登录状态

    const isLogin = ref(false)
    const loginTime = ref()
    const userInfo = ref()



    return {
        isLogin,
        userInfo,
        loginTime
    }
})

