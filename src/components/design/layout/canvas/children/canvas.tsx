import { defineComponent } from 'vue'
import { canvasOptions, calcCanvasDisplayTransformScale } from '@/components/design/layout/canvas/'

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
            const containerStyle: any = {
                width: canvasOptions.value.width + 'px',
                height: canvasOptions.value.height + 'px',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transform: calcCanvasDisplayTransformScale(props.maxDisplaySize),
                flexShrink: 0,
                position: "relative",
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
            <div id={'canvas-raw-el'} style={style}>
                {ctx.slots.default()}
            </div>
            {/* 真实的画布 */}
            <canvas id={'canvas-display-el'} class="png-background" style={canvasStyle} width={canvasOptions.value.width} height={canvasOptions.value.height}></canvas>
        </div>
        }
    }
})