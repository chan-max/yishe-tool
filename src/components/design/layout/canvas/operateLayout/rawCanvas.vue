<template>
    <el-collapse v-model="rawCanvasCollapseActives">
        <el-collapse-item name="1" title="基础属性">
            <operateItemSize label="尺寸" v-model:width="currentOperatingCanvasChild.width"
                v-model:height="currentOperatingCanvasChild.height">
            </operateItemSize>
        </el-collapse-item>
        <el-collapse-item name="2">
            <template #title>
                <div class="title">通用属性</div>
            </template>
            <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
        </el-collapse-item>
    </el-collapse>
</template>
    
<script setup lang='ts'>
import { ref } from "vue";

import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue';

import {
    currentOperatingCanvasChild,
} from "../index.tsx";

const rawCanvasCollapseActives = ref(["1", "2", "3", "4", '5']);


</script>
    
<style></style>
