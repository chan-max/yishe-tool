import { canvasStickerOptions, currentOperatingCanvasChildIndex } from '@/components/design/layout/canvas/index.tsx'
import { formatSizeOptionToPixelValue } from '../../../helper'

import { SvgFilterEffects } from '..'


export function createFeFloodDefaultOptions() {
    let unit = canvasStickerOptions.value.unit
    return {
        type: SvgFilterEffects.FLOOD,
        floodColor: {
            type: 'pure',
            color: "#ff0000",
        },
        floodOpacity: 1,
    }
}

export function createFeFlood(options) {
    return <feFlood x="0%" y="0%" width="100%" height="100%" flood-color={options.floodColor.color} flood-opacity={options.floodOpacity}></feFlood>
}