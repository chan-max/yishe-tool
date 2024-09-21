import { canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'
import { formatSizeOptionToPixelValue } from '../../../helper'

import { SvgFilterEffects } from '..'


export function createFeGaussianBlurDefaultOptions() {
    let unit = canvasStickerOptions.value.unit
    return {
        type: SvgFilterEffects.GAUSSIAN_BLUR,
        stdDeviationX: {
            value: 1,
            unit: unit
        },
        stdDeviationY: {
            value: 1,
            unit: unit
        },
    }
}

export function createFeGaussianBlur(options) {
    const stdDeviationX = formatSizeOptionToPixelValue(options.stdDeviationX)
    const stdDeviationY = formatSizeOptionToPixelValue(options.stdDeviationY)
    return <feGaussianBlur in="SourceGraphic" stdDeviation={`${stdDeviationX} ${stdDeviationY}`} edgeMode="duplicate"></feGaussianBlur>
}