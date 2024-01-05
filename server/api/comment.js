// 基础模型数量不会很多，暂时不需要分批查询

export const getModelComment = (router, sequelize, app, redis) => {
  // 该接口只有管理员更新基础模型信息时需要更新, 直接读缓存即可
  router.post("/getModelComment", async (ctx) => {
    // 模型id
    const id = ctx.request.body.id;
    const commentsTree = await getCommentsTree(productId);
    ctx.body = commentsTree;
  });
};

export const addModelComment = (router, sequelize, app, redis) => {
  // 该接口只有管理员更新基础模型信息时需要更新, 直接读缓存即可
  router.post("/addModelComment", async (ctx) => {
    // 模型id
    const { model_id, parent_id, user_id, content } = ctx.request.body;

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
