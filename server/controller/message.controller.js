/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-14 10:42:32
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-15 10:56:31
 * @FilePath: /yishe/server/controller/message.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */


export const messageController = (params) => {
    postSendMessage(params)
}

const postSendMessage = ({ router, app, sequelize, redis }) => router.post('/sendMessage', async (ctx) => {
})





