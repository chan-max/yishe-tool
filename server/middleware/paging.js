/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-26 19:23:47
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-06 21:41:46
 * @FilePath: /1s/server/middleware/paging.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */
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
  } = ctx.request.body || {};

  return {
    page: Number(page || 1),
    pageSize: Number(pageSize || 10),
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
          debugger
          reject(e);
        }
      });

    await next();
  });
