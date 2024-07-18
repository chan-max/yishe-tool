
import { canvasOptions } from "../index"

export const createFilterDefaultOptions = (blurUnit = 'px') => {
    return {
        filterBlur: {
            value: 0,
            unit: blurUnit
        },
        filterBrightness: 100, // 亮度百分比，默认为100 ，正常
        filterContrast: 100, // 对比度
        filterGrayscale: 0, // 灰度
        filterHueRotate: 0, // 色相旋转
        filterInvert: 0, // 反转输入
        filterOpacity: 100, // 透明度
        filterSaturate: 100, // 饱和度
        filterSepia: 0, // 褐色
        filterUrl:''
    }
}