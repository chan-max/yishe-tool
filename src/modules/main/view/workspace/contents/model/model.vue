<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-31 21:19:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 11:58:58
 * @FilePath: /1s/src/modules/main/view/workspace/contents/model/model.vue
 * @Description: 30
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="model-content" v-infinite-scroll="scroll" :infinite-scroll-distance="150">
    <div v-for="item in list" class="item">
      <div class="img">
        <el-image :src="item.preview_img" fit="cover" style="width: 100%; height: 100%">
        </el-image>
      </div>
      <div class="menu">
        <el-button size="small" type="primary" @click="publish(item)"> 发布 </el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { publishModel } from "@/api";

import { ref } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { getModelList } from "@/api";

const { page, pages, pageSize, list, getList } = usePaging((params) => {
  return getModelList({
    onlyMyContent: true,
    ...params,
  });
});

function scroll() {
  getList();
}

async function publish(item) {
  await publishModel({
    modelId: item.id,
  });
}
</script>
<style lang="less" scoped>
.model-content {
  width: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: 220px;
  justify-items: center;
  margin-top: 20px;
}

.item {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  padding: 5px;
  width: 300px;
  height: 200px;
}

.img {
  width: 300px;
  height: 160px;
}

.menu {
  display: flex;
  align-items: center;
  justify-content: end;
  width: 100%;
  height: 40px;
}
</style>
