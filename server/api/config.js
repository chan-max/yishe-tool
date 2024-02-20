/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-30 14:23:46
 * @FilePath: /1s/server/api/config.js
 * @Description:  获取程序的基本配置信息
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */


export const getBasicConfig = (router, sequelize, app) => router.post('/getBasicConfig', async (ctx) => {

    const data = {
        
    }

    ctx.body = {
      data
    }
  })