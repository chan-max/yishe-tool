/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-26 19:23:47
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 11:52:46
 * @FilePath: /1s/server/middleware/index.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { mw_redis } from "./redis.js"
import { mw_paging } from "./paging.js"
import{ auth} from './auth.js'

export const middlewares = [
    mw_redis,
    mw_paging,
    auth
]