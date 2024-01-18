<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-18 19:22:11
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-18 22:06:01
 * @FilePath: /1s/src/modules/app/views/index/swiper/item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="item">
    <div class="image" v-if="showImage">
      <van-image style="width: 100%; height: 100%" fit="cover" :src="item.preview_img">
        <template v-slot:loading>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </template>
      </van-image>
    </div>
    <div class="viewer" v-if="showViewer">
      <gltf-viewer ref="gltfViewerRef" :model="item.modelInfo" @beforeLoad="beforeLoad" @loaded="loaded" ></gltf-viewer>
    </div>
    <div class="menu">
      {{ item }}
    </div>
    <div v-if="loading" class="progress"><ion-progress-bar type="indeterminate"></ion-progress-bar></div>
  </div>
</template>
<script setup>
import { defineProps, ref, onMounted, watch, onUnmounted } from 'vue';
import { activeIndex, activeIndexChange,gltfViewerRef } from "./index.ts";
import gltfViewer from '@/components/model/gltfViewer/index.vue'

const props = defineProps(["item", "index"]);

// 是否展示图片
const showImage = ref(true);

// 是否展示模型预览
const showViewer = ref(false);

const loading = ref(true)




watch(activeIndex,() => {
    if(activeIndex.value != props.index){
        return 
    }
    setTimeout(() => {
      showViewer.value = true
    }, 1000);
},{immediate:true})

function beforeLoad(){
  loading.value = true
}

function loaded(){
  showImage.value = false;
  loading.value = false 
}

</script>
<style lang="less" scoped>
.item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.image {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
}

::v-deep {
  .image img {
    width: 100%;
    height: 100%;
  }
}

.viewer {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}

.menu {
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 0;
  z-index: 10;
}

.progress{
  position: absolute;
  bottom: 0;
  z-index: 11;
  width: 100%;
}

ion-progress-bar{
  --background:rgba(0,0,0,0);
  --progress-background:rgba(105,0,255,.5);
}
</style>
