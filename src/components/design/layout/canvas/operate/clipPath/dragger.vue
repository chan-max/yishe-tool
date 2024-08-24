<template>
    <div :style="{ width: size + 'px', height: size + 'px' }" class="flex items-center justify-center">
        <div ref="draggerContainerRef" :style="containerStyle">
            <div ref="draggerRef" style="width:20px;height:20px;background:red;">dafd</div>
        </div>
    </div>
</template>
    
<script setup lang='tsx'>
import { ref, onMounted, computed } from 'vue'
import Draggabilly from 'draggabilly'
import { getPositionInfoFromOptions, getPositionLabelFromOptions, formatSizeOptionToPixelValue } from "@/components/design/layout/canvas/helper.tsx";
import { canvasStickerOptions, currentOperatingCanvasChild } from "@/components/design/layout/canvas/index.tsx";

const draggerContainerRef = ref()
const draggerRef = ref()

/**
 * @description 由于裁剪是相对于当前元素的，所以不需要显示容器大小作为辅助
*/


type ClipPathModelType = {

}

const size = ref(280)

const containerStyle = computed(() => {

    if (!currentOperatingCanvasChild.value) {
        return
    }

    let operatingChildWidth = currentOperatingCanvasChild.value.targetComputedWidth
    let operatingChildHeight = currentOperatingCanvasChild.value.targetComputedHeight

    let aspect = operatingChildWidth / operatingChildHeight

    if (aspect > 1) {
        return {
            background: 'rgba(155,0,255,0.3)',
            width: size.value + 'px',
            height: size.value / aspect + 'px'
        }
    } else {
        return {
            background: 'rgba(155,0,255,0.3)',
            width: size.value * aspect + 'px',
            height: size.value + 'px',
        }
    }
})



onMounted(() => {
    var draggie: any = new Draggabilly(draggerRef.value, {
        containment: true,
    });

    draggie.on('dragMove', (event, pointer) => {
        let container = draggerContainerRef.value
        let draggableElem = draggerRef.value
        // 获取容器的边界
        var containerRect = container.getBoundingClientRect();
        var draggableRect = draggableElem.getBoundingClientRect();

        // 计算相对位置
        var relativeX = draggableRect.left - containerRect.left;
        var relativeY = draggableRect.top - containerRect.top;

        // 计算百分比位置
        var percentX = (relativeX / (containerRect.width - draggableRect.width)) * 100;
        var percentY = (relativeY / (containerRect.height - draggableRect.height)) * 100;

        // 输出百分比位置
        console.log(`Relative Position: ${percentX.toFixed(2)}%, ${percentY.toFixed(2)}%`);
    })
})



</script>
<style></style>