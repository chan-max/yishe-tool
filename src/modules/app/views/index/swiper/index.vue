<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-17 20:12:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-18 22:30:00
 * @FilePath: /1s/src/modules/app/views/index/swiper/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div style="height: 100%">
    <swiper
      style="height: 100%; width: 100%"
      direction="vertical"
      :modules="[Virtual]"
      :slides-per-view="1"
      virtual
      @reachEnd="reachEnd"
      @activeIndexChange="activeIndexChange"
      @touchStart="touchStart"
      @touchEnd="touchEnd"
      @transitionStart="transitionStart"
      @transitionEnd="transitionEnd"
      @sliderMove="sliderMove"
    >
      <swiper-slide
        style="height: 100%; width: 100%"
        v-for="(item, index) in list"
        :key="index"
        :virtualIndex="index"
      >
        <item :model-info="item" :index="index" ></item>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import { usePaging } from "../../../helper/paging.ts";
import { getModelList } from "@/api/index.ts";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "@ionic/vue/css/ionic-swiper.css";
import item from "./item.vue";
import { activeIndex, activeIndexChange,gltfViewerRef } from "./index.ts";


const { list, page, getList } = usePaging(getModelList);

// 滑动到最新
function reachEnd() {
  getList();
}


/*
  上下滑动式禁用模型控制器，防止一起滚动的错误操作体验
*/

function touchStart(){
}


function sliderMove(){
  // 此事件在移动过程中持续触发，用于开始滑动的事件
  if(gltfViewerRef.value ){
    gltfViewerRef.value.controller.enabled = false 
  }
}

function touchEnd(){
  if(gltfViewerRef.value){
    gltfViewerRef.value.controller.enabled = true
  }
}

function transitionStart(){
}

function transitionEnd(){
}



</script>

<style lang="less">

/* 用于设置固定高度的评论弹层 */
ion-modal {
  --height: auto;
}
</style>
