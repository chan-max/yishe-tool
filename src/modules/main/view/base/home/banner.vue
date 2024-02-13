<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-21 18:56:25
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-13 09:09:24
 * @FilePath: /yishe/src/modules/main/view/base/home/banner.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="home-banner super-ellipse">
    <button class="button-1" @click="$router.push({ name: 'Design' })">
      快速开始
    </button>

    <div class="home-banner-main-title">
      开放式服装设计-交易平台
    </div>
    <div class="bannner-model">
      <gltf-viewer :model="modelInfo"></gltf-viewer>
    </div>
  </div>
</template>
<script setup>
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import { onMounted, ref } from "vue";
import { getBannerModel } from "@/api";
import { TopRight } from "@element-plus/icons-vue";

let modelInfo = ref("");

onMounted(async () => {
  let data = await getBannerModel();
  modelInfo.value = data;
});
</script>
<style lang="less">
.home-banner {
  width: 96%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
  padding: 40px 0;
  margin-top: 32px;
  background: url(/image/background/bg2.jpg);
  background-size: 100% 100%;
  box-shadow: 0px 0px 100px 50px rgba(0, 0, 0, 0.2) inset;
  border-radius: 32px;
  position: relative;
}


.home-banner-main-title {
  font-size: 80px;
  color: #fff;
  font-weight: 500;
  text-align: center;
  padding-top: 120px;
  line-height: 100px;
}

.bannner-model {
  height: 400px;
  width: 400px;
}

.button-1 {
  background: transparent;
  border-radius: 8px;
  border: 4px solid rgba(255, 255, 255, 1);
  color: #fff;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all .5s;
  font-size: 18px;
  opacity: .8;
  font-weight: bold;
  position: absolute;
  right: 5%;
  top: 5%;
}

.button-1:hover {
  opacity: 1;
  transform: scale(1.05);
}
</style>
