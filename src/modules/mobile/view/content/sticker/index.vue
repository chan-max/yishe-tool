<template>
  <div class="w-full h-full flex flex-col">
    <van-search v-model="search" placeholder="请输入搜索关键词" />
    <div
      style="
        flex: 1;
        row-gap: 12px;
        overflow: auto;
        padding: 12px;
        box-sizing: border-box;
      "
      class="w-full flex justify-around flex-wrap"
      v-infinite-scroll="getList"
      :infinite-scroll-distance="150"
    >
      <template v-for="item in list">
        <div
          class="page-card"
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
      <div style="padding: 24px 0" class="flex w-full flex-col items-center">
        <div v-if="isEmpty">暂无作品</div>
        <div v-else-if="loading"><van-loading type="spinner" /></div>
        <div v-else-if="isLastPage">到底了</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Api from "@/api";

import { usePaging } from "@/hooks/data/paging.ts";
import { openStickerModal } from "./index.ts";

const { list, getList, isLastPage, isEmpty, loading } = usePaging((params) => {
  return Api.getStickerList({
    ...params,
    pageSize: 12,
  });
});

function open(info) {
  openStickerModal(info);
}
</script>

<style></style>
