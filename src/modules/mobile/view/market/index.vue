<template>
  <div style="width: 100%; height: 100%" class="flex flex-col marekt-tab">
    <div style="height: 64px">
      <van-search v-model="search" placeholder="请输入搜索关键词" />
    </div>

    <div v-if="show">
      <van-tabs v-model:active="active" swipeable>
        <van-tab v-for="item in tabs" :title="item.title">
          <div
            class="tab-content flex flex-wrap justify-around"
            style="
              overflow-y: auto;
              width: 100%;
              row-gap: 12px;
              padding: 24px 12px;
              box-sizing: border-box;
            "
            :style="{
              height: `calc(${height}px - var(--market-search-bar) - var(--van-tabs-line-height))`,
            }"
            v-infinite-scroll="getList"
            :infinite-scroll-distance="150"
          >
            <template v-for="(item, index) in list">
              <div class="market-card" @click="open(item)" style="overflow: hidden">
                <div
                  :style="{ background: Utils.random.randomArrayItem(bgs, index) }"
                  style="height: 220px; border-radius: 16px; row-gap: 12px"
                  class="flex flex-col overflow-hidden"
                >
                  <s1-image :src="item.thumbnail.url"></s1-image>
                </div>

                <div class="text-ellipsis card-title">{{ item.name || "-" }}</div>
                <div class="text-ellipsis card-desc">{{ item.description || "..." }}</div>
              </div>
            </template>
            <s1-paging-bottom
              :loading="loading"
              :isEmpty="isEmpty"
              :isLastPage="isLastPage"
            ></s1-paging-bottom>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useWindowSize, useDebounceFn } from "@vueuse/core";
import { openCustomModelModal } from "../content/customModel/index.ts";
import Utils from "@/common/utils";
const show = ref(false);

const bgs = ref([
  "#FCE8EA",
  "#F9E2D0",
  "#E4FBEB",
  "#CCF3F6",
  "#FEE0C6",
  "#CEE9FE",
  "#E2F4F7",
]);

const { width, height } = useWindowSize();

onMounted(() => {
  show.value = true;
});

const tabs = ref([
  {
    index: "1",
    title: " T恤",
  },
  {
    index: "2",
    title: " 卫衣",
  },
  {
    index: "3",
    title: "背心",
  },
  {
    index: "4",
    title: "短裤",
  },
  {
    index: "5",
    title: "员工服",
  },
  {
    index: "6",
    title: "工作服",
  },
]);

const search = ref();
const active = ref();

import Api from "@/api";

import { usePaging } from "@/hooks/data/paging.ts";

const { list, getList, isLastPage, isEmpty, loading } = usePaging((params) => {
  return Api.getCustomModelList({
    ...params,
    pageSize: 12,
  });
});

function open(info) {
  openCustomModelModal(info);
}
</script>

<style scoped lang="less">
.card-title {
  font-size: 16px;
  color: #010101;
  padding: 12px 0 4px 4px;
}

.card-desc {
  font-size: 10px;
  color: #aaa;
  padding-left: 4px;
}
</style>
<style lang="less">
.marekt-tab {
  --market-search-bar: 64px;
}

.van-tabs__line {
  --van-tabs-bottom-bar-width: 12px !important;
}

.market-card {
  width: calc(50% - 12px);
}
</style>
