/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-23 22:50:51
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 20:02:46
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
    
    const isRoot = parent_id == 0
    
    // 同步模型的评论数量
    await sequelize.models.t_available_model.increment('comment_count', { by: 1, where: { id: available_model_id } })

    var data = await sequelize.models.t_available_model_comment.create({
      available_model_id,
      parent_id,
      user_id,
      root_id:root_id || 0,
      content,
    });
    
    // 更新根评论的根id为自身id
    if (isRoot) {
      await sequelize.models.t_available_model_comment.update({
        root_id: data.id
      }, {
        where: {
          id: data.id
        }
      })
    }

    // 非根节点会统计子评论的数量
    if (!isRoot) {
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
          root_id: ctx.request.body.rootId,
          // 排除非根节点
          parent_id: {
            [Op.not]: 0
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

  /*
    删除模型评论
  */
  router.post("/deleteAvailableModelComment", async (ctx) => {
    var payload = ctx.verifyToken()
    /*
      删除评论事务
      1. 删除数据，包括其相关子评论
      删除相关模型的总评论数
      删除当前评论的根节点的评论数
    */
    try {
      await sequelize.transaction(async (t) => {

        // 减少模型评论数
        await sequelize.models.t_available_model.decrement('comment_count',
          {
            by: 1,
            where: { id: ctx.request.body.availableModelId },
            transaction: t
          })

        /*
          删除评论数据时会同时删除其所有的子评论
        */

        /* 删除评论数据 */
          
        // 非根评论会减少根评论的子评论数  
        if (ctx.request.body.commentId != ctx.request.body.rootCommentId) {
          // 不是根评论, 统计其根评论的子评论
          await sequelize.models.t_available_model_comment.decrement('root_children_count',
            {
              by: 1,
              where: { id: ctx.request.body.rootCommentId },
              transaction: t
            })

          // 删除该评论  
          await sequelize.models.t_available_model_comment.destroy({
            where: {
              id: ctx.request.body.commentId
            }
          }, { transaction: t })
        } else {
          // 是根评论
          await sequelize.models.t_available_model_comment.destroy({
            where: {
              root_id: ctx.request.body.rootCommentId
            },
            transaction: t
          })
        }


        return ctx.body = {
          type: 'success'
        }
      });
    } catch (error) {
      ctx.body = {
        message: '操作错误',
        error:error
      }
    }
  });
};
