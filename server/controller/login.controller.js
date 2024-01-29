export const loginController = ({ router, app, sequelize, redis }) => {
  /* 生成用于扫码登录的二维码信息 */
  router.post("/requestQRCodeLoginInfo", async (ctx) => {
    redis;

    let uuid = crypto.randomUUID();

    const info = {
      uuid: uuid,
      ...ctx.request.body,
    };

    let res = await redis.setEx(uuid, 300, "");
    
    ctx.body = {
      data: info,
    };
  });
};
