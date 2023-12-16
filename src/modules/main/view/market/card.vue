<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-16 22:44:34
 * @FilePath: /1s/src/modules/main/view/market/card.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
    <div class="market-card">
        <div  class="market-card-main"  @mouseenter="mouseenter" @mouseleave="mouseleave">
            <div class="market-card-main-img">
            <el-image v-if="showImg" fit="cover" :src="props.model.preview_img" draggable="false">
                <template #placeholder>
                    loading
                </template>
                <template #error>
                    <span style="font-weight: bold;color:#ddd;">加载失败</span>
                </template>
            </el-image>
            </div>
            <div class="market-card-main-viewer">
                <gltf-viewer v-if="showViewer" :model="props.model.modelInfo" @load="load"></gltf-viewer>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps,ref } from 'vue';
import gltfViewer from '@/components/model/gltfViewer/index.vue';
const props = defineProps(['model'])

const showImg = ref(true)

const showViewer = ref(false)

function mouseenter() {
    showViewer.value = true
}

function mouseleave(){
    showViewer.value = false
    showImg.value = true
}

function load(){
    showImg.value = false
}

</script>
<style>
.market-card{
    width: 330px;
    height: 280px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #eee;
    /* box-shadow: 0 1px 8px rgba(0,0,0,.08); */
    display: flex;
    justify-content: space-between;
    align-items: center;
    display: flex;
    flex-direction: column;
}

.market-card-main{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    .el-image{
        width: 100%;
        height: 100%;
    }
}



.market-card-main-img{
    position: absolute;
    width: 100%;
    height: 100%;
}

.market-card-main-viewer{
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>