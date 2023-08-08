
function fullpathToPath(fullpath) {
  const _path = fullpath.split("uploads")[1];
  return _path;
}

export const baseModelUploadHook = (router, sequelize) =>
  router.post("/baseModelUpload", async (ctx) => {
    const table = sequelize.models.base_models;


    const { name, description } = ctx.request.body;
    const { file, img } = ctx.request.files; // 模型文件, 图片
    var filePath = fullpathToPath(file.filepath);
    var imgPath = fullpathToPath(img.filepath);
    
    filePath = filePath.replace('\\','/')
    imgPath = imgPath.replace('\\','/')


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
