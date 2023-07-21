import path from "path";

export const baseModelUploadHook = (router, sequelize) =>
  router.post("/baseModelUpload", async (ctx) => {
    const table = sequelize.models.base_models;
    const file = ctx.request.files.file;
    const { name, description } = ctx.request.body;
    const fullpath = file.filepath;
    const _path = fullpath.split("uploads")[1];
    debugger;
    await table.create({
      name,
      description,
      path:_path,
    });
    ctx.body = {
      message: "File uploaded successfully",
    };
  });
