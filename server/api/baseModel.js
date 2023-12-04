// 获取基础可用于模型编辑的模型，不需要分页查找等功能
import { Op } from "sequelize";

export const injectBaseModelRoute = (router, sequelize, app) => {
  router.post("/getBaseModel", async (ctx) => {
    const table = sequelize.models.t_base_model;
    const res = await table.findAll();
    res.forEach((item) => {
      item.dataValues.imgFullpath = ctx.relativePathToPreviewPath(item.imgPath);
      item.dataValues.fileFullpath = ctx.relativePathToPreviewPath(
        item.filePath
      );
    });
    ctx.body = {
      data: res,
    };
  });
};


export const getBaseModelById = (router,sequelize) => router.post('/getBaseModelById' , async (ctx) => {
  const table = sequelize.models.t_base_model;
  const baseModel = await table.findOne({where:{id: ctx.request.body.id}});
  baseModel.dataValues.fullfilepath = ctx.relativePathToPreviewPath(baseModel.filePath);
    
  ctx.body = {
      data:baseModel
  } 
})