import { ref, computed, onMounted, watch, nextTick, defineComponent } from 'vue'
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




const activeCustomClipPathType = ref(CustomClipPathType.Circle)


class DragPoint {

    type: CustomClipPathType = null

    ref = ref()

    color = Utils.color.randomColor({
        format: 'rgba',
        alpha: 1,
        luminosity: 'dark',
    })

    isDragging = ref(false)

    position = ref({
        top: 0,
        left: 0
    })

    constructor({
        type
    }) {
        this.type = type
    }

    initDraggPoint() {

        if (!this.ref.value || !dragContainerRef.value) {
            return
        }

        var draggie: any = new Draggabilly(this.ref.value, {
            containment: true,
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

            // 计算百分比位置
            var percentX = (relativeX / (containerRect.width - draggableRect.width)) * 100;
            var percentY = (relativeY / (containerRect.height - draggableRect.height)) * 100;

            // 输出百分比位置

            this.position.value.left = Number(percentX.toFixed(2))
            this.position.value.top = Number(percentY.toFixed(2))

            console.log(`Relative Position: ${percentX.toFixed(2)}%, ${percentY.toFixed(2)}%`);
        })

        draggie.on('dragStart', (event, pointer) => {
            this.isDragging.value = true
        })

        draggie.on('dragEnd', (event, pointer) => {
            this.isDragging.value = false
        })
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

export const Dragger = defineComponent({
    setup() {

        var points

        if (activeCustomClipPathType.value == CustomClipPathType.Circle) {
            // 两个点
            points = [
                new DragPoint({
                    type: CustomClipPathType.Circle,
                }),
                new DragPoint({
                    type: CustomClipPathType.Circle,
                })
            ]
        }


        // 
        const isDragging = computed(() => {
            return points.some((p) => p.isDragging.value)
        })

        onMounted(() => {
            points.forEach((p) => p.initDraggPoint())
        })

        return () => {

            const {
                width, height, containerWidth, containerHeight, background
            } = style.value

            return <div ref={dragContainerRef} style={{ width: containerWidth, height: containerHeight, cursor: isDragging.value ? 'grabbing' : 'grab' }} class="flex items-center justify-center relative" >

                <div style={{ width, height, background }}>
                </div>
                <>
                    {points.map((p) => p.render.call(p))}
                </>
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
const size = ref(280)



const style = computed(() => {

    if (!currentOperatingCanvasChild.value) {
        return
    }

    let operatingChildWidth = currentOperatingCanvasChild.value.targetComputedWidth
    let operatingChildHeight = currentOperatingCanvasChild.value.targetComputedHeight

    let aspect = operatingChildWidth / operatingChildHeight

    const background = `rgba(115,0,255,.1)`

    if (aspect > 1) {
        return {
            background: background,
            width: size.value + 'px',
            height: size.value / aspect + 'px',
            containerWidth: size.value + dragPointSize.value + 'px',
            containerHeight: size.value / aspect + dragPointSize.value + 'px',
        }
    } else {
        return {
            background: background,
            width: size.value * aspect + 'px',
            height: size.value + 'px',
            containerWidth: size.value * aspect + dragPointSize.value + 'px',
            containerHeight: size.value + dragPointSize.value + 'px'
        }
    }
})