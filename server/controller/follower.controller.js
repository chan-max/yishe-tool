/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-06 12:17:34
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-13 21:51:36
 * @FilePath: /yishe/server/controller/follower.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import { Op } from "sequelize";
import { getRelationship } from '../query/user.js'
import { formatUserInfo } from '../format/user.js';

export const followerController = ({ router, app, sequelize, redis }) => {
    // 关注
    router.post("/follow", async (ctx) => {
        let paylaod = ctx.verifyToken();
        await sequelize.models.t_follower.findOrCreate({
            where: {
                user_id: ctx.request.body.userId,
                follower_id: paylaod.userId
            }
        })

        const relationship = await getRelationship(sequelize.models.t_follower, paylaod.userId, ctx.request.body.userId)

        // 发送关注通知
        ctx.body = {
            data: relationship,
            message: '操作成功'
        }
    });

    // 取消关注
    router.post("/unfollow", async (ctx) => {
        let paylaod = ctx.verifyToken();
        await sequelize.models.t_follower.destroy({
            where: {
                user_id: ctx.request.body.userId,
                follower_id: paylaod.userId
            }
        })
        // 发送取关通知
        const relationship = await getRelationship(sequelize.models.t_follower, paylaod.userId, ctx.request.body.userId)

        // 发送关注通知
        ctx.body = {
            data: relationship,
            message: '操作成功'
        }
    });


    // 获取我的好友
    router.post("/getMyFriends", async (ctx) => {

        let payload = ctx.verifyToken()

        let data = sequelize.query

        // 发送取关通知
        ctx.body = {
            data
        }
    });


    // 获取我的关注
    router.post("/getMyFollowings", async (ctx) => {
        let payload = ctx.verifyToken()
        let data = await ctx.queryList(sequelize.models.t_follower, {
            where: {
                follower_id: payload.userId
            },
            include: [{
                model: sequelize.models.t_user,
                as: 'user_info'
            }, {
                model: sequelize.models.t_user,
                as: 'follower_info'
            }]
        })
 
        data.list.forEach((item) => {
            formatUserInfo(ctx, item.user_info)
            formatUserInfo(ctx, item.follower_info)
        })

        ctx.body = {
            data: data
        }
    });

    // 获取我的关注者
    router.post("/getMyFollowers", async (ctx) => {
        let payload = ctx.verifyToken()
        let data = await ctx.queryList()
        ctx.body = {
            message: '操作成功'
        }
    });
};