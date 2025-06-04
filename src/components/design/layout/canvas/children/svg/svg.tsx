import { VNode, ref, watchEffect } from 'vue'
import { canvasStickerOptions, canvasStickerOptionsOnlyChild, updateRenderingCanvas } from '../../index.tsx'
import { getPositionInfoFromOptions, formatToNativeSizeOption, formatToNativeSizeString, formatSizeOptionToPixelValue, } from '../../helper.tsx'
import { defineAsyncComponent, defineComponent } from 'vue';
import { svgToBase64 } from "@/common/transform/index";
import { renderToString } from '@vue/server-renderer';
import cssGradient2SVG from '@/common/transform/svg'
import { onCanvasChildSetup, onBeforeReturnRender } from '../commonHooks.ts';
import { createBasicDefaultOptions,createTransformDefaultOptions ,createFilterDefaultOptions} from '../defaultOptions.tsx'

/**
 * @description 所有的 svg 矢量元素视为同一种类型，并且其不存在复杂状态，
*/

export const createDefaultCanvasChildSvgOptions = () => {
    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit
    return {
        position: {
            center: true,
            verticalCenter: true,
            horizontalCenter: true,
            top: {
                value: 0,
                unit: canvasUnit
            },
            left: {
                value: 0,
                unit: canvasUnit
            },
            bottom: {
                value: 0,
                unit: canvasUnit
            },
            right: {
                value: 0,
                unit: canvasUnit
            }
        },
        width: {
            value: 100,
            unit: canvasUnit
        },
        height: {
            value: 100,
            unit: canvasUnit
        },
        transform: createTransformDefaultOptions(canvasUnit),
        filter: createFilterDefaultOptions(canvasUnit),
        ...createBasicDefaultOptions()
    }
}

/*
    辅助渲染所有支持的svg元素
*/
export const Svg = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const targetElRef = ref()

        onCanvasChildSetup({
            targetEl: targetElRef,
            options: props.options,
            props: props,
        })

        return () => {



            const {
                containerStyle: _containerStyle,
                style: _style
            } = getPositionInfoFromOptions(props.options.position)

            const containerStyle = {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                ..._containerStyle
            }

            let width = formatToNativeSizeString(props.options.width)
            let height = formatToNativeSizeString(props.options.height)

            const style = {
                width,
                height,
                flexShrink: 0,
                zIndex: props.options.zIndex,
                ..._style,
            }

            onBeforeReturnRender({
                style,
                containerStyle,
                options: props.options
            })

            return <div style={containerStyle}>
                {/* {props.options.svgUrl ? <img onLoad={updateRenderingCanvas} style={style} src={props.options.svgUrl}></img> : null} */}
                <svg ref={targetElRef} style={style}>  {ctx.slots.default && ctx.slots.default()}</svg>
            </div>
        }
    }
})



export function createCanvasChildSvg(options) {
    return <Svg options={options} onVnodeUpdated={updateRenderingCanvas} onVnodeMounted={updateRenderingCanvas}></Svg>
}

export const createDefaultCanvasChildSvgRectOptions = () => {

    let canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        backgroundColor: {
            color: '#fff',
            type: 'pure'
        },
        borderColor: {
            color: '#fff',
            type: 'pure'
        },
        borderWidth: {
            value: 0,
            unit: canvasUnit
        },
        borderRadius: {
            horizontal: {
                value: 0,
                unit: canvasUnit
            },
            vertical: {
                value: 0,
                unit: canvasUnit
            }
        },
        ...createDefaultCanvasChildSvgOptions()
    }
}

var uid = 0

type SvgGradientNode = {
    id: string,
    node: VNode
}

const svgGradientCache: Record<string, SvgGradientNode> = Object.create(null)

function createSvgGradientCache(colorOption) {
    let id = uid++
    let cache = {
        id: `url(#${id})`,
        node: cssGradient2SVG(colorOption.color, { id: id++, jsx: true }) as VNode
    }
    svgGradientCache[colorOption.color] = cache
    return cache
}

function getSvgGradientColorFromColorOption(colorOption) {
    if (colorOption.type == 'pure') {
        return colorOption.color
    }
    if (!svgGradientCache[colorOption.color]) {
        createSvgGradientCache(colorOption)
    }
    return svgGradientCache[colorOption.color].id
}

function getSvgGradientRenderFromColorOption(colorOption) {
    if (colorOption.type == 'pure') {
        return
    }
    if (!svgGradientCache[colorOption.color]) {
        createSvgGradientCache(colorOption)
    }
    return svgGradientCache[colorOption.color].node
}



/**
 * @define 矩形元素
*/
export function createCanvasChildRect(options) {

    let width = formatSizeOptionToPixelValue(options.width)
    let height = formatSizeOptionToPixelValue(options.height)

    // 像素单位
    const elementRealSize = {
        width: options.width,
        height: options.height
    }

    // 边框尺寸
    let borderWidth = formatSizeOptionToPixelValue(options.borderWidth, elementRealSize)


    const x = borderWidth / 2
    const y = borderWidth / 2

    const rx = formatSizeOptionToPixelValue(options.borderRadius.horizontal, elementRealSize)
    const ry = formatSizeOptionToPixelValue(options.borderRadius.vertical, elementRealSize)



    const rectWidth = width - borderWidth
    const rectHeight = height - borderWidth
    return <Svg options={options}>
        {getSvgGradientRenderFromColorOption(options.backgroundColor)}
        {getSvgGradientRenderFromColorOption(options.borderColor)}
        <rect width={rectWidth} height={rectHeight} rx={rx} ry={ry} x={x} y={y} fill={getSvgGradientColorFromColorOption(options.backgroundColor)} stroke={getSvgGradientColorFromColorOption(options.borderColor)} stroke-width={borderWidth} />
    </Svg>
}



/**
 * @define 椭圆
*/

export const createDefaultCanvasChildSvgEllipseOptions = () => {

    const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit

    return {
        backgroundColor: {
            color: '#fff',
            type: 'pure'
        },
        borderColor: {
            color: '#fff',
            type: 'pure'
        },
        borderWidth: {
            value: 0,
            unit: canvasUnit
        },
        width: {
            value: 100,
            unit: canvasUnit
        },
        height: {
            value: 100,
            unit: canvasUnit
        },
        ...createDefaultCanvasChildSvgOptions()
    }
}

export function createCanvasChildEllipse(options) {

    /*
    <ellipse
    cx="x-coordinate"      <!-- 椭圆中心点的 x 坐标 -->
    cy="y-coordinate"      <!-- 椭圆中心点的 y 坐标 -->
    rx="x-radius"          <!-- 椭圆水平的半径 -->
    ry="y-radius"          <!-- 椭圆垂直的半径 -->
    fill="fill-color"      <!-- 椭圆的填充颜色 -->
    stroke="stroke-color"  <!-- 椭圆的描边颜色 -->
    stroke-width="width"   <!-- 椭圆的描边宽度 -->
    />
*/

    let width = formatSizeOptionToPixelValue(options.width)
    let height = formatSizeOptionToPixelValue(options.height)



    let borderWidth = formatSizeOptionToPixelValue(options.borderWidth, {
        width: options.width,
        height: options.height,
    })

    const x = (width) / 2
    const y = (height) / 2

    const xRadius = (width - borderWidth) / 2
    const yRadius = (height - borderWidth) / 2

    return <Svg options={options}>
        {getSvgGradientRenderFromColorOption(options.backgroundColor)}
        {getSvgGradientRenderFromColorOption(options.borderColor)}
        <ellipse cx={x} cy={y} rx={xRadius} ry={yRadius} fill={getSvgGradientColorFromColorOption(options.backgroundColor)} stroke={getSvgGradientColorFromColorOption(options.borderColor)} stroke-width={borderWidth}></ellipse>
    </Svg>
}











