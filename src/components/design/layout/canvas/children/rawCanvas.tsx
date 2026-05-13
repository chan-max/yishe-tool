import { updateRenderingCanvas, canvasStickerOptionsOnlyChild } from "../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeString, createFilterFromOptions, createTransformString, formatSizeOptionToPixelValue } from '../helper.tsx'
import { computed, defineComponent, onMounted, onUpdated, ref, watch } from "vue"
import { createBasicDefaultOptions, createFilterDefaultOptions, createPositionDefaultOptions, createTransformDefaultOptions } from "./defaultOptions.tsx"
import { useDebounceFn } from "@vueuse/core"
import { onBeforeReturnRender, onCanvasChildSetup } from "./commonHooks.ts"

export const createDefaultCanvasChildRawCanvasOptions = () => {

    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        type: 'rawCanvas',
        position: createPositionDefaultOptions(canvasUnit),
        width: {
            value: 100,
            unit: 'vw',
        },
        height: {
            value: 100,
            unit: 'vh',
        },
        filter: createFilterDefaultOptions(canvasUnit),
        zIndex: 0,
        ...createBasicDefaultOptions(),
        transform: createTransformDefaultOptions(canvasUnit),
        drawConfig: {
            type: 'empty',
            version: 0,
        },
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

        onCanvasChildSetup({
            targetEl: canvasRef,
            options: props.options,
            props,
        })

        const canvasPixelSize = computed(() => {
            const width = Math.max(1, Math.round(Number(formatSizeOptionToPixelValue(props.options.width)) || 1))
            const height = Math.max(1, Math.round(Number(formatSizeOptionToPixelValue(props.options.height)) || 1))
            return {
                width,
                height,
            }
        })

        const paint = useDebounceFn(function paint() {
            let context = canvasCtx.value
            if (!context) {
                return
            }

            const { width, height } = canvasPixelSize.value
            const canvas = context.canvas
            if (canvas.width !== width) {
                canvas.width = width
            }
            if (canvas.height !== height) {
                canvas.height = height
            }

            drawRawCanvas({
                canvas,
                context,
                options: props.options,
            })

            updateRenderingCanvas()
        })

        onMounted(paint)
        onUpdated(paint)
        watch(() => props.options, paint, { deep: true })

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

            onBeforeReturnRender({
                style,
                options: props.options
            })

            return <div style={containerStyle}>
                <canvas
                    ref={canvasRef}
                    style={style}
                    width={canvasPixelSize.value.width}
                    height={canvasPixelSize.value.height}
                    data-raw-canvas-type={props.options.drawConfig?.type || 'empty'}
                ></canvas>
            </div>
        }
    }
})


export function drawRawCanvas(payload: {
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    options: any,
}) {
    const { canvas, context, options } = payload
    context.clearRect(0, 0, canvas.width, canvas.height)

    const drawType = options?.drawConfig?.type || 'empty'
    if (drawType === 'empty') {
        return
    }
}
