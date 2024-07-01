import { canvasOptions, currentCanvasControllerInstance, updateCanvas } from "../index.tsx"
import { getPositionInfoFromOptions,getRelativeRealPixelSize } from '../helper.tsx'
import { defineComponent, onUpdated } from "vue"

export interface TextCanvasChildOptions {
    center: boolean | null | undefined
}

enum WritingMode {
    HTB = 'horizontal-tb',
    VLR = 'vertical-lr',
    VRL = 'vertical-rl'
}

export const defaultCanvasChildTextOptions = {
    type: 'text',
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
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewX: 0,
    skewY: 0,
    fontSize: {
        value:100,
        unit:'px'
    },
    fontWeight: '500',
    lineHeight: 1,
    letterSpacing: 0,
    textContent: 'hello world',
    writingMode: 'htb',
    unit: 'px' // px | vw | vh
}



function isGradientColor(color) {
    return color.includes('gradient')
}

export function createCanvasChildText(options, controller) {
    return <Text options={options} onVnodeUpdated={updateCanvas} onVnodeMounted={updateCanvas}></Text>
}

export const Text = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const options = props.options

        return () => {
            const {
                containerStyle: _containerStyle,
                style: _style
            } = getPositionInfoFromOptions(props.options.position)

            var containerStyle: any = {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: props.options.zIndex,
                ..._containerStyle
            }


            const fontSize = getRelativeRealPixelSize(props.options.fontSize)
            
            var style: any = {
                flexShrink: 0,
                fontSize, // 字体尺寸相对于画布宽度
                fontWeight: props.options.fontWeight,
                fontStyle: props.options.italic ? 'italic' : 'normal',
                whiteSpace: 'pre-line', // 用于显示换行
                lineHeight: props.options.lineHeight + 'em',
                letterSpacing: props.options.letterSpacing + 'em',
                fontFamily: props.options.fontFamilyInfo ? `font_${props.options.fontFamilyInfo.id}` : null,
                writingMode: props.options.writingMode == 'htb' ? WritingMode.HTB : props.options.writingMode == 'vlr' ? WritingMode.VLR : props.options.writingMode == 'vrl' ? WritingMode.VRL : null,
                transform: `scale3d(${props.options.scaleX ?? 1}, ${props.options.scaleY ?? 1}, ${props.options.scaleZ ?? 1}) rotateX(${props.options.rotateX ?? 0}deg) rotateY(${props.options.rotateY ?? 0}deg) rotateZ(${props.options.rotateZ ?? 0}deg) skew(${props.options.skewX ?? 0}deg, ${props.options.skewY ?? 0}deg)`,
                ..._style
            }

            if (props.options.fontColor) {
                if (isGradientColor(props.options.fontColor)) {
                    style.background = props.options.fontColor
                    style.backgroundClip = 'text'
                    style.color = 'transparent';
                } else {
                    style.color = props.options.fontColor;
                }
            }


            return <div style={containerStyle}>
                <span style={style}>
                    {props.options.textContent}
                </span>
            </div>
        }
    }
})