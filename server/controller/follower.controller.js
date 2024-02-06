/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-06 12:17:34
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-06 13:17:57
 * @FilePath: /1s/server/controller/follower.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */


/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-05 12:54:44
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 13:39:39
 * @FilePath: /1s/server/controller/file.controller.js
 * @Description: 处理用户之间的关注关系
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */



export const followerController = ({ router, app, sequelize, redis }) => {

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
            message:'操作成功'
        }
    });

    router.post("/unfollow", async (ctx) => {
        await sequelize.models.t_follower.destroy({
            where: {
                user_id: paylaod.userId,
                follower_id: ctx.request.body.followerId
            }
        })
        // 发送取关通知
        ctx.body = {
            message:'操作成功'
        }
    });
};