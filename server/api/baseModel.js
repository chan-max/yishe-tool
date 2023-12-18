/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-17 17:33:39
 * @FilePath: /1s/server/api/baseModel.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */
import { REDIS_KEY_CACHE_BASE_MODELS } from "../redis/keys.js";


export const injectBaseModelRoute = (router, sequelize, app, redis) => {
  // 该接口只有管理员更新基础模型信息时需要更新, 直接读缓存即可
  router.post("/getBaseModel", async (ctx) => {

    const cache = await redis.get(REDIS_KEY_CACHE_BASE_MODELS)

    if (cache) {
      return ctx.body = {
        data: JSON.parse(cache),
      };
    }

    
    const table = sequelize.models.t_base_model;
    const data = await table.findAll();
    data.forEach((item) => {
      item.dataValues.preview_img = ctx.relativePathToPreviewPath(item.imgPath);
      item.dataValues.preview_file = ctx.relativePathToPreviewPath(
        item.filePath
      );
    });

    await redis.set(REDIS_KEY_CACHE_BASE_MODELS,JSON.stringify(data))

    ctx.body = {
      data: data,
    };
  });
};


export const getBaseModelById = (router, sequelize) => router.post('/getBaseModelById', async (ctx) => {
  const table = sequelize.models.t_base_model;
  const baseModel = await table.findOne({ where: { id: ctx.request.body.id } });
  baseModel.dataValues.fullfilepath = ctx.relativePathToPreviewPath(baseModel.filePath);

  ctx.body = {
    data: baseModel
  }
})