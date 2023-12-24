<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-21 18:56:25
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-22 23:28:08
 * @FilePath: /1s/src/modules/main/view/base/home/banner.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="home-banner">
    <div class="home-banner-main-title">
    开放式服装设计-交易平台
    <br>
    <span style="font-size:.8em;font-weight: bold;">每个人都是
    <span class="linear-gradient-text">设计师</span>
    </span>
    </div>
    <div class="home-banner-main-subtitle">
      共 300 人 设计了 788 件服装
    </div>

    <div>
      <el-button
      size="large"
      type="primary"
      @click="$router.push({ name: 'Design' })"
    >
      <span style="font-size: 18px; font-weight: bold"> 试一下</span>
      <el-icon><TopRight /></el-icon>
    </el-button>
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
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
}

.home-banner-main-title {
  font-size: 80px;
  color: #222;
  font-weight: 500;
  text-align: center;
  padding-top:80px;
  line-height: 100px;
}

.home-banner-main-subtitle{
  font-size: 14px; color: #000; line-height: 24px
}

.bannner-model {
  height: 400px;
  width: 800px;
}

.linear-gradient-text{
background: linear-gradient(to right, #4A00E0, #8E2DE2);
color: #ffffff; // 兜底颜色，防止文字裁剪不生效
background-clip: text;
-webkit-background-clip: text; // 背景被裁减为文字的前景色
-webkit-text-fill-color: transparent;
}
</style>
