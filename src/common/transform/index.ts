import { base64ToFile } from "./base64ToFile";

export function imgToBase64(img) {
    img.setAttribute('crossorigin', 'anonymous');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    ctx.drawImage(img, 0, 0);
    var base64 = canvas.toDataURL('image/png')
    return base64 ;
}

export const imgToFile = (img) => {
    return base64ToFile(imgToBase64(img))
}

export const createImgObjectURL = (img) => {
    return URL.createObjectURL(imgToFile(img))
}


export const canvasToBase64 = (canvas) => canvas.toDataURL("image/png")


/*
 下载base64为文件
*/
export async function downloadByFile(file){
    let a = document.createElement('a')
    a.href = URL.createObjectURL(file)
    a.download = file.name
    a.click()
}

export function svgToBase64(svg) {
    if(typeof svg == 'string'){
        svg = svg
    }

    if(svg instanceof SVGElement){
        svg = new XMLSerializer().serializeToString(svg)
    }

    var base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
}

import {base64ToSvgFile ,base64ToPngFile} from './base64ToFile'


/* svg元素或字符串转文件格式 */
export function svgToFile(svg){
    const svgBase64 = svgToBase64(svg)
    const file = base64ToSvgFile(svgBase64)
    return file
}



/* svg元素或字符串转png文件 */
export  function svgToPngFile(svg){
    /*
        svg线渲染到img上，在添加到canvas，然后导出png文件
    */
    const svgBase64 = svgToBase64(svg)  
    let img = document.createElement('img')
    img.src = svgBase64
    return imgToFile(img)
}
