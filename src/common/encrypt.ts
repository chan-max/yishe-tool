import JSEncrypt from 'jsencrypt'

import CryptoJS from 'crypto-js'


const publicKey = ``
const privateKey = ``

// 加密

let encryptor = new JSEncrypt()

export const encrypt = (txt: string) => {
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export const decrypt = (txt: string) => {
    encryptor.setPrivateKey(privateKey) // 设置私钥
    return encryptor.decrypt(txt) // 对数据进行解密
}




function symmetricDecrypt(encryptedMessage, secretKey) {
    return CryptoJS.AES.decrypt(encryptedMessage, secretKey).toString(CryptoJS.enc.Utf8);
}

function symmetricEncrypt(encryptedMessage, secretKey) {
    return CryptoJS.AES.encrypt(encryptedMessage, secretKey).toString();
}

export class Encrypt {
    CryptoJS = CryptoJS

    symmetricDecrypt = symmetricDecrypt
    symmetricEncrypt = symmetricEncrypt

}

