import { canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'
import { formatSizeOptionToPixelValue } from '../../../helper'

import { SvgFilterEffects } from '..'



export enum FeCompositeOperator {
    Over = 'over',       // 默认值。将第一个输入图像（in）放在第二个输入图像（in2）的上面。
    In = 'in',           // 显示第一个输入图像（in）在第二个输入图像（in2）内部的部分。常用于裁剪效果。
    Out = 'out',         // 显示第一个输入图像（in）在第二个输入图像（in2）外部的部分。可用于创建镂空效果。
    Atop = 'atop',       // 将第一个输入图像（in）放在第二个输入图像（in2）上面，但只在第二个图像的区域内显示。
    Xor = 'xor',         // 显示第一个输入图像（in）和第二个输入图像（in2）不重叠的部分。
    Lighter = 'lighter', // 显示两个输入图像的总和。颜色值相加，超过最大值时取最大值。
    Arithmetic = 'arithmetic' // 使用公式 result = k1*i1*i2 + k2*i1 + k3*i2 + k4 来组合图像。需要额外的 k1, k2, k3, k4 属性来定
}

export function createFeCompositeDefaultOptions() {
    let unit = canvasStickerOptions.value.unit
    return {
        type: SvgFilterEffects.COMPOSITE,
        x: {
            value: 0,
            unit: unit
        },
        y: {
            value: 0,
            unit: unit
        },
        width: {
            value: 0,
            unit: unit
        },
        height: {
            value: 0,
            unit: unit
        },
        in: null,
        in2: null,
        operator:null,
    }
}


export function createFeComposite(options) {

    let x = formatSizeOptionToPixelValue(options.x)
    let y = formatSizeOptionToPixelValue(options.y)
    let width = formatSizeOptionToPixelValue(options.width)
    let height = formatSizeOptionToPixelValue(options.height)
    return <feComposite x={x} y={y} width={width} height={height} in={options.in} in2={options.in2} operator={options.operator}/>
}

