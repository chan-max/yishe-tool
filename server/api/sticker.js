

export const uploadTextSticker = (router, sequelize, app) => router.post('/uploadTextSticker', async (ctx) => {
    const table = sequelize.models.t_text_sticker;

    await table.create({
        img: ctx.getUploadFileRelativePath('img')
    });

    ctx.body = {
        type: 'success',
        message: '上传成功'
    }
})

export const getTextSticker = (router, sequelize, app) => router.post('/getTextSticker', async (ctx) => {
    const table = sequelize.models.t_text_sticker;

    const data = await table.findAll()

    data.forEach((item) => {
        item.dataValues.imgFullpath = ctx.relativePathToPreviewPath(item.img);
    })

    ctx.body = {
        data
    }
})