export const uploadTextSticker = (router, sequelize, app) =>
  router.post("/uploadTextSticker", async (ctx) => {
    const table = sequelize.models.t_text_sticker;

    var data = await table.create({
      img: ctx.getUploadFileRelativePath("img"),
    });

    ctx.body = {
      data: data,
    };
  });

// 获取所有贴纸
export const getTextSticker = (router, sequelize, app) =>
  router.post("/getTextSticker", async (ctx) => {
    try {
      let res = await ctx.queryList(sequelize.models.t_text_sticker);
      res.list.forEach((item) => {
        item.dataValues.preview_img = ctx.relativePathToPreviewPath(item.img);
      });
      ctx.body = {
        data: res,
      };
    } catch (e) {
      ctx.body = {
        type: "error"
      };
    }
  });

export const getTextStickerById = (router, sequelize, app) =>
  router.post("/getTextStickerById", async (ctx) => {
    const table = sequelize.models.t_text_sticker;

    const text = await table.findOne({ where: { id: ctx.request.body.id } });

    text.dataValues.preview_img = ctx.relativePathToPreviewPath(text.img);

    ctx.body = {
      data: text,
    };
  });
