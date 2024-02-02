/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-02 08:39:08
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 08:43:51
 * @FilePath: /1s/server/controller/dev.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

export const devController = ({ router, app, sequelize, redis }) => {
    /* 生成用于扫码登录的二维码信息 */
    router.post("/test", async (ctx) => {
           
      
      ctx.body = {
        data: [],
      };
    });
  };
  