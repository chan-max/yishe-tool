/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-14 15:17:13
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-15 12:16:24
 * @FilePath: /yishe/server/controller/communication.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import { Op } from "sequelize";

import { formatUserInfo } from '../format/user.js';

export const communicationController = (params) => {
    postGetMyCommunicationList(params)
    postGetCommunicationMessage(params)
}

/*
    获取我的聊天列表
*/
const postGetMyCommunicationList = ({ router, app, sequelize, redis }) => router.post('/getMyCommunicationList', async (ctx) => {
    let payload = ctx.verifyToken();

    const data = await ctx.queryList(sequelize.models.t_communication, {
        where: {
            [Op.or]: [{
                initiator_id: payload.userId
            }, {
                receiver_id: payload.userId
            }]
        },
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
            model: sequelize.models.t_user,
            as: 'initiator_info'
        }, {
            model: sequelize.models.t_user,
            as: 'receiver_info'
        }]
    })

    data.list = data.list.map((item) => {
        formatUserInfo(ctx, item.initiator_info)
        formatUserInfo(ctx, item.receiver_info)
        // 该聊天是否由我发起

        const isInitiatedByMe = item.initiator_info.id == payload.userId

        return {
            title: isInitiatedByMe ? item.receiver_info.name : item.initiator_info.name,
            label: '最新的消息', // 查询最新消息
            avatar: isInitiatedByMe ? item.receiver_info.getDataValue('preview_avatar') : item.initiator_info.getDataValue('preview_avatar'),
            communicationId: item.id
        }
    })

    ctx.body = {
        data
    }
})


/*
    获取某个聊天的所有聊天记录
*/
export const postGetCommunicationMessage = ({ router, app, sequelize, redis }) => router.post('/getCommunicationMessage', async (ctx) => {


    let data = await ctx.queryList(sequelize.models.t_message,{
        where:{
            communication_id:ctx.request.body.communicationId
        },
        order:[[
            'createdAt',
            'DESC'
        ]]
    })

    ctx.body = {
        data
    }
})
