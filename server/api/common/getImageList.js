// 获取基础可用于模型编辑的模型，不需要分页查找等功能

export const getImageListHook = (router,sequelize) => router.get('/getImageList' , async (ctx) => {
    const table = sequelize.models.Image;
    const res =  await table.findAll()
    ctx.body = {
        data:res
    }
})

