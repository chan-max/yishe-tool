// 统一处理上传的静态文件

export const file = (router, sequelize, app) =>
  router.get("/file/:name", async (ctx, next) => {

    ctx.body = {
        name:''
    }
  })