/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-26 21:18:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-26 21:25:37
 * @FilePath: /1s/server/api/image.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */

import { getRelativePath } from '../fileManage.js'


export const imageUploadHook =  (router,sequelize) => router.post('/imageUpload',async (ctx) => {
    const table = sequelize.models.t_image;
    const { name, description } = ctx.request.body;

    const { file } = ctx.request.files; // 模型文件, 图片

    var filePath = getRelativePath(file.filepath);
  
    await table.create({
      name,
      description,
      path:filePath,
    });
    
    ctx.body = {   
      message: "图片上传成功",
      type:'success'
    };
})





// 获取基础可用于模型编辑的模型，不需要分页查找等功能
export const getImageHook = (router,sequelize) => router.post('/getImage' , async (ctx) => {

    let data = await ctx.queryList(sequelize.models.t_image)
 
    data.list.forEach(img => {
        img.dataValues.preview_img = ctx.relativePathToPreviewPath(img.path)
    });
    ctx.body = {
        data
    }
})



// 更具 图片 id 获取单一图片
export const getImageById = (router,sequelize) => router.post('/getImageById' , async (ctx) => {
    const table = sequelize.models.t_image;
    const img = await table.findOne({where:{id: ctx.request.body.id}})
    console.log(ctx.request.body.id)
    img.dataValues.preview_img = ctx.relativePathToPreviewPath(img.path)
    
    ctx.body = {
        data:img
    }
})
