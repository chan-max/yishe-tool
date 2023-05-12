import apiInstance from "./apiInstance";

// 检验账号是否存在
export const getAccountStatus = (data: any) => apiInstance.get('/getAccountStatus', {
    params: data
})

// 注册 ，账号密码手机号
export const signup = (data: any) => apiInstance.post('/signup', data)


// 登录
export const login = (data: any) => apiInstance.post('/login', data)