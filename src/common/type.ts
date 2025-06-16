/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-22 06:30:10
 * @FilePath: /1s/src/common/type.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */



const fontSuffix = ['eot', 'otf', 'ttf', 'woff', 'woff2'];

const imageSuffix = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

function isFontName(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return false;
    const extension = fileName.slice(lastDotIndex + 1).toLowerCase();
    return fontSuffix.includes(extension);
}

function isPsd(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return false;
    const extension = fileName.slice(lastDotIndex + 1).toLowerCase();
    return extension === 'psd';
}

function isImageName(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return false;
    const extension = fileName.slice(lastDotIndex + 1).toLowerCase();
    return imageSuffix.includes(extension);
}


const modelSuffix = ['glb']
function isModelName(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return false;
    const extension = fileName.slice(lastDotIndex + 1).toLowerCase();
    return modelSuffix.includes(extension);
}



const imageFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/tiff',
    'image/bmp',
    'image/svg+xml',
    'image/webp',
    'image/heif',
    'image/avif'
];

const fontFileTypes = [
    'font/ttf',
    'font/otf',
    'font/woff',
    'font/woff2',
    'application/vnd.ms-fontobject', // EOT
    'font/svg'
];

function isImageFileType(type){
    return imageFileTypes.includes(type.toLowerCase());
}   

function isFontFileType(type){
    return fontFileTypes.includes(type.toLowerCase());
}


export class Type {
    isFontName = isFontName
    isImageName = isImageName
    isModelName = isModelName
    modelSuffix = modelSuffix

    isImageFileType = isImageFileType
    isFontFileType = isFontFileType

    isPsd = isPsd
}




