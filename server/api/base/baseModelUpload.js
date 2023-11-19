import path from 'path'
import os from 'os'
import fs from 'fs'

import { getRelativePath } from '../../fileManage.js'

export const baseModelUploadHook = (router, sequelize) => router.post("/baseModelUpload", async (ctx) => {
    const table = sequelize.models.t_base_model;
    const { name, description } = ctx.request.body;
    const { file, img } = ctx.request.files; // 模型文件, 图片

    var filePath = getRelativePath(file.filepath);
    var imgPath = getRelativePath(img.filepath);
    
    await table.create({
      name,
      description,
      filePath,
      imgPath,
    });

    ctx.body = {
      message: "模型上传成功",
      type:'success'
    };
  });
