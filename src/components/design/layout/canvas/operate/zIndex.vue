<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 元素层级 </template>
        <template #content>
            <el-tooltip content="控制元素的堆叠顺序,值越大,层级越高" :hide-after="0">
                <el-input style="width:80px;" type="number" v-model="model" size="small" max="999" min="0" step="1"></el-input>
            </el-tooltip>
            <el-button size="small" @click="setTopZIndex" link> 设为最高 </el-button>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/z-index.svg?component";
import { ref } from 'vue'
import { canvasStickerOptions, currentOperatingCanvasChild, getCanvasTopZIndexChild } from "@/components/design/layout/canvas/index.tsx";

const props = defineProps({
    tooltip: {
        default: ''
    }
})



// 设置为最顶层的zIndex
function setTopZIndex() {
    let maxZIndex = getCanvasTopZIndexChild()?.zIndex || 0
    
    if (maxZIndex >= (currentOperatingCanvasChild.value.zIndex || 0)) {
        currentOperatingCanvasChild.value.zIndex = maxZIndex + 1
    }
}

const model = defineModel({})

</script>
  
<style></style>
  