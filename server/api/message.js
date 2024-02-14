/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-14 13:49:53
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-14 21:12:25
 * @FilePath: /yishe/server/api/message.js
 * @Description: 发送消息
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import { Op } from "sequelize";


/*
    通信之前
*/


export const sendMessage = async (ctx, options) => {
    const {
        type,
        sender,
        receiver
    } = options

    const sequelize = ctx.useSequelize();

    // 初始化通信数据
    const [data, created] = await sequelize.models.t_communication.findOrCreate({
        where: {
            [Op.or]: [{
                initiator_id: sender,
                receiver_id: receiver,
            }, {
                initiator_id: receiver,
                receiver_id: sender,
            },]
        },
        defaults:{
            initiator_id: sender,
            receiver_id: receiver,
        }
    })
}
