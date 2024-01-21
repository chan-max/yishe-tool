/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-26 19:23:47
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 11:51:38
 * @FilePath: /1s/server/middleware/paging.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */
// 翻页处理

export const getPagingInfoFromContext = (ctx) => {
  // 暂时只支持 post
  let {
    // 当前页数
    page,
    // 每页的数量
    pageSize,
    // 偏移量
    offset,
    // 限制等同于每页数量
    limit,
    //排序方式
    order,
    // 查询方式
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
    ctx.queryList = (table,queryParams) =>
      new Promise(async (resolve, reject) => {
        const { page, pageSize } = getPagingInfoFromContext(ctx);
        try {
          const { count, rows: list } = await table.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            ...queryParams
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
