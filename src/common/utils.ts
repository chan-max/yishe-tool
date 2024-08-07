


function sleep(ms) {
    return new Promise((resolve, reject) => {
        return setTimeout(() => {
            resolve(void 0)
        }, ms);
    })
}


const CM2PX: number = (function () {
    var el = document.createElement('input');
    var body = document.body;
    el.setAttribute("style", "width:1cm !important;height:1cm !important;border-width:0px !important;padding:0px !important;margin:0px !important;");
    el.id = "id_" + new Date().getTime();
    el.type = "hidden";
    body.appendChild(el);
    var targetEle = document.getElementById(el.id);
    return Number(window.getComputedStyle(targetEle).width.match(/^\d+\.?\d*/)[0]);
}());


const isPromise = (val) => {
    return val.catch && val.then;
};


export function formatUrl(url) {
    if (!url) {
        return
    }
    url = url.trim();
    return url.startsWith('http') ? url : 'https://' + url;
}




/*
    去除imageData的多余空白
*/
function trimImageData(imageData): ImageData {
    const { width, height, data } = imageData;
    let minX = width, minY = height, maxX = 0, maxY = 0;

    // 查找边界
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const alpha = data[index + 3];

            if (alpha !== 0) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    // 计算新的尺寸
    const trimmedWidth = maxX - minX + 1;
    const trimmedHeight = maxY - minY + 1;

    // 创建新的 ImageData
    const trimmedData = new ImageData(trimmedWidth, trimmedHeight);

    // 复制相关像素数据
    for (let y = 0; y < trimmedHeight; y++) {
        for (let x = 0; x < trimmedWidth; x++) {
            const sourceIndex = ((minY + y) * width + (minX + x)) * 4;
            const targetIndex = (y * trimmedWidth + x) * 4;

            trimmedData.data[targetIndex] = data[sourceIndex];
            trimmedData.data[targetIndex + 1] = data[sourceIndex + 1];
            trimmedData.data[targetIndex + 2] = data[sourceIndex + 2];
            trimmedData.data[targetIndex + 3] = data[sourceIndex + 3];
        }
    }

    return trimmedData;
}


function isEmptyObject(val) {
    return typeof val === 'object' && JSON.stringify(val) == '{}'
}

import { deepUnref } from './vue'


import logger from './logger'
import { Type } from './type'

class Utils {

    IN2CM = 2.539999918

    CM2PX = CM2PX //  1厘米等于多少像素

    sleep = sleep

    formatUrl = formatUrl

    isPromise = isPromise


    isEmptyObject = isEmptyObject

    // 单位转换
    pxToCM(px) {
        return px / this.CM2PX
    }

    pxToMM(px) {
        return px / this.CM2PX * 10
    }

    pxToIn(px) {
        return px / this.CM2PX / this.IN2CM
    }


    getComputedWidth(el) {

        if (!(el instanceof HTMLElement)) {
            return 0
        }

        return Number(window.getComputedStyle(el).width.split('px')[0])
    }

    getComputedHeight(el) {

        if (!(el instanceof HTMLElement)) {
            return 0
        }

        return Number(window.getComputedStyle(el).height.split('px')[0])
    }


    // 去除imageData的空白
    trimImageData = trimImageData



    // 深层解构
    deepUnref = deepUnref


    // 日志打印
    logger = logger

    type = new Type()
}


let utils = new Utils()

window.utils = utils

export default utils
