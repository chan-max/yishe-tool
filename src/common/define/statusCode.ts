/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-21 16:24:01
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-21 16:25:04
 * @FilePath: /1s/src/common/define/statusCode.ts
 * @Description: 定义所有状态码，与服务端同步
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

export enum ResponseStatusCode {
        // 未知错误
        UNKNOWN_ERROR = 1,
        // 账号已存在
        ACCOUNT_ALREADY_EXIST = 1000,
        // 账号注册成功
        SIGNUP_SUCCESS = 10,
        // 未知错误
        UNKNOW_ERROR = 2,
        // 账号不存在
        ACCOUNT_NOT_EXIST = 3,
        // 登陆成功
        LOGIN_SUCCESS = 4,
        // 密码错误
        PASSWORD_ERROR = 5,
}
