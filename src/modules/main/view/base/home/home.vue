<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-24 17:36:37
 * @FilePath: /yishe/src/modules/main/view/base/home/home.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="home">
    <carousel style="padding: 36px 4%"></carousel>

    <resource style="width: 92%"></resource>

    <!-- <operate></operate> -->

    <!-- <bar></bar> -->

    <site-footer></site-footer>
  </div>
</template>

<script setup>
import carousel from "./carousel.vue";
import siteFooter from "../footer/index.vue";
import gltfViewer from "@/components/model/gltfViewer/index.vue";
// import carousel from './baseModelCarousel.vue'
import { onMounted, ref } from "vue";
import { getBannerModel } from "@/api";
import bar from "./bar.vue";
import resource from "./source.vue";
import operate from "./operate.vue";

let modelInfo = ref("");

onMounted(async () => {
  let data = await getBannerModel();
  modelInfo.value = data;
});
</script>

<style>
.home {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  row-gap: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  * {
    flex-shrink: 0;
  }
}
</style>
