<template>
  <div
    class="w-full flex flex-col items-center"
    style="padding: 12px; box-sizing: border-box"
  >
    <h1 class="gradient-text" style="padding: 24px">服装原型</h1>
    <div class="w-full flex justify-around flex-wrap" style="row-gap: 12px">
      <template v-for="item in list">
        <div
          style="
            width: 180px;
            height: 200px;
            background: linear-gradient(to right, #f9f9f9, #fcfcfc);
            border-radius: 8px;
            overflow: hidden;
          "
        >
          <s1-image :src="item.thumbnail.url"></s1-image>
        </div>
      </template>
    </div>
    <div style="padding: 24px" class="flex items-center">
      <div v-if="isEmpty">暂无作品</div>
      <div v-else-if="loading"><van-loading type="spinner" /></div>
      <div v-else-if="!isLastPage" @click="getList">
        <van-button type="default" round size="small">更多</van-button>
      </div>
      <div v-else>到底了</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from "vue";
import Api from "@/api";

import { usePaging } from "@/hooks/data/paging.ts";

const { list, getList, isLastPage, isEmpty, loading } = usePaging((params) => {
  return Api.getProductModelList({
    ...params,
    pageSize: 4,
  });
});
</script>
<style></style>
