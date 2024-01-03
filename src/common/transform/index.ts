

export const imgElementToFile = (img: HTMLImageElement) => {
    if (!img.complete) {
        return null
    }
}

export function imgToBase64(img) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/png');
}

