/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-26 11:13:28
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-17 00:27:44
 * @FilePath: /1s/src/common/browser.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */


export function setFullscreen(isFullscreen: boolean): void {
    let doc:any = document.documentElement;
        if (isFullscreen) {
            if(doc.requestFullscreen) {
                doc.requestFullscreen();
            }
        } else {
                document.exitFullscreen();
        }
}