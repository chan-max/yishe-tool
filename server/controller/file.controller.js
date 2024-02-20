/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-05 12:54:44
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 13:39:39
 * @FilePath: /1s/server/controller/file.controller.js
 * @Description:
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import fs from "fs";
import { uploadsPath } from "../fileManage.js";
import send from "koa-send";

export const fileController = ({ router, app, sequelize, redis }) => {
    router.get("/file", async (ctx) => {
        ctx.set('Cache-Control', 'max-age=31536000');
        await send(ctx, ctx.query.name, { root: uploadsPath() });
    });
};