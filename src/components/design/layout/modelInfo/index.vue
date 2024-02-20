<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-29 21:41:57
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-18 07:48:47
 * @FilePath: /yishe/src/components/design/layout/modelInfo/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-model-info">
    <p>基础模型</p>
    <base-gltf-viewer
      class="png-background"
      style="width: 100%; height: 200px;flex-shrink:0;"
      :src="currentOperatingBaseModelInfo?.preview_file"
    ></base-gltf-viewer>
    <description-imgs></description-imgs>
      {{ currentOperatingBaseModelInfo }}
  </div>
</template>
<script setup>
import { currentOperatingBaseModelInfo } from "../../store";
import baseGltfViewer from "@/components/model/baseGltfViewer/index.vue";
import descriptionImgs from "./descriptionImgs.vue";
</script>
<style lang="less">
.designiy-model-info {
  width: 360px;
  height: 100%;
  padding: 15px;
  overflow: auto;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  align-items: start;
}
</style>
