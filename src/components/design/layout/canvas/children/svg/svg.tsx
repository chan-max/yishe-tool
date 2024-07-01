

import { ref, watchEffect } from 'vue'
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


function isGradientColor(val) {
    return val &&  val.includes('gradient')
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
    ...defaultCanvasChildSvgOptions
}

var uid = 0



export function createCanvasChildRect(options) {

    let width = getRelativeRealPixelValue(options.width)
    let height = getRelativeRealPixelValue(options.height)


    let isGradientBackground = isGradientColor(options.backgroundColor)
    let isGradientBorder = isGradientColor(options.borderColor)
    var backgroundColor = '', borderColor, gradientBackgroundVnode = null, gradientBorderVnode = null

    if (options.backgroundColor) {
        if (isGradientBackground) {
            let id = uid++
            backgroundColor = `url(#${id})`

            gradientBackgroundVnode = cssGradient2SVG(options.backgroundColor, { id: id++ })

        } else {
            backgroundColor = options.backgroundColor
        }
    }

    if (options.borderColor) {
        if (isGradientBorder) {
            let id = uid++
            borderColor = `url(#${id})`
            gradientBorderVnode = cssGradient2SVG(options.backgroundColor, { id: id++ })
        } else {
            borderColor = options.borderColor
        }
    }



    return <Svg options={options}>
        {gradientBackgroundVnode ? gradientBackgroundVnode : null}
        {gradientBorderVnode ? gradientBorderVnode : null}
        <rect width={width} height={height} x="0" y="0" fill={backgroundColor} stroke={borderColor} stroke-width={50}/>
    </Svg>
}





