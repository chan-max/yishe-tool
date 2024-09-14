import randomColor from 'randomcolor'
import ColorThief from 'colorthief'

const colorThief = new ColorThief();




const getColor = (img) => new Promise((resolve, reject) => {
    if (img.complete) {
        let color = colorThief.getColor(img);
        resolve(color);
    } else {
        img.addEventListener('load', function () {
            let color = colorThief.getColor(img);
            resolve(color);
        });
    }
})


const getPalette = (img) => new Promise((resolve, reject) => {
    if (img.complete) {
        let color = colorThief.getPalette(img);
        resolve(color);
    } else {
        img.addEventListener('load', function () {
            let color = colorThief.getPalette(img);
            resolve(color);
        });
    }
})

export class Color {


    // 随机颜色
    randomColor = randomColor

    // 获取图片主题色
    getColor = getColor

    // 获取调色板
    getPalette = getPalette
}