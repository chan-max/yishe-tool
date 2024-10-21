<template>
  <van-popup
    round
    v-model:show="showStickerPopup"
    position="bottom"
    :style="{ height: '90%', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div class="flex flex-col" style="height: 100%">
      <div style="margin-top: 12px">
        <van-search v-model="search" placeholder="请输入搜索关键词" />
      </div>
      <div
        style="flex: 1; overflow: auto; padding: 12px; row-gap: 6px"
        class="flex flex-wrap justify-around"
        v-infinite-scroll="getList"
        :infinite-scroll-distance="150"
      >
        <template v-for="item in list">
          <div class="page-card-3" @click="showStickerDetail(item)">
            <s1-img
              v-if="item"
              :src="item?.thumbnail?.url"
              style="background: #eee; border-radius: 8px"
            ></s1-img>
          </div>
        </template>

        <div style="padding: 24px 0" class="flex w-full flex-col items-center">
          <div v-if="isEmpty">暂无作品</div>
          <div v-else-if="loading"><van-loading type="spinner" /></div>
          <div v-else-if="isLastPage">没有了~</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showStickerPopup, showStickerDetailPopup, showStickerDetail } from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";

const search = ref();

const { list, getList, isEmpty, loading, isLastPage } = usePaging(
  (params) => {
    return Api.getStickerList({
      ...params,
      pageSize: 20,
    });
  },
  {
    autofillColumns: 3,
    forEach: (item) => {},
  }
);
</script>

<style></style>
