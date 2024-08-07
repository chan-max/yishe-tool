import JSEncrypt from 'jsencrypt'
// 密钥对生成 http://web.chacuo.net/netrsakeypair

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


export class Encrypt {
}

