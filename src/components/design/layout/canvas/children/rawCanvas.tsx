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
            type: 'test',
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
    if (drawType !== 'test') {
        return
    }

    drawTestCanvas(context, canvas.width, canvas.height)
}

function drawTestCanvas(context: CanvasRenderingContext2D, width: number, height: number) {
    const gridSize = Math.max(16, Math.round(Math.min(width, height) / 8))

    context.save()

    context.fillStyle = 'rgba(255, 255, 255, 0.72)'
    context.fillRect(0, 0, width, height)

    for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
            context.fillStyle = ((x / gridSize + y / gridSize) % 2 === 0)
                ? 'rgba(0, 176, 255, 0.32)'
                : 'rgba(255, 64, 129, 0.24)'
            context.fillRect(x, y, gridSize, gridSize)
        }
    }

    context.strokeStyle = 'rgba(0, 0, 0, 0.62)'
    context.lineWidth = Math.max(2, Math.round(Math.min(width, height) / 80))
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(width, height)
    context.moveTo(width, 0)
    context.lineTo(0, height)
    context.stroke()

    const radius = Math.max(8, Math.min(width, height) * 0.16)
    const gradient = context.createRadialGradient(
        width / 2,
        height / 2,
        radius * 0.2,
        width / 2,
        height / 2,
        radius,
    )
    gradient.addColorStop(0, 'rgba(255, 214, 0, 0.95)')
    gradient.addColorStop(1, 'rgba(255, 112, 67, 0.82)')
    context.fillStyle = gradient
    context.beginPath()
    context.arc(width / 2, height / 2, radius, 0, Math.PI * 2)
    context.fill()

    context.fillStyle = 'rgba(0, 0, 0, 0.76)'
    context.font = `${Math.max(12, Math.round(Math.min(width, height) / 12))}px sans-serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('CANVAS', width / 2, height / 2)

    context.restore()
}
