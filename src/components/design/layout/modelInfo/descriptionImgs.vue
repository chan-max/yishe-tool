<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-29 20:40:22
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-18 07:49:09
 * @FilePath: /yishe/src/components/design/layout/modelInfo/descriptionImgs.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <p>实物图</p>
  <div style="height: 200px; width:100%;display: flex; align-items: center; justify-content: center;flex-shrink:0;">
    <template v-if="currentOperatingBaseModelInfo?.description_imgs">
      <el-carousel style="width: 100%" :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in imgs" :key="item">
          <el-image :src="item" style="background-color: #dfe4eb;width:100%;height:100%;" fit="cover"></el-image>
        </el-carousel-item>
      </el-carousel>
    </template>
    <template v-else> 暂未上传实物图 </template>
  </div>
</template>
<script setup>
import { currentOperatingBaseModelInfo } from "../../store";
import {computed} from 'vue'

const imgs = computed(() => {
  return currentOperatingBaseModelInfo.value.preview_description_imgs && currentOperatingBaseModelInfo.value.preview_description_imgs
})

</script>
<style></style>
