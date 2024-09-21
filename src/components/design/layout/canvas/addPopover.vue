<template>
    <el-popover trigger="click" width="260">
        <div class="addchild">
            <template v-for="v, k in canvasChildLabelMap">
                <el-button  v-if="k !== 'canvas'" size="small" @click="add(k)" round> {{ v }} </el-button>
            </template>
      
            <div style="flex: 1"></div>
        </div>
        <template #reference>
            <slot></slot>
        </template>
    </el-popover>
</template>

<script setup lang='ts'>
import {
    CanvasController,
    addCanvasChild,
    removeCavnasChild,
    currentOperatingCanvasChild,
    showMainCanvas,
    canvasChildLabelMap
} from "./index.tsx";


function add(type) {
    addCanvasChild({
        type: type,
    });
    document.body.click();
}
</script>

<style lang="less" scoped>
.addchild {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: .8em 0.4em;

    :deep(.el-button + .el-button) {
        margin-left: 0;
    }
}
</style>