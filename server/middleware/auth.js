/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-18 18:49:18
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 19:17:44
 * @FilePath: /1s/server/middleware/auth.js
 * @Description: 处理请求中的token
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import jwt from 'jsonwebtoken'

const privateKey = '1s.design'

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
        payload = jwt.verify(ctx.header.token, privateKey);
        return payload
      }catch(e){
        // 处理 token错误 , 过期 或者 无 token
        debugger
      }
    }
    
    await next();
  })