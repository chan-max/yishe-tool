<template>
    <div class="container flex flex-col items-center">
        <div v-loading="loading" v-bind="loadingOptions" style="
        width: 320px;
        height: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px;
      ">
            <canvass></canvass>
        </div>
        <div style="width:100%;padding:1em;">
            <el-button-group link style="width: 100%; display: flex; overflow: auto">
                <el-popover trigger="click" width="260">
                    <div class="addchild">
                        <el-button size="small" @click="add('text')" round> 文字 </el-button>
                        <el-button size="small" @click="add('image')" round> 图片 </el-button>
                        <el-button size="small" @click="add('qrcode')" round> 二维码 </el-button>
                        <el-button size="small" @click="add('barcode')" round> 条形码 </el-button>
                        <el-button size="small" @click="add('stamp')" round> 印章 </el-button>
                        <el-button size="small" @click="add('background')" round> 背景 </el-button>
                        <el-button size="small" @click="add('border')" round> 边框 </el-button>
                        <div style="flex: 1"></div>
                    </div>
                    <template #reference>
                        <el-button type="primary" style="flex: 1" plain>
                            添加元素 {{ canvasOptions.children.length }}
                        </el-button>
                    </template>
                </el-popover>
                <el-button type="primary" plain>
                    上传
                </el-button>
                <el-button @click="exportPng" type="primary" plain> 导出 png </el-button>
            </el-button-group>
        </div>
        <div class="operate">
            <operate></operate>
        </div>
    </div>
</template>

<script setup lang="tsx">
import {
    CanvasController,
    canvasOptions,
    addCanvasChild,
    removeCavnasChild,
    getCanvasChildLabel,
    currentOperatingCanvasChildIndex,
    showMainCanvas
} from "./index.tsx";

import operate from './operate.vue';
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
import { useLoadingOptions } from "@/components/loading/index.tsx";




const loadingOptions = useLoadingOptions();

let cc = new CanvasController();

function exportPng() {
    cc.downloadPng();
}

let canvass = cc.getRender({ max: 320 });

const loading = computed(() => {
    return cc.loading.value;
});

function add(type) {
    currentOperatingCanvasChildIndex.value = addCanvasChild({
        type: type,
    });
    document.body.click();
}


</script>

<style lang="less" scoped>
.container {
    width: 340px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.operate {
    flex: 1;
    width: 100%;
    overflow: auto;
}

.title {
    font-size: 1rem;
    font-weight: bold;
}

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
