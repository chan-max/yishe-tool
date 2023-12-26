import { mw_redis } from "./redis.js"
import { mw_paging } from "./paging.js"
export const middlewares = [
    mw_redis,
    mw_paging
]   