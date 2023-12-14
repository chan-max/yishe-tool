


// 获取基础可用于模型编辑的模型，不需要分页查找等功能
export const getImageHook = (router,sequelize) => router.post('/getImage' , async (ctx) => {
    const table = sequelize.models.t_image;
    const imgs =  await table.findAll()
    imgs.forEach(img => {
        img.dataValues.preview_img = ctx.relativePathToPreviewPath(img.path)
    });
    ctx.body = {
        data:imgs
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
