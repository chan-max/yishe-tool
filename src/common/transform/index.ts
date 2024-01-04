import { base64ToFile } from "./base64ToFile";

export const imgElementToFile = (img: HTMLImageElement) => {
    if (!img.complete) {
        return null
    }
}

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


