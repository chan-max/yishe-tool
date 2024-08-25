<template>
    <Dragger></Dragger>
</template>
    
<script setup lang='tsx'>
import { ref, onMounted, computed, onUpdated } from 'vue'

import { getPositionInfoFromOptions, getPositionLabelFromOptions, formatSizeOptionToPixelValue } from "@/components/design/layout/canvas/helper.tsx";
import { canvasStickerOptions, currentOperatingCanvasChild } from "@/components/design/layout/canvas/index.tsx";
import { Dragger } from './dragger.tsx'



/**
 * @description 由于裁剪是相对于当前元素的，所以不需要显示容器大小作为辅助
*/



onMounted(() => {
})











</script>
<style></style>