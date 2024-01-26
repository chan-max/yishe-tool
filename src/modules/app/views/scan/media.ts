/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-25 22:08:50
 * @FilePath: /1s/src/modules/app/views/scan/media.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */


// 摄像头是否可用
export function cameraUsable() {
    return !!navigator?.mediaDevices?.getUserMedia
}

export const facingModeUserOption = {
    video: {
        width: 1280, height: 720,
        facingMode: { exact: "user" }
    }
}

export const facingModeEnvironmentOption = {
    video: {
        facingMode: { exact: "environment" }
    }
}

export function nextFrame(cb) {
    cb()
    requestAnimationFrame(() => nextFrame(cb));
}