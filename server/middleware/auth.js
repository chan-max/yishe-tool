/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-18 18:49:18
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-12 09:42:24
 * @FilePath: /yishe/server/middleware/auth.js
 * @Description: 处理请求中的token
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import jwt from 'jsonwebtoken'

// 用随机数会导致每次重启系统所有token失效
// const privateKey = String(Math.random())

const privateKey = 'xlact'
/*
  token payload
*/

export const auth = (app) =>
  app.use(async (ctx, next) => {

    // 签发token
    ctx.signToken = (payload) => {
      return jwt.sign({
        ...payload
      }, privateKey)
    }

    // 验证token
    ctx.verifyToken = () => {
      var payload = null
      try{
        payload = jwt.verify(ctx.header.authorization, privateKey);
        return payload
      }catch(e){
        // 处理 token错误 , 过期 或者 无 token
        return null
      }
    }
    
    await next();
})