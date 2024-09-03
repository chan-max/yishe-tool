<template>
    <div id="basic-canvas-canvas-container" v-if="show">
        <div ref="panzoomRef">
            <canvass></canvass>
        </div>

        <div class="top-menu-containter">
            <div class="top-menu">
                <div style="flex:1;"></div>
                <div v-if="loading" class="italic font-bold"> 正在渲染贴纸... </div>
                <div>
                    宽 {{ canvasStickerOptions.width }}{{ canvasStickerOptions.unit }} 高 {{ canvasStickerOptions.height }}{{
                        canvasStickerOptions.unit }}
                </div>
                <el-button type="danger" link @click="showMainCanvas = false">
                    <el-icon size="24">
                        <CircleCloseFilled></CircleCloseFilled>
                    </el-icon>
                </el-button>
            </div>
        </div>

    </div>
</template>
  
<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { CanvasController, showMainCanvas, canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'
import { useLoadingOptions } from "@/components/loading/index.tsx";
import { Delete, Plus, DeleteFilled, CircleCloseFilled, Link, CirclePlusFilled, FullScreen } from '@element-plus/icons-vue'
import { showCanvasLayout } from '@/components/design/store.ts';
import panzoom from 'panzoom'
import Utils from '@/common/utils'


const panzoomRef = ref()

let canvasController = new CanvasController({
    max: 320
});

const loading = computed(() => {
    return canvasController.loading.value;
});

let canvass = canvasController.getRender();

let show = computed(() => {
    return showMainCanvas.value && showCanvasLayout.value
})

watch(show, async (val) => {

    await Utils.sleep(33)

    if (val && panzoomRef.value) {
        panzoom(panzoomRef.value, {
            smoothScroll: false,
            maxZoom: 2,
            minZoom: .5
        })

        // // 当缩放尺寸过小，会导致子元素不显示
        // const panzoom = Panzoom(panzoomRef.value, {
        //     maxScale: 5
        // })
        // panzoomRef.value.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)

    }
}, {
    immediate: true,
})



</script>
  
<style scoped lang="less">
#basic-canvas-canvas-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    border: 1px solid #eee;
    position: relative;
    overflow: hidden;

    * {
        flex-shrink: 0;
    }
}

.top-menu-containter {
    position: absolute;
    right: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
}

.top-menu {
    background-color: #fff;
    border-radius: 16px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
    margin: 1rem;
    display: flex;
    width:90%;
    min-width:480px;
    flex-shrink:0;
    align-items: center;
    column-gap: 2rem;
    padding: 1rem 2rem;
}
</style>
  