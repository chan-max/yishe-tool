

import { VNode, ref, watchEffect } from 'vue'
import { updateCanvas } from '../../index.tsx'

import { getPositionInfoFromOptions, getRelativeRealPixelSize, getRelativeRealPixelValue, getPaddingRealPixel, getBorderRadiusRealPixel } from '../../helper.tsx'
import { defineAsyncComponent, defineComponent } from 'vue';
import { svgToBase64 } from "@/common/transform/index";
import { renderToString } from '@vue/server-renderer';
import cssGradient2SVG from '@/common/transform/svg'
import { id } from 'element-plus/es/locale/index';
/*
    矩形
    圆形和椭圆边框
    星星 
    svg 使用img表现
*/


function isGradientColor(color) {
    return typeof color == 'string' ? color.includes('gradient') : color.colorType == 'gradient'
}


export const defaultCanvasChildSvgOptions = {
    position: {
        center: true,
        verticalCenter: true,
        horizontalCenter: true,
        top: {
            value: 0,
            unit: 'px'
        },
        left: {
            value: 0,
            unit: 'px'
        },
        bottom: {
            value: 0,
            unit: 'px'
        },
        right: {
            value: 0,
            unit: 'px'
        }
    },
    padding: {
        top: {
            value: 0,
            unit: 'px'
        },
        left: {
            value: 0,
            unit: 'px'
        },
        bottom: {
            value: 0,
            unit: 'px'
        },
        right: {
            value: 0,
            unit: 'px'
        }
    },
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewX: 0,
    skewY: 0,
    width: {
        value: 100,
        unit: 'px'
    },
    height: {
        value: 100,
        unit: 'px'
    },

}

/*
    辅助渲染所有支持的svg元素
*/
export const Svg = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {
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
                zIndex: props.options.zIndex,
                ..._containerStyle
            }

            let width = getRelativeRealPixelValue(props.options.width)
            let height = getRelativeRealPixelValue(props.options.height)

            const style = {
                width,
                height,
                flexShrink: 0,
                ..._style,
            }

            return <div style={containerStyle}>
                {/* {props.options.svgUrl ? <img onLoad={updateCanvas} style={style} src={props.options.svgUrl}></img> : null} */}
                <svg style={style}>  {ctx.slots.default && ctx.slots.default()}</svg>
            </div>
        }
    }
})

export function createCanvasChildSvg(options) {
    return <Svg options={options} onVnodeUpdated={updateCanvas} onVnodeMounted={updateCanvas}></Svg>
}

export const defaultCanvasChildSvgRectOptions = {
    backgroundColor: {
        color: '#fff',
        colorType: 'pure'
    },
    borderColor: {
        color: '#fff',
        colorType: 'pure'
    },
    borderWidth: {
        value: 0,
        unit: 'px'
    },
    borderRadius:{
        horizontal:{
            value:0,
            unit:'px'
        },
        vertical:{
            value:0,
            unit:'px'
        }
    },
    ...defaultCanvasChildSvgOptions
}

var uid = 0

type SvgGradientNode = {
    id: string,
    node: VNode
}

const svgGradientCache: Record<string, SvgGradientNode> = {

}

function createSvgGradientCache(colorOption) {
    let id = uid++
    let cache = {
        id: `url(#${id})`,
        node: cssGradient2SVG(colorOption.color, { id: id++, jsx: true })
    }
    svgGradientCache[colorOption.color] = cache
    return cache
}

function getSvgGradientColorFromColorOption(colorOption) {
    if (colorOption.colorType == 'pure') {
        return colorOption.color
    }
    if (!svgGradientCache[colorOption.color]) {
        createSvgGradientCache(colorOption)
    }
    return svgGradientCache[colorOption.color].id
}

function getSvgGradientRenderFromColorOption(colorOption) {
    if (colorOption.colorType == 'pure') {
        return
    }
    if (!svgGradientCache[colorOption.color]) {
        createSvgGradientCache(colorOption)
    }
    return svgGradientCache[colorOption.color].node
}

export function createCanvasChildRect(options) {

   
    let width = getRelativeRealPixelValue(options.width)
    let height = getRelativeRealPixelValue(options.height)

    let borderWidth = getRelativeRealPixelValue(options.borderWidth)

    const x = borderWidth / 2
    const y = borderWidth / 2

    options.borderRadius

    const elementSize = {
        width,
        height
    }

    const rx = getRelativeRealPixelValue(options.borderRadius.horizontal,elementSize)
    const ry = getRelativeRealPixelValue(options.borderRadius.vertical,elementSize)
    const rectWidth = width - borderWidth
    const rectHeight = height - borderWidth
    return <Svg options={options}>
        {getSvgGradientRenderFromColorOption(options.backgroundColor)}
        {getSvgGradientRenderFromColorOption(options.borderColor)}
        <rect width={rectWidth} height={rectHeight} rx={rx} ry={ry}  x={x} y={y} fill={getSvgGradientColorFromColorOption(options.backgroundColor)} stroke={getSvgGradientColorFromColorOption(options.borderColor)} stroke-width={borderWidth} />
    </Svg>
}



/*
    ellipse
*/

export const defaultCanvasChildSvgEllipseOptions = {
    backgroundColor: {
        color: '#fff',
        colorType: 'pure'
    },
    borderColor: {
        color: '#fff',
        colorType: 'pure'
    },
    borderWidth: {
        value: 0,
        unit: 'px'
    },
    width: {
        value: 100,
        unit: 'px'
    },
    height: {
        value: 100,
        unit: 'px'
    },
    ...defaultCanvasChildSvgOptions
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

    let width = getRelativeRealPixelValue(options.width)
    let height = getRelativeRealPixelValue(options.height)
    let borderWidth = getRelativeRealPixelValue(options.borderWidth)

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


/*
    start
*/










