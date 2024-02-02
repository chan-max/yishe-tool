/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-02 08:19:22
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 09:29:43
 * @FilePath: /1s/server/controller/imageGroup.controller.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */


export const imageGroupController = ({ router, app, sequelize, redis }) => {


    router.post("/getImageGroup", async (ctx) => {
        let table = sequelize.models.t_image_group

        let data = await ctx.queryList(table)
        
        ctx.body = {
            status:0,
            data:data
        }
    });

    router.post("/createImageGroup", async (ctx) => {
        let table = sequelize.models.t_image_group

        await table.create({
        })
        
        ctx.body = {
            status:'0'
        }
    });

    router.post("/deleteImageGroup", async (ctx) => {
        let table = sequelize.models.t_image_group

        await table.destroy({
        })
        
        ctx.body = {
            status:'0'
        }
    });

    router.post("/updateImageGroup", async (ctx) => {
        
    });
};



