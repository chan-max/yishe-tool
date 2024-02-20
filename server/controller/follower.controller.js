/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-06 12:17:34
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-15 10:49:09
 * @FilePath: /yishe/server/controller/follower.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import { Op } from "sequelize";
import { getRelationship } from '../query/user.js'
import { formatUserInfo } from '../format/user.js';

import { sendMessage } from "../api/message.js";

export const followerController = (params) => {
    // 关注
    const { router, app, sequelize, redis } = params
    postUnfollow(params)
    postFollow(params)

    // 取消关注



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


const postFollow = ({ router, app, sequelize, redis }) => router.post("/follow", async (ctx) => {
    let payload = ctx.verifyToken();
    await sequelize.models.t_follower.findOrCreate({
        where: {
            user_id: ctx.request.body.userId,
            follower_id: payload.userId
        }
    })

    const relationship = await getRelationship(sequelize.models.t_follower, payload.userId, ctx.request.body.userId)
    /*
        发送关注通知
    */

    await sendMessage(ctx, {
        sender: payload.userId,
        receiver: Number(ctx.request.body.userId),
        type: 'follow'
    })

    // 发送关注通知
    ctx.body = {
        data: relationship,
        message: '操作成功'
    }
});


const postUnfollow = ({ router, app, sequelize, redis }) => router.post("/unfollow", async (ctx) => {
    let payload = ctx.verifyToken();
    await sequelize.models.t_follower.destroy({
        where: {
            user_id: ctx.request.body.userId,
            follower_id: payload.userId
        }
    })

    // 发送取关通知
    const relationship = await getRelationship(sequelize.models.t_follower, payload.userId, ctx.request.body.userId)

    await sendMessage(ctx, {
        sender: payload.userId,
        receiver: Number(ctx.request.body.userId),
        type: 'unfollow'
    })

    // 发送关注通知
    ctx.body = {
        data: relationship,
        message: '操作成功'
    }
});