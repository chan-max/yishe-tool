import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const isLogin = ref(false)
    const loginTime = ref()
    const account = ref('')
    return {
        isLogin,
        account
    }
})