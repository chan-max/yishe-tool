/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-25 20:52:47
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-25 23:09:09
 * @FilePath: /1s/server/api/list.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */

import { Op } from "sequelize";

const table_map = {
    image:'t_image',
    textSticker:'t_text_sticker',
    model:'t_model',
}

export const getList = (router, sequelize, app) => router.post("/getList", async (ctx) => {
    const page = parseInt(ctx.request.body.page) || 1;
    const pageSize = parseInt(ctx.request.body.pageSize) || 5; // 默认 20 条

    let condition = {};
        
    if (ctx.request.body.keyword) {
      condition = {
        ...condition, 
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${ctx.request.body.keyword}%`
            }
          }, 
          {
            description: {
              [Op.like]: `%${ctx.request.body.keyword}%`
            }
          }
        ]
      }
    }
    

    if (ctx.request.body.startTime && ctx.request.body.endTime) {
      condition = {
        ...condition, 
        created_at: {
          [Op.between]: [new Date(ctx.request.body.startTime), new Date(ctx.request.body.endTime)]
        }
      };
    }
    
        
    const table = sequelize.models[table_map[ctx.request.body.type]]
    
    const {count,rows:data} =  await table.findAndCountAll({
      where: condition,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['createdAt', 'DESC']]
    })
    
    let pages = Math.ceil(count / pageSize);
    
    ctx.body = {
        count,
        pages,
        page,
        pageSize,
        data
      }
})
