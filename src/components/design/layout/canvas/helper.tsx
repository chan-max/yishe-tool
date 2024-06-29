
/*
    获取
*/

import { canvasOptions } from "./index"

const isNumber = (val) => typeof val === 'number'


export function getRelativeRealPixelValue(size, elementRealSize = null) {
    let { value, unit } = size

    if (!value) {
        return 0
    }

    if (unit == 'px') {
        return value
    }

    if (unit == 'vw') {
        return value * canvasOptions.value.width / 100
    }

    if (unit == 'vh') {
        return value * canvasOptions.value.height / 100
    }

    if (unit == '%w') {
        return value * (elementRealSize?.width || 0) / 100
    }

    if (unit == '%h') {
        return value * (elementRealSize?.height || 0) / 100
    }
}

export function getRelativeRealPixelSize(value, elementRealSize = null) {
    return getRelativeRealPixelValue(value, elementRealSize) + 'px'
}


let directionMap = {
    top: '上方',
    left: '左侧',
    bottom: '下方',
    right: '右侧'
}

/*
    处理元素位置
*/

function getPositionRealLabel(direction, size) {
    let { value, unit } = size

    if (unit == 'px') {
        return `距离${directionMap[direction]} ${value}px`
    }

    if (unit == 'vw') {
        return `距离${directionMap[direction]} ${value / 100} 个画布宽度`
    }

    if (unit == 'vh') {
        return `距离${directionMap[direction]} ${value / 100} 个画布高度`
    }
}

export function getPositionInfoFromOptions(position) {
    const containerStyle: any = {}
    const style: any = {}
    const labels = []

    if (!position) {
        return {
            containerStyle,
            style, labels
        }
    }

    if (position.center) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        containerStyle.justifyContent = 'center'
        labels.push('整体居中')
    } else if (position.verticalCenter && position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        containerStyle.justifyContent = 'center'
        labels.push('整体居中')
    } else if (!position.verticalCenter && position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.justifyContent = 'center'
        style.position = 'absolute'

        if (isNumber(position.top.value)) {
            style.top = getRelativeRealPixelSize(position.top)
            labels.push(getPositionRealLabel('top', position.top))
        } else if (isNumber(style.bottom.value)) {
            style.bottom = getRelativeRealPixelSize(position.bottom)
            labels.push(getPositionRealLabel('bottom', position.bottom))
        }

        labels.push('水平居中')
    } else if (position.verticalCenter && !position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        // 按优先级排列
        style.position = 'absolute'

        if (isNumber(position.left.value)) {
            style.left = getRelativeRealPixelSize(position.left)
            labels.push(getPositionRealLabel('left', position.left))
        } else if (isNumber(style.right.value)) {
            style.right = getRelativeRealPixelSize(position.right)
            labels.push(getPositionRealLabel('right', position.right))
        }

        labels.push('垂直居中')
    } else {
        // 自定义属性
        style.position = 'absolute'

        if (isNumber(position.top.value)) {
            style.top = getRelativeRealPixelSize(position.top)
            labels.push(getPositionRealLabel('top', position.top))
        } else if (isNumber(position.bottom.value)) {
            style.bottom = getRelativeRealPixelSize(position.bottom)
            labels.push(getPositionRealLabel('bottom', position.bottom))
        }

        if (isNumber(position.left.value)) {
            style.left = getRelativeRealPixelSize(position.left)
            labels.push(getPositionRealLabel('left', position.left))
        } else if (isNumber(position.right.value)) {
            style.right = getRelativeRealPixelSize(position.right)
            labels.push(getPositionRealLabel('right', position.right))
        }
    }

    return {
        containerStyle,
        style,
        label: labels.length == 0 ? '未设置' : labels.join(' , ')
    }
}


/*
    处理内间距
*/

export function getPaddingRealLabel(direction, size) {
    let { value, unit } = size

    if (unit == 'px') {
        return `距离${directionMap[direction]} ${value}px`
    }

    if (unit == 'vw') {
        return `距离${directionMap[direction]} ${value / 100} 个画布宽度`
    }

    if (unit == 'vh') {
        return `距离${directionMap[direction]} ${value / 100} 个画布高度`
    }

    if (unit == '%w') {
        return `距离${directionMap[direction]} ${value / 100} 个元素宽度`
    }

    if (unit == '%h') {
        return `距离${directionMap[direction]} ${value / 100} 个元素高度`
    }
}

export function getPaddingDispalyLabel(padding) {
    let labels = []
    for (let key in padding) {
        if (padding[key].value) {
            labels.push(getPaddingRealLabel(key, padding[key]))
        }
    }
    return labels.length ? labels.join(' , ') : '无间距'
}


export function getPaddingRealPixel(padding, elementRealSize) {
    return [
        getRelativeRealPixelSize(padding.top, elementRealSize),
        getRelativeRealPixelSize(padding.right, elementRealSize),
        getRelativeRealPixelSize(padding.bottom, elementRealSize),
        getRelativeRealPixelSize(padding.left, elementRealSize)
    ].join(' ')
}


/*
    处理圆角
*/

const borderRadiusPositionMap = {
    leftTop: '左上角',
    rightTop: '右上角',
    rightBottom: '右下角',
    leftBottom: '左下角'
}

export function getBorderRadiusRealLabel(position, size) {
    let { value, unit } = size

    if (unit == 'px') {
        return `${borderRadiusPositionMap[position]} ${value}px`
    }

    if (unit == 'vw') {
        return `${borderRadiusPositionMap[position]} ${value / 100} 个画布宽度`
    }

    if (unit == 'vh') {
        return `${borderRadiusPositionMap[position]} ${value / 100} 个画布高度`
    }

    if (unit == '%w') {
        return `${borderRadiusPositionMap[position]} ${value / 100} 个元素宽度`
    }

    if (unit == '%h') {
        return `${borderRadiusPositionMap[position]} ${value / 100} 个元素高度`
    }
}

export function getBroderRadiusDispalyLabel(borderRadius) {
    let labels = []

    for (let key in borderRadius) {
        if (borderRadius[key].value) {
            labels.push(getBorderRadiusRealLabel(key, borderRadius[key]))
        }
    }

    return labels.length ? labels.join(' , ') : '无圆角'
}

export function getBorderRadiusRealPixel(borderRadius, elementRealSize) {
    return [
        getRelativeRealPixelSize(borderRadius.leftTop, elementRealSize),
        getRelativeRealPixelSize(borderRadius.rightTop, elementRealSize),
        getRelativeRealPixelSize(borderRadius.rightBottom, elementRealSize),
        getRelativeRealPixelSize(borderRadius.leftBottom, elementRealSize)
    ].join(' ')
}

