
/*
 方形 
 圆形

*/

interface StampOptions {
    shape: 'round' | '',
    svg: {
        width: 100,
        height: 100
    }
}



const stampTemplateOptions = {
    shape: '' // 
}


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
        rx="x-radius"          <!-- 椭圆水平轴的半径 -->
        ry="y-radius"          <!-- 椭圆垂直轴的半径 -->
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

    return <rect x={x} y={x} rx={borderRadius} ry={borderRadius} fill={fill} width={width} height={height} stroke={borderColor} stroke-width={borderWidth}/>
}

/*
    印章根组件
*/
export const Stamp = (props) => {
    const width = props.width
    const height = props.height

    return <svg width={width} height={height}>
        {/* <Pentagram containerSize={{ width, height }} size="200"></Pentagram> */}
        {/* <Circle containerSize={{ width, height }}></Circle> */}
        {/* <Ellipse></Ellipse> */}
        <Rect containerSize={{width,height}} borderWidth={4} borderRadius={4}></Rect>
        </svg>
}

