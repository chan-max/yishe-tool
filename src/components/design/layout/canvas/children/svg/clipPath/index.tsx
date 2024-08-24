import Utils from '@/common/utils'

/**
 * @description 定义通用的 裁剪路径
*/




type CustomClipPath = {
    type: CustomClipPathType
    id,
    label,
    cssValue,
    previewBackground?
}

enum CustomClipPathType {
    CSS = 'css', // css 属性值
    URL = 'url' // 引用外部
}

/**
 * @description 圆形
*/



const circleClipPath = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'circle',
    label: '圆形',
    cssValue: `circle(50% at 50% 50%)`
}


const triangle = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'triangle',
    label: '三角',
    cssValue: `polygon(50% 0%, 0% 100%, 100% 100%)`
}

const ellipse = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'ellipse',
    label: '椭圆',
    cssValue: `ellipse(25% 50% at 50% 50%)`
}


/**
 * 填充满
*/
const ellipseFill = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'ellipse-fill',
    label: '圆形铺满',
    cssValue: `ellipse(50% 50% at 50% 50%)`
}



const trapezoid = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'trapezoid',
    label: '梯形',
    cssValue: `polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)`
}

const parallelogram = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'parallelogram',
    label: '平行四边形',
    cssValue: `polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)`
}


const rhombus = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'rhombus',
    label: '内四边形',
    cssValue: `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`
}

const pentagon = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'pentagon',
    label: '五边形',
    cssValue: `polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)`
}

const hexagon = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'hexagon',
    label: '六边形',
    cssValue: `polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)`
}


const heptagon = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'heptagon',
    label: '七边形',
    cssValue: `polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)`
}

const octagon = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'octagon',
    label: '八边形',
    cssValue: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
}


const nonagon = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'nonagon',
    label: '九边形',
    cssValue: 'polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)'
}


const decagon = {
    type: CustomClipPathType.CSS,
    url: null,
    id: 'decagon',
    label: '十边形',
    cssValue: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)'
}



const close = {
    type: CustomClipPathType.CSS,
    id: 'close',
    label: '关闭',
    cssValue: `polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)`
}


const message = {
    type: CustomClipPathType.CSS,
    id: 'clmemessagessageose',
    label: '消息框',
    cssValue: `polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)`
}


const leftArrow = {
    type: CustomClipPathType.CSS,
    id: 'leftArrow',
    label: '左箭头',
    cssValue: `polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)`
}

const rightArrow = {
    type: CustomClipPathType.CSS,
    id: 'rightArrow',
    label: '右箭头',
    cssValue: `polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)`
}


const diamond = {
    type: CustomClipPathType.CSS,
    id: 'diamond',
    label: '钻石',
    cssValue: 'polygon(50% 0,100% 25%,50% 100% ,0 25%)'
}

const squareDiamond = {
    type: CustomClipPathType.CSS,
    id: 'square-diamond',
    label: '方形钻石',
    cssValue :`polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)`
}


export const builtInClipPathList = [
    circleClipPath,
    triangle,
    ellipse,
    ellipseFill,
    trapezoid,
    parallelogram,
    rhombus,
    pentagon,
    hexagon,
    heptagon,
    octagon,
    nonagon,
    decagon,
    close,
    message,
    leftArrow,
    rightArrow,
    diamond,
    squareDiamond
]




/**
 * @description 分配一个随机颜色
*/
builtInClipPathList.forEach((item: CustomClipPath) => {
    item.previewBackground = Utils.color.randomColor({
        format: 'rgba',
        alpha: 1,
        luminosity: 'light',
    })
})


export function createCircleClipPath() {
    /**
     * @description 当目标不为圆形时，裁剪的半径为 sqrt(w² + h²)/sqrt(2)
    */
    return `circle(50% at 50% 50%)`
}








export const SvgClipPathComponent = () => {
    return <>
        <svg id="define-clippath" width="0" height="0">
            <defs>
            </defs>
        </svg>
    </>
}



