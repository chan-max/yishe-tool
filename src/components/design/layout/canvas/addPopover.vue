<template>
    <el-popover trigger="click" width="260">
        <div class="addchild">
            <el-button size="small" @click="add('text')" round> 文字 </el-button>
            <el-button size="small" @click="add('image')" round> 图片 </el-button>
            <el-button size="small" @click="add('qrcode')" round> 二维码 </el-button>
            <el-button size="small" @click="add('barcode')" round> 条形码 </el-button>
            <el-button size="small" @click="add('stamp')" round> 印章 </el-button>
            <el-button size="small" @click="add('background')" round> 背景 </el-button>
            <el-button size="small" @click="add('border')" round> 边框 </el-button>
            <el-button size="small" @click="addRect" round> 矩形 </el-button>
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
    canvasOptions,
    addCanvasChild,
    removeCavnasChild,
    currentOperatingCanvasChildIndex,
    currentOperatingCanvasChild,
    showMainCanvas
} from "./index.tsx";


function addRect() {
    currentOperatingCanvasChildIndex.value = addCanvasChild({
        type: 'rect',

    });
    document.body.click();
}


function add(type) {
    currentOperatingCanvasChildIndex.value = addCanvasChild({
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