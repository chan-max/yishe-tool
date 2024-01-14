/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-05 19:35:01
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-14 22:55:21
 * @FilePath: /1s/server/api/comment.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
// 基础模型数量不会很多，暂时不需要分批查询

export const getModelComment = (router, sequelize, app, redis) => {
  // 该接口只有管理员更新基础模型信息时需要更新, 直接读缓存即可
  router.post("/getModelComment", async (ctx) => {
    // 模型id
    let data = await ctx.queryList(sequelize.models.t_model_comment)
    
    ctx.body = {
        data
    }
  });
};



export const addModelComment = (router, sequelize, app, redis) => {
  // 该接口只有管理员更新基础模型信息时需要更新, 直接读缓存即可
  router.post("/addModelComment", async (ctx) => {
    // 模型id
    const { modelId: model_id, parentId: parent_id, userId: user_id, content } = ctx.request.body;

    const table = sequelize.models.t_model_comment;

    var data = table.create({
      model_id,
      parent_id,
      user_id,
      content,
    });

    ctx.body = {
      data: data,
    };
  });
};
