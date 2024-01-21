/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-29 21:41:56
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 20:20:36
 * @FilePath: /1s/server/api/model.js
 * @Description: 关于模型操作的所有api
 *
 * Copyright (c) 2023 by 1s, All Rights Reserved.
 */

/* 
  获取模型列表,关联上传者
*/
export const getModelListHook = (router, sequelize) =>
  router.post("/getModelList", async (ctx) => {

    const data = await ctx.queryList(sequelize.models.t_model, {
      include: {
        model: sequelize.models.t_user
      }
    })

    data.list.forEach(item => {
      item.dataValues.preview_img = ctx.relativePathToPreviewPath(item.img);
      item.t_user?.setDataValue('preview_avatar', ctx.relativePathToPreviewPath(item.t_user.avatar))
    });

    ctx.body = {
      data: data,
    };
  });


export const getModelById = (router, sequelize, app) =>
  router.post("/getModelById", async (ctx) => {
    const table = sequelize.models.t_model;
    const model = await table.findOne({ where: { id: Number(ctx.request.body.id) } });

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
  const { user_id, modelInfo } = ctx.request.body;
  var imgPath = getRelativePath(img.filepath);

  await table.create({
    modelInfo,
    img: imgPath,
    user_id
  });

  ctx.body = {
    message: "模型上传成功",
    type: 'success'
  };
});


/*
  给模型点赞，取消点赞
*/
export const likeModel = (router, sequelize) => router.post("/likeModel", async (ctx) => {
  const table = sequelize.models.t_model_like;

  const payload = ctx.verifyToken()

  if (ctx.request.body.isLike == 'true') {
    // 点赞
    await table.findOrCreate({
      where: {
        user_id: payload.userId,
        model_id: ctx.request.body.modelId
      }
    })
    ctx.body = {
      type:'add'
    }
  } else {
    //取消点赞
    await table.destroy({
      where: {
        user_id: payload.userId,
        model_id: ctx.request.body.modelId
      }
    })
    ctx.body = {
      type:'delete'
    }
  }
});






