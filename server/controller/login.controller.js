/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-20 08:07:01
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 21:16:43
 * @FilePath: /yishe/server/controller/login.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
export const loginController = ({ router, app, sequelize, redis }) => {
  /* 生成用于扫码登录的二维码信息 */
  router.post("/requestQRCodeLoginInfo", async (ctx) => {
    redis;

    let uuid = crypto.randomUUID();

    const info = {
      uuid: uuid,
      ...ctx.request.body,
    };

    // let res = await redis.setEx(uuid, 300, "");
    
    ctx.body = {
      data: info,
    };
  });
};
