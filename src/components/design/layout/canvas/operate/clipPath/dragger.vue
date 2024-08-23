<template>
    <div style="width:240px;height:240px;" ref="draggerContainerRef">
        <div ref="draggerRef" style="width:20px;height:20px;background:red;">dafd</div>
    </div>
</template>
    
<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import Draggabilly from 'draggabilly'

const draggerContainerRef = ref()

const draggerRef = ref()

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