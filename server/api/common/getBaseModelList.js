// 获取基础可用于模型编辑的模型，不需要分页查找等功能

export const getBaseModelListHook = (router, sequelize, app) =>
  router.get("/getBaseModelList", async (ctx) => {
    const table = sequelize.models.t_base_model;
    const res = await table.findAll();

    res.forEach((item) => {
      item.dataValues.imgFullpath = ctx.relativePathToPreviewPath(item.imgPath);
      item.dataValues.fileFullpath = ctx.relativePathToPreviewPath(item.filePath);
    });

    ctx.body = {
      data: res,
    };
  });
