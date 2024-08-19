<template>
    <div class="container flex flex-col items-center">
        <div ref="canvasContainerRef" @mousemove="mousemove" v-if="!showMainCanvas" v-loading="renderingLoading"
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

        <div class="flex" style="width:100%;padding:1rem;padding-top:2rem;column-gap:1rem;">

            <el-popover width="360px" trigger="click" :visible="stickerInfoVisible">
                <template #reference>
                    <el-button plain link @click="stickerInfoVisible = true">
                        <CloudUploadOutlined style="font-size:1.2em;margin-right:4px;" />
                        上传
                    </el-button>
                </template>
                <el-form label-width="72px" :inline-message="false" :show-message="false" label-position="left">
                    <el-form-item label="贴纸名称：">
                        <el-input v-model="stickerInfo.name" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="贴纸描述:">
                        <el-input type="textarea" v-model="stickerInfo.description" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="关键字:">
                        <tagsInput v-model="stickerInfo.keywords" :autocomplete-tags="stickerAutoplacementTags"
                            :autocomplete-width="400" autocompletePlacement="right"></tagsInput>
                    </el-form-item>
                    <el-form-item label="是否共享:">
                        <a-switch v-model:checked="stickerInfo.isPublic" checked-children="公开" un-checked-children="私密" />
                    </el-form-item>
                    <el-form-item>
                        <div class="flex w-full">
                            <el-button size="small" type="danger" plain @click="stickerInfoVisible = false">
                                关闭
                            </el-button>
                            <el-button size="small" class="w-full" plain @click="submit" :loading="loading">
                                保存
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-popover>

            <el-dropdown>
                <el-button link plain>
                    <LinkOutlined style="font-size:1.2em;margin-right:4px;" />
                    导出 PNG
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="exportPng"> 导出原始图 </el-dropdown-item>
                        <el-dropdown-item @click="exportTrimmedPng"> 自动去除空白边框 </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>



            <el-dropdown>
                <el-button link plain>
                    更多
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="removeAllChildren"> 移除所有子元素 </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>


            <div style="flex:1;"></div>
            <addPopover>
                <el-button type="primary" link>
                    <span>添加元素</span>
                </el-button>
            </addPopover>
        </div>
        <div style="width:100%;padding:1rem;">
            <div style="display:flex;column-gap:10px">
                <el-select v-model="currentOperatingCanvasChildIndex">
                    <template #label="{ label }">
                        <div style="font-size:1rem;"> {{ canvasChildLabelMap[currentOperatingCanvasChild.type] }} </div>
                    </template>
                    <el-option class="canvas-child-select-option" v-for="(item, index) in canvasStickerOptions.children"
                        :value="index" :label="canvasChildLabelMap[item.type]">
                        <div style="display:flex;align-items: center;font-size:1rem;height:100%;">
                            {{ canvasChildLabelMap[item.type] }}
                            <div style="flex:1"></div>
                            <el-button v-if="!item.undeletable" link type="danger" @click="remove(index)">
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
            <operateLayout></operateLayout>
        </div>
    </div>
</template>

<script setup lang="tsx">
import {
    CanvasController,
    canvasStickerOptions,
    addCanvasChild,
    removeCavnasChild,
    CanvasChildType,
    currentOperatingCanvasChildIndex,
    currentOperatingCanvasChild,
    showMainCanvas,
    canvasChildLabelMap,
    renderingLoading
} from "./index.tsx";

import operateLayout from './operateLayout/index.vue';
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";

import { Delete, Plus, DeleteFilled, CircleCloseFilled, Link, CirclePlusFilled, FullScreen } from '@element-plus/icons-vue'
import { StarOutlined, StarFilled, StarTwoTone, CloudUploadOutlined, LinkOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { useLoadingOptions } from "@/components/loading/index.tsx";
import addPopover from './addPopover.vue'
import dragTip from "./dragTip.vue";
import { useElementHover, useDebounceFn } from '@vueuse/core'
import Api from '@/api'
import { message } from "ant-design-vue";
import { useLoginStatusStore } from "@/store/stores/login";
import tagsInput from "@/components/design/components/tagsInput/tagsInput.vue";
import { stickerAutoplacementTags } from '@/components/design/components/tagsInput/index.ts'


const loginStore = useLoginStatusStore()

const canvasContainerRef = ref()

const stickerInfoVisible = ref(false)

const stickerInfo = ref({
    name: '',
    description: '',
    keywords: [],
    isPublic: false
})


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

let canvasController = new CanvasController({
    max: 320
});

let canvass = canvasController.getRender();

function exportPng() {
    canvasController.downloadPng();
}


/* 导出去除多余空白的图片 */
function exportTrimmedPng() {
    canvasController.downloadTrimmedPng();
}

function remove(index) {
    removeCavnasChild(index)
}


/*
    提交该贴纸
*/

const loading = ref(false)

async function submit() {

    loading.value = true

    try {
        const file = await canvasController.toPngFile()

        const cos = await Api.uploadToCOS({
            file: file
        })

        await Api.createStickerApi({
            thumbnail: cos.url,
            ...stickerInfo.value,
            keywords: stickerInfo.value.keywords.join(','),
            type: 'composition',
            meta: {
                data: canvasStickerOptions.value
            },
            uploaderId: loginStore.isLogin ? loginStore.userInfo.id : null
        })

        loading.value = false
        message.success('保存成功')
    } catch (e) {
        loading.value = false
        message.error('保存失败')
    }
}


function removeAllChildren() {
    canvasStickerOptions.value.children = [canvasStickerOptions.value.children[0]]
}
</script>

<style lang="less" scoped>
:deep(.el-form-item) {
    margin-bottom: 8px;
}

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

.label {
    line-height: 22px;
}
</style>
