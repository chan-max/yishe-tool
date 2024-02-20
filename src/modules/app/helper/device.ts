/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-05 08:41:35
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 12:13:07
 * @FilePath: /1s/src/modules/app/helper/device.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

import {  Haptics,ImpactStyle,NotificationType } from '@capacitor/haptics';

/* 手机震动方法 */
export async function vibrate(duration){
    try{
        await Haptics.vibrate({
            duration
        })
    }catch(e){

    }
}


/*
  普通震动方法
*/
export async function impact(style = ImpactStyle.Light){
    try{
        await Haptics.impact({ style: ImpactStyle.Light });
    }catch(e){
    }
}


/*
    不同风格的震动效果
*/
export async function notification(type = NotificationType.Success){
    try{
        await Haptics.notification({ type: type});
    }catch(e){
    }
}