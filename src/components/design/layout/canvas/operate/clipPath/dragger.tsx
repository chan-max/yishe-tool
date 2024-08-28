import { ref, computed, onMounted, watch, nextTick, defineComponent, defineEmits } from 'vue'
import { getPositionInfoFromOptions, getPositionLabelFromOptions, formatSizeOptionToPixelValue } from "@/components/design/layout/canvas/helper.tsx";
import { canvasStickerOptions, currentOperatingCanvasChild } from "@/components/design/layout/canvas/index.tsx";
import Draggabilly from 'draggabilly'
import './dragger.less'
import Utils from '@/common/utils'

/**
 * 自定义裁剪路径的类型 
*/


export enum CustomClipPathType {
    Circle = 'circle', // 普通圆形，需要两个点
    Ellipse = 'ellipse', // 需要三个点
    Polgyon = 'polgyon', // 普通多边形
    SvgClipPath = 'svg-clip-path', // 使用svg的高级路径
}




const activeCustomClipPathType = ref(CustomClipPathType.Ellipse)


class DragPoint {

    type: CustomClipPathType = null

    ref = ref()

    color = Utils.color.randomColor({
        format: 'rgba',
        alpha: 1,
        luminosity: 'light',
    })

    isDragging = ref(false)

    axis = null

    // 像素的位置
    position = ref({
        top: 0,
        left: 0
    })

    percentPosition = ref({
        top: 0,
        left: 0
    })

    constructor() {
    }

    // 拖拽点位置发生变化时触发
    onPositionChange = null

    draggie = null


    // 设置其百分比
    async setInitialPosition({
        left,
        top
    }) {
        this.position.value = {
            left,
            top
        }

        await Utils.sleep(0)
        this.ref.value.style.top = top + 'px'
        this.ref.value.style.left = left + 'px'
    }

    initDraggPoint() {
        if (!this.ref.value || !dragContainerRef.value) {
            return
        }
        var draggie = new Draggabilly(this.ref.value, {
            containment: true,
            axis: this.axis
        });


        draggie.on('dragMove', async (event, pointer) => {
            let container = dragContainerRef.value
            let draggableElem = this.ref.value
            // 获取容器的边界
            var containerRect = container.getBoundingClientRect();
            var draggableRect = draggableElem.getBoundingClientRect();

            // 计算相对位置
            var relativeX = draggableRect.left - containerRect.left
            var relativeY = draggableRect.top - containerRect.top

            this.position.value.left = Number(relativeX.toFixed(2))
            this.position.value.top = Number(relativeY.toFixed(2))

            if (typeof this.onPositionChange == 'function') {
                typeof this.onPositionChange.call(this)
            }
        })

        draggie.on('dragStart', (event, pointer) => {
            this.isDragging.value = true
        })

        draggie.on('dragEnd', (event, pointer) => {
            this.isDragging.value = false
        })

        this.draggie = draggie
    }


    render() {

        return <div class="drag-point" ref={this.ref} style={{
            width: dragPointSize.value + 'px',
            height: dragPointSize.value + 'px',
            position: 'absolute',
            // background: this.color,
            borderRadius: '999px',
            border: `4px solid ${this.color}`,
        }}>
        </div>
    }
}


/* 拖拽容器 */
const dragContainerRef = ref()


/**
 * @description 
*/

export const Dragger = defineComponent({
    setup(props, ctx) {


        let mixins = {
            [CustomClipPathType.Circle]: circleSetupMixin,
            [CustomClipPathType.Ellipse]: ellipseSetupMixin,
            [CustomClipPathType.Polgyon]: polgyonSetupMixin,
        }


        const { isDragging, clipPathCssValue, slot } = mixins[activeCustomClipPathType.value].call(null, props, ctx)




        return () => {

            const {
                width, height, containerWidth, containerHeight
            } = dragConfigStyle.value


            return <div class="flex items-center justify-center w-full h-full">
                <div class="flex items-center justify-center relative" ref={dragContainerRef} style={{ width: containerWidth + 'px', height: containerHeight + 'px', cursor: isDragging.value ? 'grabbing' : 'grab', }}  >
                    <div style={{ width, height, }} class='png-background'>
                        <div style={{ width: width + 'px', height: height + 'px', background: `rgba(115,0,255,.2)`, clipPath: clipPathCssValue.value }}>
                        </div>
                    </div>
                    <>
                        {slot()}
                    </>
                </div>
            </div>
        }
    }
})



/**
 * 模拟当前拖拽点
*/
const dragPointSize = ref(20)

/**
 * 模拟当前画布的最大尺寸
*/
const size = ref(300)



const dragConfigStyle = computed(() => {

    if (!currentOperatingCanvasChild.value) {
        return
    }

    let operatingChildWidth = currentOperatingCanvasChild.value.targetComputedWidth
    let operatingChildHeight = currentOperatingCanvasChild.value.targetComputedHeight

    let aspect = operatingChildWidth / operatingChildHeight


    if (aspect > 1) {
        return {
            width: size.value,
            height: size.value / aspect,
            containerWidth: size.value + dragPointSize.value,
            containerHeight: size.value / aspect + dragPointSize.value,
        }
    } else {
        return {
            width: size.value * aspect,
            height: size.value,
            containerWidth: size.value * aspect + dragPointSize.value,
            containerHeight: size.value + dragPointSize.value
        }
    }
})



function circleSetupMixin(props, ctx) {
    // 可推拽的点

    var circleCenter
    var circlePoint


    var clipPathCssValue = ref()

    // 两个点

    circleCenter = new DragPoint()
    circleCenter.type = CustomClipPathType.Circle
    circlePoint = new DragPoint()
    circlePoint.type = CustomClipPathType.Circle

    // 设置点的初始位置
    // 点位发生变化


    // 
    const isDragging = computed(() => {
        return circleCenter.isDragging.value || circlePoint.isDragging.value
    })

    onMounted(() => {

        const { width, height } = dragConfigStyle.value

        circleCenter.initDraggPoint()
        circlePoint.initDraggPoint()

        circleCenter.setInitialPosition({
            left: '100',
            top: '100',
        })
        circlePoint.setInitialPosition({
            left: '10',
            top: '10'
        })


        watch([circleCenter.position, circlePoint.position], () => {

            let { width, height } = dragConfigStyle.value


            let centerLeft = circleCenter.position.value.left / width
            let centerTop = circleCenter.position.value.top / height
            let pointLeft = circlePoint.position.value.left / width
            let pointTop = circlePoint.position.value.top / height

            // 这里转换为百分比
            clipPathCssValue.value = getClipPathCircleByPercentPosition({ centerLeft, centerTop, pointLeft, pointTop })

            // 保存裁剪路径的时候始终保存百分比

            let clipPathModelValue = {
                type: 'customCircle',
                centerLeft,
                centerTop,
                pointLeft,
                pointTop
            }

            ctx.emit('change', clipPathModelValue)

        }, {
            // immediate: true, 不在使用watch初始化
            deep: true,
        })
    })



    return {
        isDragging,
        clipPathCssValue,

        slot: () => {
            return <>
                {circleCenter.render()}
                {circlePoint.render()}
            </>
        }
    }
}





function ellipseSetupMixin(props, ctx) {

    var ellipseCenter
    var ellipseHorizontal
    var ellipseVertical
    var clipPathCssValue = ref()


    ellipseCenter = new DragPoint()
    ellipseCenter.type = CustomClipPathType.Circle
    ellipseHorizontal = new DragPoint()
    ellipseHorizontal.type = CustomClipPathType.Circle
    ellipseHorizontal.axis = 'x'
    ellipseVertical = new DragPoint()
    ellipseVertical.type = CustomClipPathType.Circle
    ellipseVertical.axis = 'y'

    // 设置点的初始位置


    // 
    const isDragging = computed(() => {
        return ellipseCenter.isDragging.value || ellipseHorizontal.isDragging.value || ellipseVertical.isDragging.value
    })

    onMounted(() => {

        let { width, height, containerWidth, containerHeight } = dragConfigStyle.value

        ellipseCenter.initDraggPoint()
        ellipseHorizontal.initDraggPoint()
        ellipseVertical.initDraggPoint()

        ellipseCenter.setInitialPosition({
            left: 0,
            top: 0,
        })
        ellipseHorizontal.setInitialPosition({
            left: 0,
            top: 0
        })

        ellipseVertical.setInitialPosition({
            left: 0,
            top: 0
        })


        watch([ellipseCenter.position, ellipseHorizontal.position, ellipseVertical.position], () => {

            // let { width, height } = dragConfigStyle.value


            // let centerLeft = circleCenter.position.value.left / width
            // let centerTop = circleCenter.position.value.top / height
            // let pointLeft = circlePoint.position.value.left / width
            // let pointTop = circlePoint.position.value.top / height

            // // 这里转换为百分比
            // clipPathCssValue.value = getClipPathCircleByPercentPosition({ centerLeft, centerTop, pointLeft, pointTop })

            // // 保存裁剪路径的时候始终保存百分比

            // let clipPathModelValue = {
            //     type: 'customEllipse',
            //     centerLeft,
            //     centerTop,
            //     pointLeft,
            //     pointTop
            // }

            // ctx.emit('change', clipPathModelValue)

        }, {
            // immediate: true, 不在使用watch初始化
            deep: true,
        })
    })



    return {
        isDragging,
        clipPathCssValue,

        slot: () => {
            return <>
                {ellipseCenter.render()}
                {ellipseHorizontal.render()}
                {ellipseVertical.render()}
            </>
        }
    }
}

function polgyonSetupMixin() {

}


export function getClipPathCircleByPercentPosition({ centerLeft, centerTop, pointLeft, pointTop }) {

    // if (!centerLeft || !centerTop || !pointLeft || !pointTop) {
    //     return null
    // }


    const radius = Math.sqrt(Math.pow(pointLeft - centerLeft, 2) + Math.pow(pointTop - centerTop, 2));

    return `circle(${radius * 100}% at ${centerLeft * 100}% ${centerTop * 100}%)`;
}