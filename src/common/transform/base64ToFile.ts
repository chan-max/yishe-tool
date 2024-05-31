
const svgContentType = 'image/svg+xml;charset=utf-8'

const pngContentType = 'image/png'

export function base64ToSvgFile(base64){
    return base64ToFile(base64,(new Date().getTime()) + '.svg',svgContentType)
}

export function base64ToPngFile(base64){
    return base64ToFile(base64,(new Date().getTime()) + '.png',pngContentType)
}

export function base64ToFile(base64Data, tempfilename = (new Date().getTime()) + '.png', contentType = pngContentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    base64Data = base64Data.split(',')[1]
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new File(byteArrays, tempfilename, { type: contentType });
}