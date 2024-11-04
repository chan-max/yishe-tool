import { onUpdated, onMounted, watch, shallowRef, shallowReactive } from 'vue'
import Utils from '@/common/utils'
import { createTransformString } from '../helper'
/**
 * @description 用于所有子元素的渲染辅助方法
*/


/**
 * 在每个元素返回渲染node 时调用
*/
export function onBeforeReturnRender(paylaod) {
    processClipPath(paylaod)
    processTransform(paylaod)
}



/**
 * @method 处理当前元素的交互事件
*/

// 记录画布元素对应的 dom 元素 
const canvasChildDOMMap = shallowReactive({

})

function processBasicElEvent(payload) {
    let { targetEl, options } = payload;

    // 忽略该元素的事件处理

    watch(targetEl, (el) => {
        if (!el) {
            return
        }

        if (el._EventsReady) {
            return
        }

        el.style.cursor = 'pointer'

        // 为当前元素添加id，方便通过id 找到该元素
        el.id = options.id

        canvasChildDOMMap[options.id] = el

        el.onclick = (e) => {
            e.stopPropagation();
            console.log('click')
            currentOperatingCanvasChildId.value = options.id
        }

        el._EventsReady = true
    })
}

/**
 * 组件初始化时触发
*/
export function onCanvasChildSetup(payload) {
    processCalcComputedSize(payload)
    processBasicElEvent(payload)
}


/***
 * @description 计算尺寸
*/

function processCalcComputedSize(payload) {
    const { targetEl, options, props } = payload
    function setTargetSize() {

        if(!targetEl.value){
            return
        }

        props.options.targetComputedWidth = Utils.getComputedWidth(targetEl.value)
        props.options.targetComputedHeight = Utils.getComputedHeight(targetEl.value)
    }

    onUpdated(setTargetSize)
    onMounted(setTargetSize)
}


/**
 * 处理裁剪路径
*/

import { getClipPathCircleByPercentPosition, getClipPathEllipseByPercentPosition } from '@/components/design/layout/canvas/operate/clipPath/dragger.tsx'
import { currentOperatingCanvasChildId } from '..';
import { id } from 'element-plus/es/locale/index';
function processClipPath(payload) {
    let { style, options } = payload

    if (!options.clipPath) {
        return
    }


    if (options.clipPath.type == 'css') {
        style.clipPath = options.clipPath.cssValue
    }

    if (options.clipPath.type == 'url') {
        style.clipPath = `url(#${options.clipPath.url})`
    }

    // 自定义的裁剪
    if (options.clipPath.type == 'customCircle') {

    }

    if (options.clipPath.type == 'customEllipse') {
        style.clipPath = getClipPathEllipseByPercentPosition(options.clipPath)
    }

    if (options.clipPath.type == 'customCircle') {
        style.clipPath = getClipPathCircleByPercentPosition(options.clipPath)

    }
}


/**
 * @description 处理元素变形
*/



function processTransform(payload) {
    const { options, style } = payload
    style.transform = createTransformString(options.transform)
}