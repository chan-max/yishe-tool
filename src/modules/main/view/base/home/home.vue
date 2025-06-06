<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-05 23:37:20
 * @FilePath: /yishe/src/modules/main/view/base/home/home.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="home">
    <div id="test-el" style="width:100px;height:100px;">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <polygon points="5,5 195,10 185,185 10,195" />

        <foreignObject x="20" y="20" width="160" height="160">

          <div xmlns="http://www.w3.org/1999/xhtml" style="color:red;">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis mollis mi
            ut ultricies. Nullam magna ipsum, porta vel dui convallis, rutrum imperdiet
            eros. Aliquam erat volutpat.
          </div>
        </foreignObject>
      </svg>
    </div>

    <div id="test-container"></div>

    <!-- <banner></banner>

    <description></description>

    <danmuku></danmuku> -->

    <!-- <div
      v-animateonscroll="{
        enterClass: 'animate__animated animate__fadeIn',
      }"
    >
      <contactus></contactus>
    </div> -->

    <!-- <site-footer></site-footer> -->
  </div>
</template>

<script setup>
import siteFooter from "../footer/index.vue";
import market from "@/modules/main/view/market/index.vue";
import banner from "./banner.vue";
import contactus from "./contact/contact.vue";
import danmuku from "./danmuku.vue";
import description from "./description.vue";

import { onMounted, ref } from "vue";
import { getBannerModel } from "@/api";
import { toCanvas } from "html-to-image";

onMounted(async () => {
  let el = document.querySelector("#test-el");

  let canvas = await toCanvas(el, {});

  let container = document.querySelector("#test-container");

  container.appendChild(canvas);
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
  overflow-y: auto;
  overflow-x: hidden;

  * {
    flex-shrink: 0;
  }
}
</style>
