import { canvasOptions } from "../index.tsx"
import { getPositionInfoFromOptions } from '../helper.tsx'

export interface TextCanvasChildOptions {
    center: boolean | null | undefined
}


const isNumber = (val) => typeof val === "number"

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


    const {
        containerStyle: _containerStyle,
        style: _style
    } = getPositionInfoFromOptions(options.position)

    var containerStyle: any = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: options.zIndex,
        ..._containerStyle
    }

    var style: any = {
        fontSize: options.fontSize * canvasOptions.value.width + 'px', // 字体尺寸相对于画布宽度
        fontWeight: options.fontWeight,
        fontStyle: options.italic ? 'italic' : 'normal',
        whiteSpace: 'pre-line', // 用于显示换行
        lineHeight: options.lineHeight + 'em',
        letterSpacing: options.letterSpacing + 'em',
        fontFamily: options.fontFamilyInfo ? `font_${options.fontFamilyInfo.id}` : null,
        writingMode: options.writingMode == 'htb' ? WritingMode.HTB : options.writingMode == 'vlr' ? WritingMode.VLR : options.writingMode == 'vrl' ? WritingMode.VRL : null,
        transform: `scale3d(${options.scaleX ?? 1}, ${options.scaleY ?? 1}, ${options.scaleZ ?? 1}) rotateX(${options.rotateX ?? 0}deg) rotateY(${options.rotateY ?? 0}deg) rotateZ(${options.rotateZ ?? 0}deg) skew(${options.skewX ?? 0}deg, ${options.skewY ?? 0}deg)`,
        ..._style
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



    return <div style={containerStyle}>
        <span style={style}>
            {options.textContent}
        </span>
    </div>
}