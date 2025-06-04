/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-06-04 20:30:59
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-04 21:07:35
 * @FilePath: /1s/src/components/design/layout/canvas/children/defaultOptions.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { canvasStickerOptions } from "../index"


export const createBasicDefaultOptions = () => {
    return {
        transform: createTransformDefaultOptions(),
        // 用于统计当前元素的宽高，供其他功能使用
        targetComputedWidth: null,
        targetComputedHeight: null,
    }
}

export const createFilterDefaultOptions = (blurUnit = 'px') => {
    return {
        // 一些过滤效果 , 貌似只有这个需要单位
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
        filterUrl: {
            isCompositeFilter: false,         ///是否为复合滤镜
            filterId: '', // 使用的滤镜名称
            filterChildren: [], // 复合滤镜时使用的滤镜名称 ， 对于复合滤镜 采用 字符串拼接作为复合滤镜名称
        }
    }
}


export const createClipPathDefaultOptions = () => {
    return {
        
    }
}


export const createTransformDefaultOptions = (translateUnit = 'px') => {
    return {
        // 只有平移需要单位
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

