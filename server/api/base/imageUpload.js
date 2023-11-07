import { getRePath } from '../../fileManage.js'


export const imageUploadHook =  (router,sequelize) => router.post('/imageUpload',async (ctx) => {
    const table = sequelize.models.Image;
    const { name, description } = ctx.request.body;

    const { file } = ctx.request.files; // 模型文件, 图片

    var filePath = getRePath(file.filepath);
  
    await table.create({
      name,
      description,
      path:filePath,
    });
    
    ctx.body = {   
      message: "图片上传成功",
      type:'success'
    };
})