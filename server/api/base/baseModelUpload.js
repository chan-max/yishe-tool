
function fullpathToPath(fullpath) {
  const _path = fullpath.split("uploads")[1];
  return _path;
}

export const baseModelUploadHook = (router, sequelize) =>
  router.post("/baseModelUpload", async (ctx) => {
    const table = sequelize.models.base_models;


    const { name, description } = ctx.request.body;
    const { file, img } = ctx.request.files; // 模型文件, 图片
    const filePath = fullpathToPath(file.filepath);
    const imgPath = fullpathToPath(img.filepath);
    
    await table.create({
      name,
      description,
      filePath,
      imgPath,
    });
    ctx.body = {
      message: "File uploaded successfully",
    };
  });
