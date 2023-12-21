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
    if (isFullscreen) {
        setFull()
    } else {
        exitFullScreen()
    }
}

export function setFull() {
    let doc: any = document.documentElement;
    if (doc.requestFullscreen) {
        doc.requestFullscreen();
    } else if (doc.mozRequestFullScreen) {
        doc.mozRequestFullScreen();
    } else if (doc.msRequestFullscreen) {
        doc.msRequestFullscreen();
    } else if (doc.webkitRequestFullscreen) {
        doc.webkitRequestFullScreen();
    }
}

export function exitFullScreen() {
    let doc = document as any
    if (!doc.fullscreenElement) {
        return;
    }
    if (doc.exitFullscreen) {
        doc.exitFullscreen();
    } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
    }
}