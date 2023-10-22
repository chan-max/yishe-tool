
// 用于获取所有的模型列表 ,分页功能


export const getModelListHook = (router,sequelize) => router.post('/getModelList' , async (ctx) => {
    const table = sequelize.models.Model1;
    const res =  await table.findAll()
    ctx.body = {
        data:res
    }
})

