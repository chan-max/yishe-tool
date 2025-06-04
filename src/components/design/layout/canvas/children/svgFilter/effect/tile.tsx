import { canvasStickerOptions, canvasStickerOptionsOnlyChild } from '@/components/design/layout/canvas/index.tsx'
import { formatSizeOptionToPixelValue } from '../../../helper'

import { SvgFilterEffects } from '..'


export function createFeTileDefaultOptions(options = {}) {
    let unit = canvasStickerOptionsOnlyChild.value.width.unit
    return {
        x: {
            value: 0,
            unit: unit
        },
        y: {
            value: 0,
            unit: unit
        },
        type: SvgFilterEffects.Tile,
        result: null,
    }
}

export function createFeTile(options) {

    let x = formatSizeOptionToPixelValue(options.x)
    let y = formatSizeOptionToPixelValue(options.y)
    let width = formatSizeOptionToPixelValue(options.width)
    let height = formatSizeOptionToPixelValue(options.height)

    return <feTile x={x} y={y} width={width} height={height} result={options.result}></feTile>
}