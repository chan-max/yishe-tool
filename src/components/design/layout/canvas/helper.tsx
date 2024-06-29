
/*
    获取
*/

import { canvasOptions } from "./index"

const isNumber = (val) => typeof val === 'number'


function getPositionRealSize(size) {
    let { value, unit } = size

    if (unit == 'px') {
        return value + 'px'
    }

    if (unit == 'vw') {
        return value * canvasOptions.value.width + 'px'
    }

    if (unit == 'vh') {
        return value * canvasOptions.value.height + 'px'
    }
}

let directionMap = {
    top: '上方',
    left: '左侧',
    bottom: '下方',
    right: '右侧'
}

function getPositionRealLabel(direction, size) {
    let { value, unit } = size

    if (unit == 'px') {
        return `距离${directionMap[direction]}${value}px`
    }

    if (unit == 'vw') {
        return `距离${directionMap[direction]}${value}个画布宽度`
    }

    if (unit == 'vh') {
        return `距离${directionMap[direction]}${value}个画布高度`
    }
}

export function getPositionInfoFromOptions(position) {
    const containerStyle: any = {}
    const style: any = {}
    const labels = []

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

        if (isNumber(style.top)) {
            style.top = getPositionRealSize(position.top)
            labels.push(getPositionRealLabel('top', position.top))
        } else if (isNumber(style.bottom)) {
            style.bottom = getPositionRealSize(position.bottom)
            labels.push(getPositionRealLabel('bottom', position.bottom))
        }

        labels.push('水平居中')
    } else if (position.verticalCenter && !position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        // 按优先级排列
        style.position = 'absolute'

        if (isNumber(style.left)) {
            style.left = getPositionRealSize(position.left)
            labels.push(getPositionRealLabel('left', position.left))
        } else if (isNumber(style.right)) {
            style.right = getPositionRealSize(position.right)
            labels.push(getPositionRealLabel('right', position.right))
        }

        labels.push('垂直居中')
    } else {
        // 自定义属性
        style.position = 'absolute'

        if (isNumber(position.top)) {
            style.top = getPositionRealSize(position.top)
            labels.push(getPositionRealLabel('top', position.top))
        } else if (isNumber(position.bottom)) {
            style.bottom = getPositionRealSize(position.bottom)
            labels.push(getPositionRealLabel('bottom', position.bottom))
        }

        if (isNumber(position.left)) {
            style.left = getPositionRealSize(position.left)
            labels.push(getPositionRealLabel('left', position.left))
        } else if (isNumber(position.right)) {
            style.right = getPositionRealSize(position.right)
            labels.push(getPositionRealLabel('right', position.right))
        }
    }

    return {
        containerStyle,
        style,
        label: labels.length == 0 ? '未设置' : labels.join(' ')
    }
}
