import { computed, ref } from 'vue'
import cssGradient2SVG from '@/common/transform/svg'
import { svgCanvasChildren, svgCanvasWidth, svgCanvasHeight } from '@/components/design/store'

/*
 方形 
 圆形
*/


/*
    // 可以通过调整transform属性来调整 元素的尺寸
*/


/*
    正五角星
*/
const Pentagram = (props) => {
    /*
        containerSize ; {
            containerwidth : 
            containerHeight:
        }
        color:
        size: 
    */

    const { containerSize: { width: containerWidth, height: containerHeight } } = props

    const baseSize = 26  // 基础尺寸
    const points = "13,0 16,10 26,10 18,16 20,26 13,20 6,26 8,16 0,10 10,10"

    const size = Number(props.size) || 26
    const scale = size / baseSize;
    const translateX = (containerWidth - size) / 2 * scale
    const translateY = (containerWidth - size) / 2 * scale
    const color = props.color || 'red'

    // 居中显示
    return <polygon transform={`scale(${scale}) translate(${translateX}, ${translateY})`} fill={color} points={points} />
}

/*

*/
const Circle = (props) => {
    /*
        containerSize : {
            width 
            height
        }
        width : 圆的宽度，包括边框的宽度
        color : 圆的颜色
        stroke : 边框宽度
    */

    const { containerSize: { width: containerWidth, height: containerHeight } } = props


    const color = props.color || 'red'
    const circleWidth = props.circleWidth

    // 默认居中
    const x = containerWidth / 2
    const y = containerHeight / 2

    return <circle cx={x} cy={y} r="circleRadius" stroke={color} stroke-width={circleWidth} />
}

const Ellipse = (props) => {
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
        默认充满居中
    */
    const { containerSize: { width: containerWidth, height: containerHeight } } = props

    // 默认居中
    const x = containerWidth / 2
    const y = containerHeight / 2

    const color = props.color || '#ff0000'

    const strokeWidth = props.strokeWidth || 10

    const xRadius = (containerWidth - strokeWidth) / 2
    const yRadius = (containerHeight - strokeWidth) / 2

    return <ellipse cx={x} cy={y} rx={xRadius} ry={yRadius} stroke={color} stroke-width={strokeWidth}></ellipse>
}


/*
    矩形
*/
const Rect = (props) => {

    const { containerSize: { width: containerWidth, height: containerHeight } } = props

    const fill = props.fill || 'transparent'

    const borderColor = props.borderColor || 'red'
    const borderWidth = props.borderWidth || 20
    const borderRadius = props.borderRadius || 0

    const x = borderWidth / 2
    const y = borderWidth / 2

    const width = containerWidth - borderWidth
    const height = containerHeight - borderWidth

    return <rect x={x} y={x} rx={borderRadius} ry={borderRadius} fill={fill} width={width} height={height} stroke={borderColor} stroke-width={borderWidth} />
}



const Text = (props) => {
    return <text
        font-size={props.fontSize || 24}
        x={props.containerSize.width / 2}
        y={props.containerSize.height / 2}
        style='dominant-baseline:middle;text-anchor:middle;'>
        {props.content} </text>
}


export enum SvgChildType {
    ForeignObject,
    Text = 'text',
    Circle = 'circle'
}


const svgDefs = ref([])

/*
    创建svg子元素
*/
function createSvgChild(options) {
    switch (options.type) {
        case SvgChildType.ForeignObject:
            return createForeignObject(options)
        case SvgChildType.Text:
            return createText(options)
    }
}

function createForeignObject(options) {
    return <foreignObject width="100%" height="100%">
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;">
            { }
        </div>
    </foreignObject>
}

function isGradientColor(color) {
    return typeof color == 'string' ? color.includes('gradient') : color.type == 'gradient'
}


const basicTextOptions = {
    fontSize: .1, // 字体大小相对于宽度
    textContent: 'hello world',
    fontWeight: '500',
    lineHeight: 1,
    letterSpacing: .1
}

function createText(options) {

    options = {
        ...options
    }

    const style: any = {
        fontSize: options.fontSize * svgCanvasWidth.value + 'px',
        fontWeight: options.fontWeight,
        fontStyle: options.italic ? 'italic' : 'normal',
        whiteSpace: 'pre-line', // 用于显示换行
        // lineHeight: options.lineHeight + 'em',
        letterSpacing: options.letterSpacing + 'em',
        fontFamily: options.fontFamilyInfo ? `font_${options.fontFamilyInfo.id}` : null
    }

    if (options.fontFamilyInfo) {

    //     let inner = `
    //             @font-face {
    //                 font-family: ${fontId};
    //                 src: url(${URL.createObjectURL(file)}); 
    //             }
    // `;

    //     const el = <style>
    //         {inner}
    //     </style>
    //     svgDefs.value.push(el)
    }


    if (options.fontColor) {
        if (isGradientColor(options.fontColor)) {
            // 渐变色
            style.fill = options.fontColor

            let defId = id++

            const gradient = cssGradient2SVG(options.fontColor, { id: defId })

            svgDefs.value.push(gradient)

            style.fill = ` url(#${defId})`

        } else {
            // 普通颜色
            style.fill = options.fontColor
        }
    }


    if (options.textContent) {
        options.textContent = String(options.textContent).split('\n')
    } else {
        options.textContent = []
    }

    /*
        放弃html形式，改为svg形式
    */

    const dominantBaseline = 'middle'
    const textAnchor = 'middle'

    return <text x="0" y="0"
        // dominant-baseline={dominantBaseline} 
        // text-anchor={textAnchor} 
        style={style} font-family={style.fontFamily}>
        {options.textContent.map((item) => {
            return <tspan x="0" dy={options.lineHeight + 'em'}> {item} </tspan>
        })}
    </text>

    // return <foreignObject width="100%" height="100%">
    //     <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;">
    //         <div title="文字背景">
    //             <span style={style} title="文字元素">
    //                 {options.textContent}
    //             </span>
    //         </div>
    //     </div>
    // </foreignObject>
}

let id = 1

export function addSvgCanvasChild(type = SvgChildType.Text, opts = {
    id: id++
}) {
    if (type == SvgChildType.Text) {
        svgCanvasChildren.value.push({
            type,
            ...basicTextOptions,
            ...opts
        })
    }
}


// 小画布允许显示的最大尺寸
let displayMaxSize = 300

export const SvgCanvas = (props) => {

    svgDefs.value = []

    const width = props.width
    const height = props.height

    let defs = <defs>
        {svgDefs.value}
    </defs>



    const svg = <svg width={width} height={height}>
        {defs}
        {svgCanvasChildren.value.map(createSvgChild)}
    </svg>

    return svg
}

