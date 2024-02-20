/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-14 22:25:10
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-14 22:26:48
 * @FilePath: /1s/src/api/api/paging.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */


/*
    通用列表类返回数据接口
*/
export interface PagingResponseData {
    list: any[] | null,
    page: number,
    pageSize: number,
    pages:number,
    count:number
}