


/*
    获取
*/

const isNumber = (val) => typeof val === 'number'

export function getPositionInfoFromOptions(position) {
    const containerStyle: any = {}
    const style: any = {}
    const labels = []
    if (position.center) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        containerStyle.justifyContent = 'center'
        labels.push('居中')
    } else if (position.verticalCenter && position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        containerStyle.justifyContent = 'center'
        labels.push('居中')
    } else if (!position.verticalCenter && position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.justifyContent = 'center'
        style.position = 'absolute'
        style.top = position.top + '%'
        style.bottom = position.bottom + '%'
        labels.push('水平居中')
    } else if (position.verticalCenter && !position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        style.position = 'absolute'
        style.left = position.left + '%'
        style.right = position.right + '%'
        labels.push('垂直居中')
    } else {
        // 自定义属性
        style.position = 'absolute'

        if (isNumber(position.top)) {
            style.top = position.top + '%'
            labels.push(`距离顶部 ${position.top}%`)
        } else if (isNumber(position.bottom)) {
            style.bottom = position.bottom + '%'
            labels.push(`距离底部 ${position.bottom}%`)
        }

        if (isNumber(position.left)) {
            style.left = position.left + '%'
            labels.push(`距离左侧 ${position.left}%`)
        } else if (isNumber(position.right)) {
            style.right = position.right + '%'
            labels.push(`距离右侧 ${position.right}%`)
        }
    }

    return {
        containerStyle,
        style,
        label: labels.length == 0 ? '未设置' : labels.join(' ')
    }
}
