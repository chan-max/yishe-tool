/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-29 21:41:56
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-23 20:27:17
 * @FilePath: /1s/server/api/model.js
 * @Description:
 *
 * Copyright (c) 2023 by 1s, All Rights Reserved.
 */

export const getModelListHook = (router, sequelize) =>
  router.post("/getModelList", async (ctx) => {
    const table = sequelize.models.t_model;
    const data = await table.findAll();
    data.forEach((item) => {
      item.dataValues.preview_img = ctx.relativePathToPreviewPath(item.img);
    });

    ctx.body = {
      data: data,
    };
  });

export const getModelById = (router, sequelize, app) =>
  router.post("/getModelById", async (ctx) => {
    const table = sequelize.models.t_model;

    const model = await table.findOne({ where: { id: ctx.request.body.id } });

    model.dataValues.preview_img = ctx.relativePathToPreviewPath(model.img);
  
    ctx.body = {
      data: model,
    };
  });


// 获取随机模型 
export const getRandomModel = () => {
  
}