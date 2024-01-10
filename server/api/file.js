// 统一处理上传的静态文件
import fs from "fs";
import { uploadsPath } from "../fileManage.js";
import send from "koa-send";

export const file = (router, sequelize, app) =>
  router.get("/file", async (ctx) => {
      await send(ctx, ctx.query.name,{root:uploadsPath()});
  });
