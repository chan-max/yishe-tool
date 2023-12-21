/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-22 00:20:25
 * @FilePath: /1s/src/modules/mobile/view/scan/media.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */


// 摄像头是否可用
export function cameraUsable() {
    return !!navigator?.mediaDevices.getUserMedia
}

export const facingModeUserOption = { video: { 
    width:1000,
    facingMode: "user"
 } }

export const facingModeEnvironmentOption = {
    video: {
        facingMode: { exact: "environment" }
    }
}

