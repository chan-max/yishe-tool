<template>
  <div
    class="flex flex-col items-center"
    style="padding: 12px; box-sizing: border-box; width: 100vw"
  >
    <h1 class="gradient-text" style="padding: 24px">服装作品</h1>
    <div class="w-full flex justify-around flex-wrap" style="row-gap: 12px">
      <template v-for="item in list">
        <div
          class="page-card-2"
          @click="open(item)"
          style="
            background: linear-gradient(to right, #f9f9f9, #fcfcfc);
            border-radius: 8px;
            overflow: hidden;
          "
        >
          <s1-image :src="item.thumbnail.url"></s1-image>
        </div>
      </template>
    </div>
    <div style="padding: 24px" class="flex flex-col items-center">
      <div v-if="isEmpty">暂无作品</div>
      <div v-else-if="loading"><van-loading type="spinner" /></div>
      <div v-else-if="!isLastPage" @click="getList">
        <van-button type="default" round size="small">更多</van-button>
      </div>
      <div v-else>没有了~</div>

      <!-- <div style="margin-top: 24px">
        <van-button
          icon="guide-o"
          type="default"
          round
          size="small"
          @click="$router.push({ name: 'customModel' })"
          >查看所有服装设计</van-button
        >
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from "vue";
import Api from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";

import { openCustomModelModal } from "../content/customModel/index.ts";

const { list, getList, isLastPage, isEmpty, loading } = usePaging((params) => {
  return Api.getCustomModelList({
    ...params,
    pageSize: 4,
  });
});

function open(item) {
  openCustomModelModal(item);
}
</script>
<style></style>
