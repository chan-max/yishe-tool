import { defineComponent } from 'vue'
import { canvasOptions, currentCanvasControllerInstance, showMainCanvas } from '@/components/design/layout/canvas'
import { formatSizeOptionToPixelValue } from '../helper'

import { SvgFilter } from './svgFilter/index.tsx'

/*
    用于辅助观察的网格背景
*/
function createPngBackgroundStyle(scale = 1) {
    /* 模拟png背景 */
    var size = 10 / scale
    return {
        background: '#fff!important',
        backgroundImage: `linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0), linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0)!important`,
        backgroundPosition: `0 0, ${size}px ${size}px!important`,
        backgroundSize: `${2 * size}px ${2 * size}px!important`,
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
                value: canvasOptions.value.width,
                unit: canvasOptions.value.unit
            })

            const pxHeight = formatSizeOptionToPixelValue({
                value: canvasOptions.value.height,
                unit: canvasOptions.value.unit
            })


            const transformValue = (canvasOptions.value.showCanvasRealSize && showMainCanvas.value) ? 1 : (props.maxDisplaySize / Math.max(pxWidth, pxHeight))



            let pngBackground = createPngBackgroundStyle(transformValue)

            const containerStyle: any = {
                width: canvasOptions.value.width + canvasOptions.value.unit,
                height: canvasOptions.value.height + canvasOptions.value.unit,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transform: `scale(${transformValue}, ${transformValue})`,
                flexShrink: 0,
                position: "relative",
                ...pngBackground
            }

            let style: any = {
                flexShrink: 0,
                width: canvasOptions.value.width + canvasOptions.value.unit,
                height: canvasOptions.value.height + canvasOptions.value.unit,
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0
            }

            const canvasStyle: any = {
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 99,
                display: 'none'
            }

            return <div style={containerStyle}>
                {/* svg过滤器 */}
                <SvgFilter></SvgFilter>
                {/* 转换的元素 */}
                <div id={currentCanvasControllerInstance.value.rawId} style={style}>
                    {ctx.slots.default()}
                </div>
                {/* 真实的画布 */}
                <canvas id={currentCanvasControllerInstance.value.canvasId} style={canvasStyle} width={pxWidth} height={pxHeight}></canvas>
            </div>
        }
    }
})