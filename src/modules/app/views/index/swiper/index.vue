<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-17 20:12:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 19:14:05
 * @FilePath: /1s/src/modules/app/views/index/swiper/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div v-if="firstLoading" class="flex justify-center w-full h-full items-center">
    <ion-spinner name="dots" style="height: 100px"></ion-spinner>
  </div>
  <swiper v-else class="swiper" direction="vertical" :modules="[Virtual]" :slides-per-view="1" virtual
    @reachEnd="reachEnd" @activeIndexChange="activeIndexChange" @touchStart="touchStart" @touchEnd="touchEnd"
    @transitionStart="transitionStart" @transitionEnd="transitionEnd" @sliderMove="sliderMove">
    <swiper-slide style="width: 100%; height: 100%" v-for="(item, index) in list" :key="index" :virtualIndex="index">
      <swiper-item :available-model-info="item" :index="index"></swiper-item>
    </swiper-slide>
  </swiper>
</template>
<script setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { getModelList, getAvailableModel } from "@/api/index.ts";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "@ionic/vue/css/ionic-swiper.css";
import swiperItem from "./item.vue";
import { activeIndex, activeIndexChange, gltfViewerRef } from "./index.ts";

const { list, getList, loading, firstLoading } = usePaging(getAvailableModel, {
  // 获取首页模型信可能会涉及很多查询，所以严格控制其数量
  pageSize:3
});

// 滑动到最新
function reachEnd() {
  getList();
}

/*
  上下滑动式禁用模型控制器，防止一起滚动的错误操作体验
*/

const showSwipe = ref(true);

function touchStart() { }

function sliderMove() {
  // 此事件在移动过程中持续触发，用于开始滑动的事件
  if (gltfViewerRef.value) {
    gltfViewerRef.value.controller.enabled = false;
  }
}

function touchEnd() {
  if (gltfViewerRef.value) {
    gltfViewerRef.value.controller.enabled = true;
  }
}

function transitionStart() { }

function transitionEnd() { }
</script>

<style lang="less">
.swiper {
  width: 100%;
  height: 100%;
}
</style>
