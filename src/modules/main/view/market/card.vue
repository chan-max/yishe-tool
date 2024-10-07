<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-16 22:44:34
 * @FilePath: /1s/src/modules/main/view/market/card.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="market-card">
    <div class="market-card-main">
      <div class="market-card-main-img">
        <s1-image fit="cover" :src="model.thumbnail "> </s1-image>
      </div>
    </div>
    <div class="bar">
      <div class="avatar">
        <desimage :src="getAvatar(model)"></desimage>
      </div>
      <div class="name">{{ model.uploader.name || model.uploader.account }}</div>
      <div style="flex: 1"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import desimage from "@/components/image.vue";

function getAvatar(model) {
  return model.uploader.avatar || "defaultAvatar/avatar3.png";
}

const props = defineProps(["model"]);

const showViewer = ref(false);

function load() {
  showImg.value = false;
}
</script>
<style scoped lang="less">
.market-card {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  /* box-shadow: 0 1px 8px rgba(0,0,0,.08); */
  display: flex;
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.market-card-main {
  width: 100%;
  height: 100%;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  .el-image {
    width: 100%;
    height: 100%;
  }
}

.market-card-main-img {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f1f2f3;
  border-radius: 8px;
}

.market-card-main-viewer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #eee;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
  column-gap: 1rem;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
}
.name {
  font-size: 1.2rem;
}
</style>
