import { canvasStickerOptions, canvasStickerOptionsOnlyChild } from '@/components/design/layout/canvas/index.tsx'
import { formatSizeOptionToPixelValue } from '../../../helper'

import { SvgFilterEffects } from '..'


export function createFeFloodDefaultOptions(options = {}) {
    let unit = canvasStickerOptionsOnlyChild.value.width.unit
    return {
        x: {
            value: 1,
            unit: unit
        },
        y: {
            value: 1,
            unit: unit
        },
        width: {
            value: 1,
            unit: unit
        },
        height: {
            value: 1,
            unit: unit
        },
        type: SvgFilterEffects.FLOOD,
        floodColor: {
            type: 'pure',
            color: "#000000",
        },
        floodOpacity: 1,
        ...options
    }
}

export function createFeFlood(options) {

    let x = formatSizeOptionToPixelValue(options.x)
    let y = formatSizeOptionToPixelValue(options.y)
    let width = formatSizeOptionToPixelValue(options.width)
    let height = formatSizeOptionToPixelValue(options.height)

    return <feFlood x={x} y={y} width={width} height={height} flood-color={options.floodColor.color} flood-opacity={options.floodOpacity}></feFlood>
}