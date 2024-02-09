/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-07 13:57:04
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-07 16:35:52
 * @FilePath: /1s/server/controller/config.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import { getHost } from "../index.js";


export const configController = ({ router, app, sequelize, redis }) => {
    router.post("/getBasicConfig", async (ctx) => {

        ctx.body = {
            data: {
                // websocket连接地址
                websocket: `${ctx.protocol == 'https' ? 'wss' : 'ws'}://${getHost()}`
            }
        }
    });
};