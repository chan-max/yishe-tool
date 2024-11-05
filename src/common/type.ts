


const fontSuffix = ['eot', 'otf', 'ttf', 'woff', 'woff2'];

const imageSuffix = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

function isFontName(fileName) {
    const [name, extension] = fileName.split('.');

    return fontSuffix.includes(extension.toLowerCase());
}

function isImageName(fileName) {

    let suffix = fileName.slice(fileName.lastIndexOf('.'))

    let extension = suffix.slice(1)

    return imageSuffix.includes(extension.toLowerCase());
}


const modelSuffix = ['glb']
function isModelName(fileName) {

    const [name, extension] = fileName.split('.');

    return modelSuffix.includes(extension.toLowerCase());
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
}




