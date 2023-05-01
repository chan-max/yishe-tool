import jwt from "jsonwebtoken";

// 不需要验证身份的接口
export const TokenIgnoreRoutesEnum = {
    USER_SIGNIN: '/signin',
    USER_SIGNUP: '/signup',
    
}

export function setToken() {

}



async function checkoutToken(ctx, next) {
    // split('?')[0]把字符串分割成字符串数组——拿到url值
    let url = ctx.url.split('?')[0]
    // 如果是登陆页面和注册页面就不需要验证token了
    if (url === '/api/users/login' || url === "/api/users/login") {
        await next()
    } else {
        //获取到token
        let token = ctx.request.headers["authorization"].spilt('Bearer ')[1]
        if (token) {
            //  如果有token的话解析
            const tokenItem = jwt.verify(token, 'screct')
            //    把创建时间和过期时间析构出来
            const { time, timeout } = tokenItem
            // 拿到当前时间
            let NewTime = new Date.getTime()
            if (NewTime - time <= timeout) {
                // 说明没过期
                await next()
            } else {
                ctx.body = {
                    status: 405,
                    message: '请带上token'
                }
            }
        } else {
            ctx.body = {
                status: 405,
                message: 'token 已过期，请重新登陆'
            }
        }
    }
}