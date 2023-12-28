<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-29 21:41:57
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-27 21:26:45
 * @FilePath: /1s/src/components/design/layout/modelInfo/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-model-info">
    <h5>基础模型</h5>
    <base-gltf-viewer
      style="width: 100%; height: 200px"
      :src="currentOperatingBaseModelInfo.preview_file"
    ></base-gltf-viewer>
    <description-imgs></description-imgs>
    {{ currentOperatingBaseModelInfo }}
  </div>
</template>
<script setup>
import { currentOperatingBaseModelInfo } from "../../store";
import baseGltfViewer from "@/components/baseGltfViewer/index.vue";
import descriptionImgs from './descriptionImgs.vue'

</script>
<style lang="less">
.designiy-model-info {
  width: 360px;
  height: 100%;
  padding: 20px;
  overflow: auto;
}
</style>
