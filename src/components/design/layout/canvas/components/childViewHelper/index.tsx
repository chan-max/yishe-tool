/**
 * @description 用于辅助查看当前元素
*/
import { ref, watch } from 'vue'

// 当前正在覆盖的选择元素
export const currentFocusingStickerId = ref()

const currentTargetElRect = ref({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
})



watch(currentFocusingStickerId, (id) => {
    if (!id) {
        return
    }

    let targetEl = document.querySelector(`#${id}`)

    if (!targetEl) {
        return
    }

    // 为当前元素生成一个遮罩层，替代高亮效果

    /**
     * @todo 这块可能会根据画布元素的宽高，对其进行裁剪，保证不会超出画布范围
    */

    const rect = targetEl.getBoundingClientRect();

    currentTargetElRect.value = {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
    }
})


export const ChildViewHelperComponent = () => {
    return currentFocusingStickerId.value ? <div style={{
        position: 'fixed',
        zIndex: 999,
        top: currentTargetElRect.value.top + 'px',
        left: currentTargetElRect.value.left + 'px',
        width: currentTargetElRect.value.width + 'px',
        height: currentTargetElRect.value.height + 'px',
        background: `rgba(115 , 0, 255, 0.2)`
    }}></div> : null
}
