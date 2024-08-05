
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";


export function imgToBase64(img) {
    img.setAttribute('crossorigin', 'anonymous');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    ctx.drawImage(img, 0, 0);
    var base64 = canvas.toDataURL('image/png')
    return base64;
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
export async function downloadByFile(file) {
    let a = document.createElement('a')
    a.href = URL.createObjectURL(file)
    a.download = file.name
    a.click()
}

export function svgToBase64(svg) {

    if (typeof svg == 'string') {
        svg = svg
    }

    if (svg instanceof SVGElement) {
        svg = new XMLSerializer().serializeToString(svg)
    }

    if (svg.__v_isVNode) {

    }

    var base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
}

import { base64ToSvgFile, base64ToPngFile, base64ToFile } from './base64ToFile'


/* svg元素或字符串转文件格式 */
export function svgToFile(svg) {
    const svgBase64 = svgToBase64(svg)
    const file = base64ToSvgFile(svgBase64)
    return file
}


/* svg元素或字符串转png文件 */
export async function svgToPngFile(svg) {
    /*
        svg线渲染到img上，在添加到canvas，然后导出png文件
    */
    const svgBase64 = svgToBase64(svg)
    let img = document.createElement('img')
    // img.style.display = 'none'
    document.body.appendChild(img)
    img.src = svgBase64

    return new Promise((resolve) => {
        img.onload = () => {
            document.body.removeChild(img)
            return resolve(imgToFile(img))
        }
    })
}


/*
 元素转png文件
*/
export async function htmlToPngFile(html) {
    const b6 = await toPng(html)
    return base64ToPngFile(b6)
}



export const imageDataToFile = (imageData) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;


    const ctx = canvas.getContext('2d');

    ctx.putImageData(imageData, 0, 0);


    const dataURL = canvas.toDataURL('image/png');

    return base64ToPngFile(dataURL)
}