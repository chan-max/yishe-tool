<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-17 20:12:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-17 22:21:34
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
    >
      <swiper-slide
        style="height: 100%; width: 100%"
        v-for="(item, index) in list"
        :key="index"
        :virtualIndex="index"
      >
        <item :item="item" :index="index"></item>
      </swiper-slide>
    </swiper>
    import { log } from "console";
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
import { activeIndex, activeIndexChange } from "./index.ts";
const { list, page, getList } = usePaging(getModelList);

// 滑动到最新
function reachEnd() {
  getList();
}
</script>
<style lang="less" scoped></style>
