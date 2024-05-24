/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-05 23:35:57
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-06 07:50:25
 * @FilePath: /1s/src/common/time.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */


import { format, render, cancel, register } from 'timeago.js';


export function timeago(time){
    return format(time, 'zh_CN');
}


export  function timeout(ms = 0){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(ms)
        }, ms);
    })
}   