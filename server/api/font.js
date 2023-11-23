// 获取所有可用的字体列表
export const getFontsHook = (router, sequelize) =>
  router.get("/getFonts", async (ctx) => {
    const table = sequelize.models.t_font;
    const fonts = await table.findAll();

    fonts.forEach((item) => {
      item.dataValues.fullfilepath = ctx.relativePathToPreviewPath(item.file);
      item.dataValues.fullimgpath = ctx.relativePathToPreviewPath(item.img);
    });

    ctx.body = {
      data: fonts,
    };
  });

export const uploadFontHook = (router, sequelize) =>
  router.post("/uploadFont", async (ctx) => {
    const table = sequelize.models.t_font;
    const { name, description } = ctx.request.body;

    file = ctx.getUploadFileRelativePath("file");
    img = ctx.getUploadFileRelativePathh("img");

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
