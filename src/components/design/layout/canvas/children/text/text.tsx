import { canvasOptions, currentCanvasControllerInstance, updateCanvas } from "../../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeOption, parseTextShadowOptionsToCSS, formatSizeOptionToPixelValue, formatToNativeSizeString } from '../../helper.tsx'
import { defineComponent, onMounted, onUpdated, ref, watchEffect, nextTick, watch } from "vue"
// import CircleType from "circletype";
import { findEllipseDistancePoint, getEllipsePos, getRoundPos, findRoundDistancePoint } from './calc.tsx'
import { tify, sify } from 'chinese-conv';


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
        isRoundText: false,
        roundTextHorizontalRadius: {
            unit: canvasUnit,
            value: 100,
        },
        roundTextVerticalRadius: {
            unit: canvasUnit,
            value: 100,
        },
        roundTextStartDeg: 0,
        isCounterclockwise: false, // 文字是否指向圆心，默认为否

        textStrokeWidth: {
            unit: canvasUnit,
            value: 0,
        },
        textStrokeColor: {
            type: 'pure',
            color: '#fff',
        },
        filterBlur: {
            value: 0,
            unit: canvasUnit
        },
        filterBrightness: 100, // 亮度百分比，默认为100 ，正常
        filterContrast: 100, // 对比度
        filterGrayscale: 0, // 灰度
        filterHueRotate: 0, // 色相旋转
        filterInvert: 0, // 反转输入
        filterOpacity: 100, // 透明度
        filterSaturate: 100, // 饱和度
        filterSepia: 0, // 褐色

        // 是否使用繁体字
        isTraditionalChinese: false
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

        // 文字容器，用于布局
        const textContainerRef = ref()

        // 用来包裹文字单元块 ， 需要相对布局
        const roundTextInnerContainerRef = ref()

        // 文字单元格
        const textContentCells = ref([])

        // key值，用于更新
        const key = ref(0)

        watchEffect(() => {
            let el = roundTextInnerContainerRef.value

            if (!el) {
                return
            }

            if (props.options.isRoundText) {
                createRoundText(el, props.options, textContentCells.value)
            }
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


            const filter = [
                `blur(${formatToNativeSizeString(props.options.filterBlur)})`,
                `brightness(${props.options.filterBrightness}%)`,
                `contrast(${props.options.filterContrast}%)`,
                `grayscale(${props.options.filterGrayscale}%)`,
                `hue-rotate(${props.options.filterHueRotate}deg)`,
                `invert(${props.options.filterInvert}%)`,
                `opacity(${props.options.filterOpacity}%)`,
                `saturate(${props.options.filterSaturate}%)`
            ].join(' ')


            console.log(filter)

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
                transform: `scale3d(${props.options.scaleX ?? 1}, ${props.options.scaleY || 1}, ${props.options.scaleZ || 1}) rotateX(${props.options.rotateX || 0}deg) rotateY(${props.options.rotateY || 0}deg) rotateZ(${props.options.rotateZ || 0}deg) skew(${props.options.skewX || 0}deg, ${props.options.skewY || 0}deg)`,
                ..._style,
                filter,
                textShadow: parseTextShadowOptionsToCSS(props.options.textShadow),
                textStroke: formatToNativeSizeString(props.options.textStrokeWidth) + ' ' + props.options.textStrokeColor.color
            }



            // 处理文字颜色
            if (props.options.fontColor) {
                if (props.options.fontColor.colorType == 'gradient') {
                    style.background = props.options.fontColor.color
                    style.backgroundClip = 'text'
                    style.color = 'transparent';
                } else {
                    style.color = props.options.fontColor.color;
                }
            }



            const innerStyle = {
                background: 'inherit',
                color: 'inherit',
                backgroundClip: 'inherit',
            }

            const rowStyle = {
                background: 'inherit',
                color: 'inherit',
                backgroundClip: 'inherit',
            }

            const cellStyle = {
                display: 'inline-block',
                background: 'inherit',
                color: 'inherit',
                backgroundClip: 'inherit',
            }


            var textContent = props.options.textContent

            // 设置为繁体字
            if(props.options.isTraditionalChinese){
                textContent = tify(textContent)
            }
            

            // 生成文字单元格
            const rows = textContent.split('\n').filter((item) => item !== '')
            
            textContentCells.value = rows.map((row) => {
                return row.split('').map((content) => {
                    return {
                        content,
                    }
                })
            })


            let roundNode = <div ref={roundTextInnerContainerRef} style={innerStyle}>
                {textContentCells.value.map((row, rowIndex) => {
                    const cells = row.map((cell, columnIndex) => {
                        return <div id={`row-${rowIndex}-col-${columnIndex}`} data-rowIndex={rowIndex} data-columnIndex={columnIndex} style={{ ...cellStyle, ...cell.style }}>{cell.content}</div>
                    })
                    return <div style={rowStyle}> {cells} </div>
                })}
            </div>

            return <div style={containerStyle} key={key.value}>
                <div ref={textContainerRef} style={style}>
                    {props.options.isRoundText ? roundNode : textContent}
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

function getElementComputedPixelValue(el, property) {
    return Number(window.getComputedStyle(el)[property].slice(0, -2))
}



async function createRoundText(innerContainer, options, textContentCells) {

    // innerContainer.style.width = '0px'
    // innerContainer.style.height = '0px'
    innerContainer.style.position = 'relative'

    let startDeg = options.roundTextStartDeg
    let isCounterclockwise = options.isCounterclockwise


    const horizontalRadius = formatSizeOptionToPixelValue(options.roundTextHorizontalRadius)
    const verticalRadius = formatSizeOptionToPixelValue(options.roundTextVerticalRadius)


    let lineHeightPixelValue = formatSizeOptionToPixelValue({
        value: options.lineHeight * options.fontSize.value,
        unit: options.fontSize.unit,
    })

    let letterSpacingPixelValue = formatSizeOptionToPixelValue({
        value: options.letterSpacing * options.fontSize.value,
        unit: options.fontSize.unit,
    })

    let isCircle = horizontalRadius == verticalRadius

    // 元素插入页面后再计算真实宽度

    textContentCells.forEach((row, rowIndex) => {
        row.forEach((item, columnIndex) => {
            let el = innerContainer.querySelector(`#row-${rowIndex}-col-${columnIndex}`)
            el.style.position = 'absolute'

            // item.style.position = 'absolute'
            item.el = el

            // 由于获取真实尺寸，始终为像素值，所以需要把所有涉及到的单位统一为像素
            let width = getElementComputedPixelValue(item.el, 'width')
            let height = getElementComputedPixelValue(item.el, 'height')
            item.width = width
            item.height = height
            item.rawWidth = width - letterSpacingPixelValue
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
        // minRadius = outerMinCircumference / (2 * Math.PI)

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
                ? findRoundDistancePoint(hr, startPosition.x, startPosition.y, distance, !isCounterclockwise)
                : findEllipseDistancePoint(hr, vr, startPosition.x, startPosition.y, distance, !isCounterclockwise)

            item.x = pos.x
            item.y = pos.y
            item.deg = pos.deg

            if (isCircle) {
                // 圆
                item.el.style.left = (item.x - (letterSpacingPixelValue) / 2) + 'px'
                item.el.style.bottom = (item.y - lineHeightPixelValue / 2) + 'px'
                item.el.style.transform = `rotate(${item.deg}deg)`
            } else {
                // 椭圆
                item.el.style.left = (item.x) + 'px'
                item.el.style.bottom = (item.y) + 'px'
                item.el.style.transform = `rotate(${item.deg}deg)`
            }
        })
    })
}





