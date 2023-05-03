import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const isSignedIn = ref(false)
    const signInTime = ref()
    const account = ref('')
    return {
        isSignedIn,
        account
    }
})