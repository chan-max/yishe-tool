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


export function timeago(time) {
    return format(time, 'zh_CN');
}


export function timeout(ms = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(ms)
        }, ms);
    })
}   



function isRecentDays(dateToCheck, days) {
    const today = new Date(); // 获取当前日期
    const targetDate = new Date(dateToCheck); // 将输入日期转换为Date对象

    // 计算目标日期与今天的时间差（以毫秒为单位）
    const timeDiff = targetDate.getTime() - today.getTime();
    
    // 计算n天的毫秒数
    const nDaysInMs = days * 24 * 60 * 60 * 1000;

    // 判断时间差是否在n天之内
    return Math.abs(timeDiff) <= nDaysInMs;
}


export default {
    timeago,
    timeout,
    isRecentDays
}