
export const availableModelController = ({ router, app, sequelize, redis }) => {

  router.post('/publishAvailableModel', async (ctx) => {
    /*
      要发布的模型id，价格，日期等
    */
    let table = sequelize.models.t_available_model
    let payload = ctx.verifyToken()
    if (!payload) {
      return ctx.body = {
        message: '无权限'
      }
    }

    await table.create({
      model_id: ctx.request.body.modelId,
      user_id: payload.userId
    })

    ctx.body = {
      message: '成功'
    }
  })

  router.post('/removeAvailableModel', async (ctx) => {
    /*
      移除已经发布的模型
    */
  })

  /* 获取所有可用于购买的模型*/
  router.post("/getAvailableModel", async (ctx) => {

    let data = await ctx.queryList(sequelize.models.t_available_model, {
      include: [{
        model: sequelize.models.t_model,
      }, {
        model: sequelize.models.t_user,
      }]
    })

    const payload = ctx.verifyToken()

    // 查询点赞状态
    await Promise.all(data.list.map((item) => {
      return new Promise(async (resolve, reject) => {
        let record = await sequelize.models.t_available_model_like.findOne({
          where: {
            user_id: payload.userId,
            available_model_id:item.id
          }
        });

        item.setDataValue('liked',!!record)
        resolve()
      })
    }))

    data.list.forEach((item) => {
      // 模型预览图
      item.t_model.dataValues.preview_img = ctx.relativePathToPreviewPath(item.t_model.img);

      // 用户头像
      item.t_user?.setDataValue(
        "preview_avatar",
        ctx.relativePathToPreviewPath(item.t_user.avatar)
      );
    });

    ctx.body = {
      data: data,
    };
  });


  router.post("/likeAvailableModel", async (ctx) => {
    const table = sequelize.models.t_available_model_like;

    const payload = ctx.verifyToken();

    if (ctx.request.body.liked == "true") {
      // 点赞
      await table.findOrCreate({
        where: {
          user_id: payload.userId,
          available_model_id: ctx.request.body.availableModelId,
        },
      });
      await sequelize.models.t_available_model.increment('like_count', { by: 1, where: { id: ctx.request.body.availableModelId } })
      ctx.body = {
        type: "add",
      };
    } else {
      //取消点赞
      await table.destroy({
        where: {
          user_id: payload.userId,
          available_model_id: ctx.request.body.availableModelId,
        },
      });
      await sequelize.models.t_available_model.decrement('like_count', { by: 1, where: { id: ctx.request.body.availableModelId } })
      ctx.body = {
        type: "delete",
      };
    }
  });
};



