/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-23 22:50:51
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-03 16:23:33
 * @FilePath: /1s/server/controller/comment.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { Op } from "sequelize";

export const commentController = ({ router, app, sequelize, redis }) => {
  /* 给评论点赞 */
  router.post("/likeModelComment", async (ctx) => {

    var payload = ctx.verifyToken()

    await sequelize.models.t_model_comment.increment('like_count', { by: 1, where: { id: ctx.request.body.commentId } })

    ctx.body = {
      type: 'success'
    }
  });


  /*
    为已发布的模型
  */
  router.post("/addAvailableModelComment", async (ctx) => {
    // 模型id
    var {
      availableModelId: available_model_id,
      parentId: parent_id, // 特殊说明， parentId 为 0 即为根评论
      userId: user_id,
      rootId: root_id,
      content,
    } = ctx.request.body;

    // 同步模型的评论数量
    await sequelize.models.t_available_model.increment('comment_count', { by: 1, where: { id: available_model_id } })

    var data = await sequelize.models.t_available_model_comment.create({
      available_model_id,
      parent_id,
      user_id,
      root_id,
      content,
    });

    // 非根节点会统计子评论的数量
    if (parent_id != 0) {
      // 保存根评论的子评论数量
      await sequelize.models.t_available_model_comment.increment('root_children_count', {
        by: 1,
        where: {
          parent_id: 0,
          root_id: root_id
        }
      })
    }


    ctx.body = {
      data: data,
    };
  });

  router.post("/getAvailableModelComment", async (ctx) => {
    // 默认使用最新的排序类型
    const sortType = ctx.request.body.sortType || "latest";
    
    const queryOptions = {
      /*
        判断是否为子评论节点
      */
      where: ctx.request.body.isChildren ?
        {
          root_id:ctx.request.body.rootId,
          // 排除非根节点
          parent_id:{
            [Op.not]:0
          }
        } :
        {
          available_model_id: ctx.request.body.availableModelId,
          parent_id: ctx.request.body.parentId || 0
        },
      order: [
        sortType == 'latest' ? ["createdAt", "DESC"] : ["like_count", "DESC"]
      ],
      include: {
        model: sequelize.models.t_user,
      },
    }

    let data = await ctx.queryList(sequelize.models.t_available_model_comment, queryOptions);

    /*
      rootid 用来统计数量 
    */

    data.list.forEach((item) => {
      item.t_user.setDataValue(
        "preview_avatar",
        ctx.relativePathToPreviewPath(item.t_user.avatar)
      );
    });

    ctx.body = {
      data,
    };
  });


  router.post("/likeAvailableModelComment", async (ctx) => {
    var payload = ctx.verifyToken()
    await sequelize.models.t_available_model_comment.increment('like_count', { by: 1, where: { id: ctx.request.body.commentId } })
    ctx.body = {
      type: 'success'
    }
  });

};
