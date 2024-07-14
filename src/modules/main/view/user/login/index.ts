import {ref} from 'vue'

export enum LoginType {
    PASSWORD,
    QRCODE
}

export const loginType = ref(LoginType.PASSWORD)

