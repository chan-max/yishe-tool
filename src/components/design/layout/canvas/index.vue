<template>
    <div class="container flex flex-col items-center">
        <div ref="canvasContainerRef" @mousemove="mousemove" v-if="!showMainCanvas" v-loading="loading"
            v-bind="loadingOptions" class="canvas-container">
            <canvass></canvass>
            <drag-tip v-if="showDragTip"></drag-tip>
            <div class="canvas-container-bottom-menu">
                <div style="flex:1"></div>
                <el-tooltip :hide-after="0" content="小画布始终展示等比缩放的尺寸，大画布可以显示真实尺寸">
                    <el-button @click="showMainCanvas = true" :icon="FullScreen" type="info" text bg round size="small">
                        <span>大画布显示</span>
                    </el-button>
                </el-tooltip>
            </div>
        </div>

        <div class="flex" style="width:100%;padding:1rem;padding-top:2rem;">

            <el-button plain link>
                <CloudUploadOutlined style="font-size:1.2em;margin-right:4px;" />
                上传
            </el-button>
            <el-button link @click="exportPng" plain>
                <LinkOutlined style="font-size:1.2em;margin-right:4px;" />
                导出 PNG
            </el-button>
            <el-button link plain>
                更多
            </el-button>
            <div style="flex:1;"></div>
            <el-button link plain type="danger">
                最近删除
            </el-button>
            <addPopover>
                <el-button type="primary" link>
                    <span>添加元素</span>
                </el-button>
            </addPopover>
        </div>
        <div style="width:100%;padding:0 1em;">
            <div style="display:flex;column-gap:10px">
                <el-select v-model="currentOperatingCanvasChildIndex">
                    <template #label="{ label }">
                        <div style="font-size:1rem;"> {{ canvasChildLabelMap[currentOperatingCanvasChild.type] }} </div>
                    </template>
                    <el-option class="canvas-child-select-option" v-for="(item, index) in canvasOptions.children"
                        :value="index" :label="canvasChildLabelMap[item.type]">
                        <div style="display:flex;align-items: center;font-size:1rem;height:100%;">
                            {{ canvasChildLabelMap[item.type] }}
                            <div style="flex:1"></div>
                            <el-button v-if="index != 0" link type="danger" @click="remove(index)">
                                <el-icon size="14">
                                    <CircleCloseFilled></CircleCloseFilled>
                                </el-icon>
                            </el-button>
                        </div>
                    </el-option>
                </el-select>
            </div>

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
    CanvasChildType,
    currentOperatingCanvasChildIndex,
    currentOperatingCanvasChild,
    showMainCanvas,
    canvasChildLabelMap
} from "./index.tsx";

import operate from './operate.vue';
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";

import { Delete, Plus, DeleteFilled, CircleCloseFilled, Link, CirclePlusFilled, FullScreen } from '@element-plus/icons-vue'
import { StarOutlined, StarFilled, StarTwoTone, CloudUploadOutlined, LinkOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { useLoadingOptions } from "@/components/loading/index.tsx";
import addPopover from './addPopover.vue'
import dragTip from "./dragTip.vue";
import { useElementHover, useDebounceFn } from '@vueuse/core'

const canvasContainerRef = ref()


const showDragTip = computed(() => {
    return isHovered.value && !mouseMovedRecent.value
})

const isHovered = useElementHover(canvasContainerRef, {
    delayEnter: 0
})

// 鼠标最近是否移动
const mouseMovedRecent = ref(false)
const mouseMoveTimer = ref()
const mousemove = function () {
    mouseMovedRecent.value = true
    clearTimeout(mouseMoveTimer.value)
    mouseMoveTimer.value = setTimeout(() => {
        console.log('timeout')
        mouseMovedRecent.value = false
    }, 3000);
}




const loadingOptions = useLoadingOptions({
});

let cc = new CanvasController({
    max: 320
});

let canvass = cc.getRender();

function exportPng() {
    cc.downloadPng();
}



const loading = computed(() => {
    return cc.loading.value;
});

function remove(index) {
    removeCavnasChild(index)
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

.canvas-container {
    width: 320px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    position: relative;
    overflow: hidden;

    // &:hover {

    //     .canvas-container-bottom-menu {
    //         bottom: 0px;
    //     }
    // }
}

.canvas-container-bottom-menu {
    width: 100%;
    height: 48px;
    position: fixed;
    padding: 0 1rem;
    background: linear-gradient(0deg, rgba(0, 0, 0, .2) 0%, rgba(255, 255, 255, 0) 100%);
    position: absolute;
    // bottom: -48px;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all .2s;
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
</style>
