/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-29 21:41:56
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-16 22:43:38
 * @FilePath: /1s/server/api/model.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */

export const getModelListHook = (router, sequelize) =>
  router.post("/getModelList", async (ctx) => {
    const table = sequelize.models.t_model;
    const data = await table.findAll()
    data.forEach((item) => {
      item.dataValues.preview_img = ctx.relativePathToPreviewPath(item.img);
  })
    
    ctx.body = {
      data: data,
    };
  });
