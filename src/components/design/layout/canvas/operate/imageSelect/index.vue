<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> {{ label }} </template>
        <template #content>
            <template v-if="model">
                <el-popover placement="right" popper-class="el-popover-operation" width="240">
                    <template #reference>
                        <div class="flex items-center">
                            <div class="text-ellipsis" style="font-size:1rem;max-width: 180px;">已引用图片 : {{ model.name }}
                            </div>
                        </div>
                    </template>
                    <el-row align="middle" justify="center" style="row-gap: 1rem;">
                        <el-col :span="24">
                            <div class="flex justify-center">
                                <desimage @load="imgLoad" ref="imgRef" style="width:100px;height:100px;" :src="model.url"
                                    :lazy="false">
                                </desimage>
                            </div>
                        </el-col>

                        <el-col :span="24">
                            <el-button @click="syncCanvasSize" size="small" style="width:100%;">
                                将画布尺寸设为该图片尺寸
                            </el-button>
                        </el-col>
                        <el-col :span="24">
                            <el-button @click="remove" size="small" type="danger" :icon="Close" style="width:100%;">
                                移除图片
                            </el-button>
                        </el-col>
                    </el-row>
                </el-popover>
            </template>
            <template v-else>
                <el-button size="small" link @click="select"> 选择图片 </el-button>
            </template>
        </template>
    </operate-form-item>

    <modal v-model="dialogShow" @close="dialogShow = false"></modal>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'
import icon from "@/components/design/assets/icon/background-image.svg?component";
import { showSticker, viewDisplayController } from "@/components/design/store";
import { Close } from '@element-plus/icons-vue'
import desimage from "@/components/image.vue";
import modal from './modal.vue';

import {
    updateCanvasStickerOptionsUnit
} from '@/components/design/layout/canvas/helper'

import {
    canvasStickerOptions
} from '@/components/design/layout/canvas/index'



const model = defineModel({})


const props = defineProps({
    label: {
        default: '选择图片'
    }
})

/*
    增加按图片尺寸调整画布尺寸功能
*/

const dialogShow = ref(false)

function select() {
    dialogShow.value = true
}

function remove() {
    model.value = null
}


function imgLoad() {
}

/*
    将当前画布尺寸同步为当前图片尺寸，
    适用于处理单个图片的形式
*/

const imgRef = ref()

function syncCanvasSize() {
    let { width, height } = imgRef.value.getNaturalSize()


    canvasStickerOptions.value.width = width
    canvasStickerOptions.value.height = height
    updateCanvasStickerOptionsUnit('px')
}

</script> 
    
<style></style>