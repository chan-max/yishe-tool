<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-06 20:24:18
 * @FilePath: /1s/src/modules/main/view/market/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <el-backtop :right="100" :bottom="100" />
  <div class="market-container">
    <div class="market-title" id="latest-makeup">最新创作</div>
    <div class="market-content">
      <el-row :gutter="24">
        <el-col
          v-for="model in list"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
          style="margin: 24px 0"
        >
          <card class="market-item" :model="model"></card>
        </el-col>
      </el-row>
    </div>
    <div class="more">
      <el-button type="info" round @click="getList" v-if="!isLastPage">
        加载更多
      </el-button>
      <span v-else> 到底了 </span>
    </div>
  </div>
</template>
<script setup>
import { getModelList } from "@/api/index";
import { onMounted, ref } from "vue";
import card from "./card.vue";
import { useRouter } from "vue-router";
import { getCustomModelList } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";

const router = useRouter();

const { list, getList, isLastPage } = usePaging((params) => {
  return getCustomModelList({
    ...params,
    pageSize: 20,
  });
});
</script>
<style lang="less" scoped>
.market-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.market-title {
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
  font-weight: #333;
  padding: 20px;
}

.market-content {
  width: 94%;
}

.more {
  display: flex;
  justify-content: center;
  padding: 4em;
}
</style>
