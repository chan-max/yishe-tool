

/*
    矩形
*/


/*
    矩形
*/
export const Rect = (props) => {

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
