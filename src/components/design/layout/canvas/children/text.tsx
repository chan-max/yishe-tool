import { canvasOptions, currentCanvasControllerInstance, updateCanvas } from "../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeOption, parseTextShadowOptionsToCSS } from '../helper.tsx'
import { defineComponent, onMounted, onUpdated, ref, watchEffect } from "vue"
import CircleType from "circletype";

export interface TextCanvasChildOptions {
    center: boolean | null | undefined
}

enum WritingMode {
    HTB = 'horizontal-tb',
    VLR = 'vertical-lr',
    VRL = 'vertical-rl'
}

export const createDefaultCanvasChildTextOptions = () => {

    const canvasUnit = canvasOptions.value.unit

    return {
        type: 'text',
        fontColor: {
            color: "#000",
            colorType: 'pure'
        },
        position: {
            center: true,
            verticalCenter: true,
            horizontalCenter: true,
            top: {
                value: 0,
                unit: canvasUnit
            },
            left: {
                value: 0,
                unit: canvasUnit
            },
            bottom: {
                value: 0,
                unit: canvasUnit
            },
            right: {
                value: 0,
                unit: canvasUnit
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
            value: 100,
            unit: canvasUnit
        },
        textShadow: [],
        fontWeight: '500',
        lineHeight: 1,
        letterSpacing: 0,
        textContent: 'hello world',
        writingMode: 'htb',
    }
}



export function createCanvasChildText(options) {
    return <Text options={options} onVnodeUpdated={updateCanvas} onVnodeMounted={updateCanvas}></Text>
}


function createTextContent(props) {
    // textContent
    // letterSpacing
    // fontSize
    // lineHeight

}

export const Text = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const innerTextRef = ref()


        // 文字单元格
        const textContentCells = ref()

        // 每个单元格的class
        const textCellClass = ref('text-cell-class')

        watchEffect(() => {

            // 触发依赖
            let el = innerTextRef.value
            if (!el) {
                return
            }


            let cells = el.querySelectorAll(`.${textCellClass.value}`)


            Array.prototype.forEach.call(cells, (cell) => {
                let { row, col } = cell.dataset
                let item = textContentCells.value[row][col]

                item.pxWidth = window.getComputedStyle(cell).width.slice(0, -2)
                item.pxHeight = window.getComputedStyle(cell).height.slice(0, -2)
            })



            // el.innerHTML = props.options.textContent
            // new CircleType(el).radius(340);
        })



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



            const fontSize = formatToNativeSizeOption(props.options.fontSize)



            var style: any = {
                flexShrink: 0,
                fontSize: fontSize.value + fontSize.unit,
                fontWeight: props.options.fontWeight,
                fontStyle: props.options.italic ? 'italic' : 'normal',
                whiteSpace: 'pre-line', // 用于显示换行
                lineHeight: props.options.lineHeight + 'em',
                letterSpacing: props.options.letterSpacing + 'em',
                fontFamily: props.options.fontFamilyInfo ? `font_${props.options.fontFamilyInfo.id}` : null,
                writingMode: props.options.writingMode == 'htb' ? WritingMode.HTB : props.options.writingMode == 'vlr' ? WritingMode.VLR : props.options.writingMode == 'vrl' ? WritingMode.VRL : null,
                transform: `scale3d(${props.options.scaleX ?? 1}, ${props.options.scaleY ?? 1}, ${props.options.scaleZ ?? 1}) rotateX(${props.options.rotateX ?? 0}deg) rotateY(${props.options.rotateY ?? 0}deg) rotateZ(${props.options.rotateZ ?? 0}deg) skew(${props.options.skewX ?? 0}deg, ${props.options.skewY ?? 0}deg)`,
                ..._style,
                textShadow: parseTextShadowOptionsToCSS(props.options.textShadow)
            }

            if (props.options.fontColor) {
                if (props.options.fontColor.colorType == 'gradient') {
                    style.background = props.options.fontColor.color
                    style.backgroundClip = 'text'
                    style.color = 'transparent';
                } else {
                    style.color = props.options.fontColor.color;
                }
            }


            const innerStyle: any = {
                position: 'relative'
            }

            const innerItemStyle = {

            }




            textContentCells.value = props.options.textContent.split('\n').filter((item) => item !== '').map((row) => {
                return row.split('').map((content) => {
                    return {
                        style:{
                            display: 'inline-block',
                            position:'absolute'
                        },
                        content
                    }
                })
            })

            const textContent = <div ref={innerTextRef} style={innerStyle}>
                {textContentCells.value.map((row, rowIndex) => {
                    return <div>
                        {row.map((item, columnIndex) => {
                            return <div style={item.style}  class={textCellClass.value} data-row={rowIndex} data-col={columnIndex}>{item.content}</div>
                        })}
                    </div>
                })}
            </div>

            return <div style={containerStyle}>
                <div style={style}>
                    {textContent}
                </div>
            </div>
        }
    }
})


/*
    圆的旋转角度坐标公式 
    圆心坐标 x0，y0
    T 为旋转的角度 ，相当于路径的距离
    x2= (x1-x0)cosT-(y1-y0)sinT+x0
    y2=(y1-y0)cosT+(x1-x0)sinT+y0
*/