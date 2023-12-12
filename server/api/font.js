// 获取所有可用的字体列表
export const getFontsHook = (router, sequelize) =>
  router.get("/getFonts", async (ctx) => {
    const table = sequelize.models.t_font;
    const fonts = await table.findAll();

    fonts.forEach((item) => {
      item.dataValues.preview_file = ctx.relativePathToPreviewPath(item.file);
      item.dataValues.preview_img = ctx.relativePathToPreviewPath(item.img);
    });

    ctx.body = {
      data: fonts,
    };
  });

export const uploadFontHook = (router, sequelize) =>
  router.post("/uploadFont", async (ctx) => {
    const table = sequelize.models.t_font;
    const { name, description } = ctx.request.body;

    var file = ctx.getUploadFileRelativePath("file");
    var img = ctx.getUploadFileRelativePath("img");

    await table.create({
      name,
      description,
      file,
      img,
    });

    ctx.body = {
      message: "字体上传成功",
      type: "success",
    };
  });

export const getFontById = (router, sequelize, app) => router.post('/getFontById', async (ctx) => {
  const table = sequelize.models.t_font;

  const font = await table.findOne({ where: { id: ctx.request.body.id } });

  font.dataValues.preview_img = ctx.relativePathToPreviewPath(font.img);
  font.dataValues.preview_file = ctx.relativePathToPreviewPath(font.file);

  ctx.body = {
    data: font
  }
})
