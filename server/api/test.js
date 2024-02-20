/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-07 13:32:19
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-07 14:44:52
 * @FilePath: /1s/server/api/test.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
export const test = (router, sequelize, app) =>
  router.post("/test", async (ctx) => {
    const table = sequelize.models.t_model;
    const model = await table.findAll({
       include: {
        model:sequelize.models.t_user
       }
    });
    ctx.body = {
      data: model,
    };
});