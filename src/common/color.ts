import randomColor from 'randomcolor'
import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'






const colorThief = new ColorThief();


async function getColor(img) {
    if (img.complete) {
        colorThief.getColor(img);
    } else {
        img.addEventListener('load', function () {
            colorThief.getColor(img);
        });
    }
}


export class Color {


    // 随机颜色
    randomColor = randomColor

    // 获取图片主题色
    getColor = getColor
}