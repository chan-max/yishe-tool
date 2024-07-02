import { defineComponent } from 'vue'
import { canvasOptions, calcCanvasDisplayTransformScale,calcCanvasDisplayTransformScaleValue ,currentCanvasControllerInstance} from '@/components/design/layout/canvas'


/*
    用于辅助观察的网格背景
*/
function createPngBackgroundStyle(scale = 1) {
    /* 模拟png背景 */
    // .png-background {
    //     background: #fff!important;
    //     background-image: linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0), linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0)!important;
    //     background-position: 0 0, 10px 10px!important;
    //     background-size: 20px 20px!important;
    //   }

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

            let transform = calcCanvasDisplayTransformScale(props.maxDisplaySize)
            let transformValue = calcCanvasDisplayTransformScaleValue(props.maxDisplaySize)
    
            let pngBackground = createPngBackgroundStyle(transformValue)
    
            const containerStyle: any = {
                width: canvasOptions.value.width + 'px',
                height: canvasOptions.value.height + 'px',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transform,
                flexShrink: 0,
                position: "relative",
                ...pngBackground
            }

            let style: any = {
                flexShrink: 0,
                width: canvasOptions.value.width + 'px',
                height: canvasOptions.value.height + 'px',
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
                {/* 转换的元素 */}
                <div id={currentCanvasControllerInstance.value.rawId} style={style}>
                    {ctx.slots.default()}
                </div>
                {/* 真实的画布 */}
                <canvas id={currentCanvasControllerInstance.value.canvasId} style={canvasStyle} width={canvasOptions.value.width} height={canvasOptions.value.height}></canvas>
            </div>
        }
    }
})