import { formatFilePath } from "../../util.js";



// 获取基础可用于模型编辑的模型，不需要分页查找等功能
export const getImageListHook = (router,sequelize) => router.get('/getImageList' , async (ctx) => {
    const table = sequelize.models.t_image;
    const imgs =  await table.findAll()
    imgs.forEach(img => {
        img.dataValues.fullpath = ctx.relativePathToPreviewPath(img.path)
    });
    ctx.body = {
        data:imgs
    }
})

