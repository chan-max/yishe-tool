export const mw_redis = (app) =>
  app.use(async (ctx, next) => {
    await next();
  });
