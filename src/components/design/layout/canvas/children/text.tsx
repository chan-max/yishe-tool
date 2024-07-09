import { canvasOptions, currentCanvasControllerInstance, updateCanvas } from "../index.tsx"
import { getPositionInfoFromOptions, formatToNativeSizeOption, parseTextShadowOptionsToCSS, formatSizeOptionToPixelValue } from '../helper.tsx'
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
        roundTextRadius: {
            unit: canvasUnit,
            value: 0,
        }
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


            let lineHeightPixelValue = formatSizeOptionToPixelValue({
                value: props.options.lineHeight * props.options.fontSize.value,
                unit: props.options.fontSize.unit,
            })

            let letterSpacingPixelValue = formatSizeOptionToPixelValue({
                value: props.options.letterSpacing * props.options.fontSize.value,
                unit: props.options.fontSize.unit,
            })


            createRoundText(el, {
                textContent: props.options.textContent,
                lineHeightPixelValue,
                letterSpacingPixelValue
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


            return <div style={containerStyle}>
                <div ref={textContainerRef} style={style}>
                </div>
            </div>
        }
    }
})



// 计算该点的角度，12点钟为0
function calculateDeg(x, y) {
    let radian = Math.atan(x / y);
    let degree = radian * (180 / Math.PI);

    if (x < 0 && y >= 0) {
        // 第二象限
        degree += 360;
    } else if (x < 0 && y < 0) {
        // 第三象限
        degree += 180;
    } else if (x >= 0 && y < 0) {
        // 第四象限
        degree += 180;
    }

    return degree;
}


// 获取下一个圆弧上点的坐标

function calculatePoint(x0, y0, r, x1, y1, d) {
    // 计算起点到圆心的向量
    let dx1 = x1 - x0;
    let dy1 = y1 - y0;

    // 计算起点与圆心连线的角度（以弧度计）
    let angle1 = Math.atan2(dy1, dx1);

    // 顺时针旋转的角度（以弧度计）
    let angle2 = angle1 - (d / r);

    // 计算新点的坐标
    let x2 = x0 + r * Math.cos(angle2);
    let y2 = y0 + r * Math.sin(angle2);

    return {
        x: x2,
        y: y2,
        deg: calculateDeg(x2, y2)
    };
}



// 根据角度获取坐标点
function getCoordByDeg(r, deg) {
    // 将角度转换为弧度
    const radian = 2 * Math.PI / 360 * deg

    let x = r * Math.sin(radian);
    let y = r * Math.cos(radian);

    return { x: x, y: y, deg };
}


/*
    input
    环形的半径，默认为最小尺寸，即以圆形铺满，
    起始位置的角度
        - 自适应对称
        - 正上方开始    
    换行文字已最外行为基准
*/



function createRoundText(container, options) {
    const {
        lineHeightPixelValue,
        letterSpacingPixelValue,
        textContent,
        radius, // 半径不直观，改为 弧度 或者 角度值
        startDeg = 0, 
        direction = 1,
        fitDeg // 填充角度，希望你的文字 占据多少角度 ， 多行情况好像有问题 ， 多行情况文字长度不统一 ， 所以只能用半径 , 半径应该考虑
    } = options

    var minRadius // 最小半径 

    container.innerHTML = ''

    const innerContainer = document.createElement('div')

    innerContainer.style.position = 'relative'

    // 文字单元格
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



    // 元素插入页面后再计算真实宽度
    textContentCells.forEach((row) => {
        row.forEach((item) => {
            // 由于获取真实尺寸，始终为像素值，所以需要把所有涉及到的单位统一为像素
            item.width = Number(window.getComputedStyle(item.el).width.slice(0, -2))
            item.height = Number(window.getComputedStyle(item.el).height.slice(0, -2))
        })
    })


    // 计算位置和角度
    textContentCells.forEach((row) => {

        // 外侧最小可能的周长
        const outerMinCircumference = row.reduce((a, b) => {
            return a + b.width + letterSpacingPixelValue
        }, 0)

        // 最小允许的半径
        minRadius = outerMinCircumference / (2 * Math.PI)

        const radius = minRadius 

        // 弧形的起始坐标
        let startPosition = getCoordByDeg(radius, 0)

        row.forEach((item, index) => {

            var distance = 0

            for (let i = 0; i <= index; i++) {
                let item = row[i - 1]
                if (item) {
                    distance += item.width
                }
            }



            let pos = calculatePoint(0, 0, radius, startPosition.x, startPosition.y, distance)

            item.x = pos.x
            item.y = pos.y
            item.deg = pos.deg

            item.el.style.left = item.x + 'px'
            item.el.style.bottom = item.y + 'px'
            item.el.style.transform = `rotate(${item.deg}deg)`
        })
    })

    console.log(textContentCells)
}