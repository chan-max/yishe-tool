<template>
  <div
    class="flex flex-col items-center"
    style="padding: 12px; box-sizing: border-box; width: 100vw"
  >
    <h1 class="gradient-text" style="padding: 24px">服装印花</h1>
    <div class="w-full flex justify-around flex-wrap" style="row-gap: 12px">
      <template v-for="item in list">
        <div
          @click="open(item)"
          class="page-card-2"
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
    <div style="padding: 24px" class="flex items-center flex-col">
      <div v-if="isEmpty">暂无作品</div>
      <div v-else-if="loading"><van-loading type="spinner" /></div>
      <div v-else-if="!isLastPage" @click="getList">
        <van-button type="default" round size="small">更多</van-button>
      </div>
      <div v-else>没有了~</div>
      <div style="margin-top: 24px">
        <van-button
          icon="guide-o"
          type="default"
          round
          size="small"
          @click="$router.push({ name: 'sticker' })"
          >查看所有服装印花</van-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from "vue";
import Api from "@/api";
import { openStickerModal } from "../content/sticker/index.ts";

import { usePaging } from "@/hooks/data/paging.ts";

const { list, getList, isLastPage, isEmpty, loading } = usePaging((params) => {
  return Api.getStickerList({
    ...params,
    pageSize: 4,
  });
});

function open(item) {
  openStickerModal(item);
}
</script>
<style></style>
