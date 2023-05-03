import apiInstance from "./apiInstance";

// 检验账号是否存在
export const getAccountStatus = (data: any) => apiInstance.get('/getAccountStatus', {
    params: data
})

// 注册 ，账号密码手机号
export const signUp = (data: any) => apiInstance.post('/signUp', data)


// 登录
export const signIn = (data: any) => apiInstance.post('/signIn', data)