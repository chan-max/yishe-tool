<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-31 21:19:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-31 21:49:30
 * @FilePath: /1s/src/modules/main/view/workspace/contents/model/model.vue
 * @Description: 30
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="model-content" v-infinite-scroll="scroll" :infinite-scroll-distance="150">
    <div v-for="item in list" class="item"></div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { getModelList } from "@/api";

const { page, pages, pageSize, list, getList } = usePaging((params) => {
  return getModelList({
    onlyMyContent:true,
    ...params
  });
});

function scroll() {
  getList();
}
</script>
<style lang="less">
.model-content {
  width: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: 170px;
  justify-items: center;
}

.item {
  width: 300px;
  height: 160px;
  background: #eee;
}
</style>
