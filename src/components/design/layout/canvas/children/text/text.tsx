import { canvasOptions, currentCanvasControllerInstance, updateCanvas } from "../../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeOption, parseTextShadowOptionsToCSS, formatSizeOptionToPixelValue } from '../../helper.tsx'
import { defineComponent, onMounted, onUpdated, ref, watchEffect, nextTick } from "vue"
import CircleType from "circletype";
import { findEllipseDistancePoint, getEllipsePos, getRoundPos, findRoundDistancePoint } from './calc.tsx'


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
        roundTextHorizontalRadius: {
            unit: canvasUnit,
            value: 100,
        },
        roundTextVerticalRadius: {
            unit: canvasUnit,
            value: 100,
        },
        roundTextRadius: {
            unit: canvasUnit,
            value: 100,
        },
        roundTextStartDeg: 270,
    }
}

export function createCanvasChildText(options) {
    return <Text options={options} onVnodeUpdated={updateCanvas} onVnodeMounted={updateCanvas}></Text>
}

export const Text = defineComponent({
    props: {
        options: null
    },
    setup(props, ctx) {

        const textContainerRef = ref()


        watchEffect(() => {
            let el = textContainerRef.value
            if (!el) {
                return
            }

            const horizontalRadius = formatSizeOptionToPixelValue(props.options.roundTextHorizontalRadius)
            const verticalRadius = formatSizeOptionToPixelValue(props.options.roundTextVerticalRadius)
            const radius = formatSizeOptionToPixelValue(props.options.roundTextRadius)

            let lineHeightPixelValue = formatSizeOptionToPixelValue({
                value: props.options.lineHeight * props.options.fontSize.value,
                unit: props.options.fontSize.unit,
            })


            let letterSpacingPixelValue = formatSizeOptionToPixelValue({
                value: props.options.letterSpacing * props.options.fontSize.value,
                unit: props.options.fontSize.unit,
            })

            

            createRoundText(el, {
                textContent: props.options.textContent, // 文字内容
                lineHeightPixelValue, // 行高
                letterSpacingPixelValue, // 字间距
                horizontalRadius, // 半径
                verticalRadius,
                radius,
                startDeg: Number(props.options.roundTextStartDeg)
            })
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

            return <div style={containerStyle}>
                <div ref={textContainerRef} style={style}>
                </div>
            </div>
        }
    }
})




/*
    input
    环形的半径，默认为最小尺寸，即以圆形铺满，
    起始位置的角度
        - 自适应对称
        - 正上方开始    
    换行文字已最外行为基准
*/

function getElementComputedPixelValue(el,property){
    return  Number(window.getComputedStyle(el)[property].slice(0, -2))
}

async function createRoundText(container, options) {
    const {
        lineHeightPixelValue,
        letterSpacingPixelValue,
        textContent,
        horizontalRadius,
        verticalRadius,
        startDeg = 0, // 起始角度，
        direction = 1,
        radius
    } = options

    let isCircle = horizontalRadius == verticalRadius

    var minRadius // 最小半径 

    container.innerHTML = ''

    const innerContainer = document.createElement('div')

    innerContainer.style.width = '0px'
    innerContainer.style.height = '0px'
    innerContainer.style.position = 'relative'

    // 生成文字单元格
    const textContentCells = textContent.split('\n').filter((item) => item !== '').map((row) => {
        return row.split('').map((content) => {
            let el = document.createElement('div')
            el.style.position = 'absolute';
            el.style.display = 'inline-block'

            el.innerHTML = content

            return {
                content,
                el
            }
        })
    })

    // 插入元素
    textContentCells.forEach((row) => {
        let el = document.createElement('div')
        row.forEach((item) => {
            el.appendChild(item.el)
        })
        innerContainer.appendChild(el)
    })

    container.appendChild(innerContainer)

    await nextTick()

    // 元素插入页面后再计算真实宽度
    textContentCells.forEach((row) => {
        row.forEach((item) => {
            // 由于获取真实尺寸，始终为像素值，所以需要把所有涉及到的单位统一为像素
            item.width = getElementComputedPixelValue(item.el,'width')
            item.height = getElementComputedPixelValue(item.el,'height')

            /*
              该宽高是包括行高和字间距的
            */
        
        })
    })

    // 计算位置和角度
    textContentCells.forEach((row, rowIndex) => {

        let rows = textContentCells.length

        // 外侧最小可能的周长
        const outerMinCircumference = row.reduce((a, b) => {
            return a + b.width + letterSpacingPixelValue
        }, 0)

        // 最小允许的半径
        minRadius = outerMinCircumference / (2 * Math.PI)

        // 弧形的起始坐标
        let startPosition = isCircle ? getRoundPos(horizontalRadius, startDeg) : getEllipsePos(horizontalRadius, verticalRadius, startDeg)

        
        const hr = horizontalRadius + (rows - rowIndex) * lineHeightPixelValue
        const vr = verticalRadius + (rows - rowIndex) * lineHeightPixelValue

        row.forEach((item, index) => {

            var distance = 0

            for (let i = 0; i <= index; i++) {
                let item = row[i - 1]
                if (item) {
                    distance += item.width
                }
            }


            let pos = isCircle 
            ? findRoundDistancePoint(hr, startPosition.x, startPosition.y, distance) 
            : findEllipseDistancePoint(hr, vr, startPosition.x, startPosition.y, distance)



            item.x = pos.x
            item.y = pos.y
            item.deg = pos.deg

            if(isCircle) {
                item.el.style.left = (item.x - (letterSpacingPixelValue) / 2) + 'px'
                item.el.style.bottom = (item.y - lineHeightPixelValue / 2) + 'px'
                item.el.style.transform = `rotate(${item.deg}deg)`
            }else{
                item.el.style.left = (item.x - (letterSpacingPixelValue + item.width)) + 'px'

                item.el.style.bottom = (item.y - lineHeightPixelValue / 2) + 'px'
                item.el.style.transform = `rotate(${item.deg}deg)`
            }
        })
    })
}





