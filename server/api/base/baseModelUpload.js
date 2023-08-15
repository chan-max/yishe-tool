import path from 'path'
import os from 'os'
import { getRePath } from '../../fileManage.js'

export const baseModelUploadHook = (router, sequelize) => router.post("/baseModelUpload", async (ctx) => {
    const table = sequelize.models.base_models;

    const { name, description } = ctx.request.body;
    const { file, img } = ctx.request.files; // 模型文件, 图片
    var filePath = getRePath(file.filepath);
    var imgPath = getRePath(img.filepath);

    await table.create({
      name,
      description,
      filePath,
      imgPath,
    });



    ctx.body = {
      message: "File uploaded successfully",
    };
  });
