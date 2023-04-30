import apiInstance from "./apiInstance";

// 检验账号是否存在
export const accountIsExist = (data: any) => apiInstance.get('/accountIsExist', { params: data })



export const signIn = () => { }
export const signUp = () => { }
export const signOut = () => { }