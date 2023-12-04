<template>
    <div class="market-card">
        <div  class="market-card-main"  @mouseenter="mouseenter" @mouseleave="mouseleave">
            <div class="market-card-main-img">
            <el-image v-if="showImg" fit="cover" :src="props.model.img" draggable="false">
                <template #placeholder>
                    <loading></loading>
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
        <div class="market-card-title">
        </div>
    </div>
</template>
<script setup>
import { defineProps,ref } from 'vue';
import loading from './loading.vue'
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
    height: 200px;
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

.market-card-title{
    width: 100%;
    height: 30px;
    background-color: #fff;
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