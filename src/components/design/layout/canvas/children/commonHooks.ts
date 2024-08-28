import { onUpdated, onMounted } from 'vue'
import Utils from '@/common/utils'
/**
 * @description 用于所有子元素的渲染辅助方法
*/


/**
 * 在每个元素返回渲染node 时调用
*/
export function onBeforeReturnRender(paylaod) {
    processClipPath(paylaod)
}


/**
 * 组件初始化时触发
*/
export function onSetup(payload) {
    processCalcComputedSize(payload)
}


/***
 * @description 计算尺寸
*/

function processCalcComputedSize(payload) {
    const { targetEl, options, props } = payload
    function setTargetSize() {
        props.options.targetComputedWidth = Utils.getComputedWidth(targetEl.value)
        props.options.targetComputedHeight = Utils.getComputedHeight(targetEl.value)
    }

    onUpdated(setTargetSize)
    onMounted(setTargetSize)
}


/**
 * 处理裁剪路径
*/

import { getClipPathCircleByPercentPosition } from '@/components/design/layout/canvas/operate/clipPath/dragger.tsx'
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

    if (options.clipPath.type == 'customCircle') {

    }

    if (options.clipPath.type == 'customCircle') {
        style.clipPath = getClipPathCircleByPercentPosition(options.clipPath)
    }
}