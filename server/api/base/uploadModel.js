
import { getRePath } from '../../fileManage.js'

export const uploadModelHook = (router, sequelize) => router.post("/uploadModel", async (ctx) => {
    const table = sequelize.models.Model1;
    const { modelInfo } = ctx.request.body;
    const { img } = ctx.request.files; // 模型文件, 图片

    var imgPath = getRePath(img.filepath);
    
    await table.create({
        modelInfo,
        img:imgPath
    });

    ctx.body = {
      message: "模型上传成功",
      type:'success'
    };
  });
