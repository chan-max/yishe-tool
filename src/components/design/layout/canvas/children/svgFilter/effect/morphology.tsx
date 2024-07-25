import { canvasStickerOptions, currentOperatingCanvasChildIndex } from '@/components/design/layout/canvas/index.tsx'
import { formatSizeOptionToPixelValue } from '../../../helper'
import { SvgFilterEffects } from '..'


export function createFeMorphologyDefaultOptions() {
    let unit = canvasStickerOptions.value.unit
    return {
        type: SvgFilterEffects.MORPHOLOGY,
        radiusX: {
            value: 1,
            unit: unit
        },
        radiusY: {
            value: 1,
            unit: unit
        },
        operator: FeMorphologyOperator.ERODE
    }
}



export enum FeMorphologyOperator {
    ERODE = 'erode', // 侵蚀
    DILATE = 'dilate', // 膨胀
}


export const FeMorphologyOperatorOptions = [
    {
        label: '侵蚀效果',
        value: FeMorphologyOperator.ERODE
    },
    {
        label: '膨胀效果',
        value: FeMorphologyOperator.DILATE
    },
]


export function createFeMorphology(options) {

    let radiusX = formatSizeOptionToPixelValue(options.radiusX)
    let radiusY = formatSizeOptionToPixelValue(options.radiusY)
    return <feMorphology operator={options.operator} radius={`${radiusX} ${radiusY}`} result={options.result} />
}