/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-29 21:41:56
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-07 18:49:21
 * @FilePath: /1s/server/api/model.js
 * @Description:
 *
 * Copyright (c) 2023 by 1s, All Rights Reserved.
 */



export const getModelListHook = (router, sequelize) =>
  router.post("/getModelList", async (ctx) => {
    
    const data = await ctx.queryList(sequelize.models.t_model,{
      include: {
        model:sequelize.models.t_user
       }
    })

    data.list.forEach(item => {
      item.dataValues.preview_img = ctx.relativePathToPreviewPath(item.img);
    });

    ctx.body = {
      data: data,
    };
  });


export const getModelById = (router, sequelize, app) =>
  router.post("/getModelById", async (ctx) => {
    const table = sequelize.models.t_model;
    const model = await table.findOne({ where: { id: Number(ctx.request.body.id )} });
    
    model.dataValues.preview_img = ctx.relativePathToPreviewPath(model.img);
    
    ctx.body = {
      data: model,
    };
});




// 获取随机模型 
export const getRandomModel = () => {
}

import { getRelativePath } from '../fileManage.js'

export const uploadModelHook = (router, sequelize) => router.post("/uploadModel", async (ctx) => {
    const table = sequelize.models.t_model;
    const { img } = ctx.request.files; // 模型文件, 图片
    const { t_user_id ,modelInfo} = ctx.request.body;
    var imgPath = getRelativePath(img.filepath);
    
    await table.create({
        modelInfo,
        img:imgPath,
        t_user_id
    }); 

    ctx.body = {
      message: "模型上传成功",
      type:'success'
    };
  });



