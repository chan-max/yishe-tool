import { defineComponent } from 'vue'
import { canvasStickerOptions, currentCanvasControllerInstance, showMainCanvas } from '@/components/design/layout/canvas'
import { createFilterFromOptions, formatSizeOptionToPixelValue, } from '../helper'
import { createFilterDefaultOptions } from './defaultOptions.tsx'
import { SvgFilter } from './svgFilter/index.tsx'

/*
    用于辅助观察的网格背景
*/
export function createPngBackgroundStyle(scale = 1, cellWidth = 10) {
    /* 模拟png背景 */
    var size = cellWidth / scale
    return {
        background: '#fff!important',
        backgroundImage: `linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0), linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0)!important`,
        backgroundPosition: `0 0, ${size}px ${size}px!important`,
        backgroundSize: `${2 * size}px ${2 * size}px!important`,
    }
}

export function createDefaultCanvasChildcanvasStickerOptions() {
    return {
        type: 'canvas',
        undeletable: true, // 不可删除
        ...createFilterDefaultOptions('px'),
        backgroundColor: {
            color: 'rgba(0,0,0,0)'
        },
    }
}



export const Canvas = defineComponent({
    props: {
        options: null,
        maxDisplaySize: {
            // 最大显示尺寸
            default: 320
        }
    },
    setup(props, ctx) {

        return () => {

            const pxWidth = formatSizeOptionToPixelValue({
                value: canvasStickerOptions.value.width,
                unit: canvasStickerOptions.value.unit
            })

            const pxHeight = formatSizeOptionToPixelValue({
                value: canvasStickerOptions.value.height,
                unit: canvasStickerOptions.value.unit
            })


            const transformValue = (canvasStickerOptions.value.showCanvasRealSize && showMainCanvas.value) ? 1 : (props.maxDisplaySize / Math.max(pxWidth, pxHeight))

            let pngBackground = createPngBackgroundStyle(transformValue)

            // 画布的辅助背景
            const containerStyle: any = {
                width: canvasStickerOptions.value.width + canvasStickerOptions.value.unit,
                height: canvasStickerOptions.value.height + canvasStickerOptions.value.unit,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transform: `scale(${transformValue}, ${transformValue})`,
                flexShrink: 0,
                position: "relative",
                ...pngBackground,
                // background: canvasStickerOptions.value.supportBackgroundColor.color
            }

            // 画布真实元素背景
            let style: any = {
                flexShrink: 0,
                width: canvasStickerOptions.value.width + canvasStickerOptions.value.unit,
                height: canvasStickerOptions.value.height + canvasStickerOptions.value.unit,
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
                // filter: createFilterFromOptions(props.options),
                filter:'url(#example)',
                background: props.options.backgroundColor.color,
            }

            const canvasStyle: any = {
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 99,
                display: 'none',
            }

            return <div style={containerStyle}>
                {/* svg过滤器 */}
                <SvgFilter></SvgFilter>
                {/* 转换的元素 */}

                <div  id={currentCanvasControllerInstance.value?.rawId} style={style}>
                    {ctx.slots.default()}
                </div>


                {/* 真实的画布 */}
                <canvas id={currentCanvasControllerInstance.value.canvasId} style={canvasStyle} width={pxWidth} height={pxHeight}></canvas>
            </div>
        }
    }
})