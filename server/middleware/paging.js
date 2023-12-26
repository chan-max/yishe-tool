// 翻页处理

export const getPagingInfoFromContext = (ctx) => {
  // 暂时只支持 post
  let {
    page,
    pageSize,
    offset,
    limit,
    order,
    keyword,
    keywords,
    startTime,
    endTime,
  } = ctx.request.body;

  return {
    page: page || 1,
    pageSize: pageSize || 10,
  };
};

export const mw_paging = (app) =>
  app.use(async (ctx, next) => {
    ctx.getPagingInfo = () => getPagingInfoFromContext(ctx);
    ctx.queryList = (table) =>
      new Promise(async (resolve, reject) => {
        const { page, pageSize } = getPagingInfoFromContext(ctx);
        try {
          const { count, rows: list } = await table.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
          });
          
          let pages = Math.ceil(count / pageSize);

          resolve({
            count,
            pages,
            page,
            pageSize,
            list,
          });
        } catch (e) {
          reject(e);
        }
      });

    await next();
  });
