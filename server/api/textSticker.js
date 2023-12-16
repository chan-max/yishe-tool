

export const uploadTextSticker = (router, sequelize, app) => router.post('/uploadTextSticker', async (ctx) => {
    const table = sequelize.models.t_text_sticker;

    var data = await table.create({
        img: ctx.getUploadFileRelativePath('img')
    });

    ctx.body = {
        data:data,
    }
})

export const getTextSticker = (router, sequelize, app) => router.post('/getTextSticker', async (ctx) => {
    const table = sequelize.models.t_text_sticker;

    const data = await table.findAll()

    data.forEach((item) => {
        item.dataValues.preview_img = ctx.relativePathToPreviewPath(item.img);
    })
    
    ctx.body = {
        data
    }
})


export const getTextStickerById = (router, sequelize, app) => router.post('/getTextStickerById', async (ctx) => {
    const table = sequelize.models.t_text_sticker;
    
    const text = await table.findOne({where:{id: ctx.request.body.id}});

    text.dataValues.preview_img = ctx.relativePathToPreviewPath(text.img);
  
    ctx.body = {
        data:text
    }
})