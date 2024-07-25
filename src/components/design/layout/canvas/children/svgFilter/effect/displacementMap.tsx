import { canvasStickerOptions, currentOperatingCanvasChildIndex } from '@/components/design/layout/canvas/index.tsx'
import { formatSizeOptionToPixelValue } from '../../../helper'

import { SvgFilterEffects } from '..'



enum ChannelSelector {
    R = 'R',
    G = 'G',
    B = 'B',
    A = 'A'
}

export function createFeDisplacementMapDefaultOptions() {
    return {
        type: SvgFilterEffects.DISPLACEMENT_MAP,
        in: '',
        in2: '',
        scale: 1,
        xChannelSelector: ChannelSelector.R,
        yChannelSelector: ChannelSelector.R,
        result: ''
    }
}


export function createFeDisplacementMap(options) {
    <feDisplacementMap in={options.in} in2={options.in2} scale={options.scale} xChannelSelector={options.xChannelSelector} yChannelSelector={options.yChannelSelector} result={options.result} />
}

