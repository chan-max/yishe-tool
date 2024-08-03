import { canvasStickerOptions, currentCanvasControllerInstance, updateRenderingCanvas, CanvasChildType } from "../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeString, createFilterFromOptions, createTransformString, formatSizeOptionToPixelValue } from '../helper.tsx'
import { computed, defineComponent, onMounted, onUpdated, ref } from "vue"
import { createFilterDefaultOptions, createPositionDefaultOptions, createTransformDefaultOptions } from "./defaultOptions.tsx"
import Utils from '@/common/utils'

export const createDefaultCanvasChildRawCanvasOptions = () => {

    const canvasUnit = canvasStickerOptions.value.unit

    return {
        type: CanvasChildType.ROW_CANVAS,
        position: createPositionDefaultOptions(canvasUnit),
        width: {
            value: 100,
            unit: 'vw',
        },
        height: {
            value: 100,
            unit: 'vh',
        },
        transform: createTransformDefaultOptions(canvasUnit),
        filter: createFilterDefaultOptions(canvasUnit),
        zIndex: 0,
    }
}



export function createCanvasChildRawCanvas(options) {
    return <RawCanvas options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></RawCanvas>
}

export const RawCanvas = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const canvasRef = ref()
        const canvasCtx = computed(() => {
            return canvasRef.value?.getContext('2d')
        })

        onUpdated(() => {
            props.options.targetComputedWidth = Utils.getComputedWidth(canvasRef.value)
            props.options.targetComputedHeight = Utils.getComputedHeight(canvasRef.value)
        })

        onMounted(paint)
        onUpdated(paint)

        function paint() {

            const width = formatSizeOptionToPixelValue(props.options.width)
            const height = formatSizeOptionToPixelValue(props.options.width)



            let context = canvasCtx.value
            if (!context) {
                return
            }
            context.fillStyle = "#FF0000";
            context.fillRect(0, 0, width / 2, height / 2);
        }



        return () => {

            const {
                containerStyle: _containerStyle,
                style: _style
            } = getPositionInfoFromOptions(props.options.position)


            var containerStyle: any = {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: props.options.zIndex,
                ..._containerStyle
            }



            var style: any = {
                flexShrink: 0,
                transform: createTransformString(props.options.transform),
                width: formatToNativeSizeString(props.options.width),
                height: formatToNativeSizeString(props.options.height),
                filter: createFilterFromOptions(props.options.filter),
                zIndex: props.options.zIndex,
                ..._style,
            }

            const width = formatSizeOptionToPixelValue(props.options.width)
            const height = formatSizeOptionToPixelValue(props.options.height)

            console.log(width, height)

            return <div style={containerStyle}>
                <canvas ref={canvasRef} style={style} width={width} height={height}></canvas>
            </div>
        }
    }
})




