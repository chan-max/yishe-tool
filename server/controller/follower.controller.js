/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-06 12:17:34
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-11 22:50:47
 * @FilePath: /yishe/server/controller/follower.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import { Op } from "sequelize";


export const followerController = ({ router, app, sequelize, redis }) => {

    // 关注
    router.post("/follow", async (ctx) => {
        let paylaod = ctx.verifyToken();

        await sequelize.models.t_follower.findOrCreate({
            where: {
                user_id: paylaod.userId,
                follower_id: ctx.request.body.followerId
            }
        })

        // 发送关注通知
        ctx.body = {
            message: '操作成功'
        }
    });

    // 取消关注
    router.post("/unfollow", async (ctx) => {
        await sequelize.models.t_follower.destroy({
            where: {
                user_id: paylaod.userId,
                follower_id: ctx.request.body.followerId
            }
        })
        // 发送取关通知
        ctx.body = {
            message: '操作成功'
        }
    });


    // 获取我的好友
    router.post("/getMyFriend", async (ctx) => {

        let payload = ctx.verifyToken()


       
        let data = sequelize.query
        debugger

        // 发送取关通知
        ctx.body = {
            data
        }
    });

    
    // 获取我的关注
    router.post("/getMyFollowing", async (ctx) => {

        let data = await ctx.queryList()
        // 发送取关通知
        ctx.body = {
            message: '操作成功'
        }
    });

    // 获取我的关注者
    router.post("/getMyFollower", async (ctx) => {
        let data = await ctx.queryList()
        // 发送取关通知
        ctx.body = {
            message: '操作成功'
        }
    });

};