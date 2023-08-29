// 获取基础可用于模型编辑的模型，不需要分页查找等功能

export const getBaseModelListHook = (router,sequelize) => router.get('/getBaseModelList' , async (ctx) => {
    const table = sequelize.models.BaseModel;
    const res =  await table.findAll()
    ctx.body = {
        data:res
    }
})

