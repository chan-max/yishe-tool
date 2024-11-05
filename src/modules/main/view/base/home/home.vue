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
    <banner></banner>

    <danmuku></danmuku>

    <div
      v-animateonscroll="{
        enterClass: 'animate__animated animate__fadeIn',
      }"
    >
      <contactus></contactus>
    </div>

    <site-footer></site-footer>
  </div>
</template>

<script setup>
import siteFooter from "../footer/index.vue";
import market from "@/modules/main/view/market/index.vue";
import banner from "./banner.vue";
import contactus from "./contact/contact.vue";
import danmuku from "./danmuku.vue";

import { onMounted, ref } from "vue";
import { getBannerModel } from "@/api";
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
  overflow-y: auto;
  overflow-x: hidden;

  * {
    flex-shrink: 0;
  }
}
</style>
