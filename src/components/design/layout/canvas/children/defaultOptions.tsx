
import { canvasStickerOptions } from "../index"

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
        filterUrl: null
    }
}


export const createTransformDefaultOptions = (translateUnit = 'px') => {
    return {
        translateX: {
            unit: translateUnit,
            value: 0,
        },
        translateY: {
            unit: translateUnit,
            value: 0,
        },
        translateZ: {
            unit: translateUnit,
            value: 0,
        },
        perspective: {
            unit: translateUnit,
            value: 0,
        },
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        skewX: 0,
        skewY: 0,
    }
}


export const createPositionDefaultOptions = (unit = 'px') => {
    return {
        center: true,
        verticalCenter: true,
        horizontalCenter: true,
        top: {
            value: 0,
            unit: unit
        },
        left: {
            value: 0,
            unit: unit
        },
        bottom: {
            value: 0,
            unit: unit
        },
        right: {
            value: 0,
            unit: unit
        }
    }
}

