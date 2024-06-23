import { canvasOptions } from "../index.tsx"


export interface TextCanvasChildOptions {
    center: boolean | null | undefined
}


enum WritingMode {
    HTB = 'horizontal-tb',
    VLR = 'vertical-lr',
    VRL = 'vertical-rl'
}

function isGradientColor(color) {
    return color.includes('gradient')
}

export function createCanvasChildText(options) {

    options.fontSize ||= .1
    options.fontWeight ||= 500
    options.lineHeight ||= 1
    options.letterSpacing ||= 0
    options.textContent ||= ''
    options.writingMode ||= 'htb'

    var containerStyle: any = {
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative'
    }

    var style: any = {
        position: 'absolute',
        top: null,
        left: null,
        fontSize: options.fontSize * canvasOptions.value.width + 'px', // 字体尺寸相对于画布宽度
        fontWeight: options.fontWeight,
        fontStyle: options.italic ? 'italic' : 'normal',
        whiteSpace: 'pre-line', // 用于显示换行
        lineHeight: options.lineHeight + 'em',
        letterSpacing: options.letterSpacing + 'em',
        fontFamily: options.fontFamilyInfo ? `font_${options.fontFamilyInfo.id}` : null,
        writingMode: options.writingMode == 'htb' ? WritingMode.HTB : options.writingMode == 'vlr' ? WritingMode.VLR : options.writingMode == 'vrl' ? WritingMode.VRL : null,
        transform: `scale3d(${options.scaleX}, ${options.scaleY}, ${options.scaleZ}) rotateX(${options.rotateX}deg) rotateY(${options.rotateY}deg) rotateZ(${options.rotateZ}deg) skew(${options.skewX}deg, ${options.skewY}deg)`
    }

    if (options.fontColor) {
        if (isGradientColor(options.fontColor)) {
            style.background = options.fontColor
            style.backgroundClip = 'text'
            style.color = 'transparent';
        } else {
            style.color = options.fontColor;
        }
    }

    // 居中优先级最高 , 其次为水平垂直居中
    if (options.position.center) {
        containerStyle.alignItems = 'center'
        containerStyle.justifyContent = 'center'
    } else if (options.position.verticalCenter && options.position.horizontalCenter) {
        containerStyle.alignItems = 'center'
        containerStyle.justifyContent = 'center'
    } else if (!options.position.verticalCenter && options.position.horizontalCenter) {
        containerStyle.justifyContent = 'center'
    } else if (options.position.verticalCenter && !options.position.horizontalCenter) {
        containerStyle.alignItems = 'center'
    } else {
        // 自定义位置
        if (options.position.top) {
            style.top = options.position.top + '%'
        } else if (options.position.bottom) {
            style.bottom = options.position.bottom + '%'
        }

        if (options.position.left) {
            style.left = options.position.left + '%'
        } else if (options.position.right) {
            style.right = options.position.right + '%'
        }
    }



    return <div style={containerStyle}>
        <div style={style}>
            {options.textContent}
        </div>
    </div>
}