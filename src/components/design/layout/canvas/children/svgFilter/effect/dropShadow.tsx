import { canvasStickerOptions, canvasStickerOptionsOnlyChild } from '@/components/design/layout/canvas/index.tsx'
import { formatSizeOptionToPixelValue } from '../../../helper'

import { SvgFilterEffects } from '..'


export function createFeDropShadowDefaultOptions() {
    let unit = canvasStickerOptionsOnlyChild.value.width.unit
    return {
        type: SvgFilterEffects.DROP_SHADOW,
        dx: {
            value: 1,
            unit: unit
        },
        dy: {
            value: 1,
            unit: unit
        },
        stdDeviationX: {
            value: 1,
            unit: unit
        },
        stdDeviationY: {
            value: 1,
            unit: unit
        },
        floodColor: {
            type: 'pure',
            color: "#ff0000",
        },
        floodOpacity: 1,
    }
}

export function createFeDropShadow(options) {
    const dx = formatSizeOptionToPixelValue(options.dx)
    const dy = formatSizeOptionToPixelValue(options.dy)
    const stdDeviationX = formatSizeOptionToPixelValue(options.stdDeviationX)
    const stdDeviationY = formatSizeOptionToPixelValue(options.stdDeviationY)
    return <feDropShadow dx={dx} dy={dy} stdDeviation={`${stdDeviationX} ${stdDeviationY}`} flood-color={options.floodColor.color} flood-opacity={options.floodOpacity}></feDropShadow>
}