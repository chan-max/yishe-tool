<template>
  <div style="width: 100%; height: 100%" class="flex flex-col mobile-market">
    <div style="height: var(--market-search-bar); position: relative">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        class="mobile-market-search"
        shape="round"
        @focus="searchFocus"
        @blur="searchBlur"
        :background="
          showSearchMenu
            ? '#fff'
            : 'linear-gradient( 0deg,  rgba(105, 0, 255, 0.05) 0%,  rgba(105, 0, 255, 0.15) 100% )'
        "
      >
        <template #left>
          <van-button
            size="small"
            style="margin-right: 6px"
            color="transparent"
            @click="back"
            v-if="!showSearchMenu"
          >
            <van-icon name="wap-home-o" style="color: #111" size="20" />
          </van-button>
          <van-button
            v-else
            size="small"
            style="margin-right: 6px"
            color="transparent"
            @click="searchMenuBack"
          >
            <van-icon name="arrow-left" style="color: #333" size="20" />
          </van-button>
        </template>

        <template #action>
          <van-button
            v-if="showSearchMenu"
            size="small"
            color="#6900ff"
            round
            @click="doSearch"
          >
            <!-- <van-icon name="weapp-nav" style="color: #333" size="20" /> -->
            <span style="padding: 8px">搜索</span>
          </van-button>

          <van-button
            v-if="!showSearchMenu && searchText"
            size="small"
            type="default"
            color="transparent"
            style="color: #111"
            round
            @click="cancelSearch"
          >
            取消
          </van-button>
        </template>
      </van-search>

      <div>
        <!-- 这里还可以放一些分类相关的东西 -->
      </div>

      <div
        style="
          position: absolute;
          left: 0;
          top: var(--market-search-bar);
          z-index: 999;
          width: 100vw;
          height: calc(100vh - var(--market-search-bar));
          background: #fff;
        "
        v-if="showSearchMenu"
      >
        <searchMenu @select="searchMenuSelect"></searchMenu>
      </div>
    </div>

    <div v-if="show" class="mobile-market-search-content">
      <van-tabs v-model:active="active" swipeable>
        <template #nav-left> </template>
        <template #nav-right> </template>
        <template #nav-bottom>
          <div
            style="height: var(--market-tab-bottom); padding: 0px 24px; overflow: auto"
            class="flex items-center hide-scrollbar"
          >
            <dropdownMenu></dropdownMenu></div
        ></template>

        <van-tab v-for="item in mobileMarketTabs" :title="item.title">
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
              height: `calc(${height}px - var(--market-search-bar) - var(--van-tabs-line-height) - var(--market-tab-bottom))`,
            }"
            v-infinite-scroll="getList"
            :infinite-scroll-distance="150"
          >
            <template v-for="(item, index) in list">
              <div class="market-card" @click="open(item)" style="overflow: hidden">
                <div
                  :style="{
                    background: Utils.random.randomArrayItemWithTimeHash(bgs, index),
                  }"
                  style="height: 220px; border-radius: 8px; row-gap: 12px"
                  class="flex flex-col overflow-hidden"
                >
                  <s1-image :src="item?.thumbnail?.url"></s1-image>
                </div>

                <div class="card-title flex items-center">
                  <div class="text-ellipsis" style="flex: 1">{{ item?.name || "-" }}</div>

                  <!-- <span class="card-title-tag-base"> 新 </span> -->
                </div>
                <div class="text-ellipsis card-desc">
                  {{ item?.description || "..." }}
                </div>
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
import { ref, onMounted, nextTick, watch } from "vue";
import { useWindowSize, useDebounceFn } from "@vueuse/core";
import { openCustomModelModal } from "../content/customModel/index.ts";
import {
  addSearchRecords,
  searchText,
  showSearchMenu,
  mobileMarketTabs,
  bgs,
} from "./index.tsx";
import Utils from "@/common/utils";
import searchMenu from "./searchMenu.vue";
import dropdownMenu from "./dropdownMenu.vue";

const show = ref(false);

let router = useRouter();

const { width, height } = useWindowSize();

onMounted(() => {
  show.value = true;
});

const active = ref();

import Api from "@/api";

import { usePaging } from "@/hooks/data/paging.ts";
import { useRouter } from "vue-router";

const { list, getList, isLastPage, isEmpty, loading } = usePaging((params) => {
  return Api.getCustomModelList({
    ...params,
    pageSize: 12,
  });
}, {});

function open(info) {
  openCustomModelModal(info);
}

function back() {
  router.replace("/");
}

function searchFocus() {
  showSearchMenu.value = true;
}

async function searchBlur() {
  /**
   *  这里防止搜索按钮消失导致按钮失效
   */
  // await Utils.sleep(33);
  // showSearchMenu.value = false;
}

/**
 * @methos 点击搜索
 */
function doSearch() {
  addSearchRecords({
    label: searchText.value,
  });
  showSearchMenu.value = false;
}

/**
 * @methos 取消搜索
 */
function cancelSearch() {
  searchText.value = "";
}

/**
 * @methos 搜索状态返回
 */
function searchMenuBack() {
  showSearchMenu.value = false;
}

/**
 * @methos 从搜索下拉中选择了标签
 */
function searchMenuSelect(tag) {
  searchText.value = tag;
  showSearchMenu.value = false;
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

//  商品卡片标题上的标签
.card-title-tag-base {
  font-size: 10px;
  font-weight: 600;
  margin-left: 4px;
  background: #ddd;
  color: #ffff;
  border-radius: 4px 3px 4px 3px;
  padding: 1px 3px;
}

.card-title-tag-red {
  background-color: red;
}
</style>
<style lang="less">
.mobile-market {
  // 整个搜索栏的高度
  --market-search-bar: 64px;

  // tab栏下方，可以放一些分类相关的
  --market-tab-bottom: 48px;
}

.van-tabs__line {
  --van-tabs-bottom-bar-width: 12px !important;
}

.market-card {
  width: calc(50% - 10px);
}

.mobile-market-search {
  --van-search-padding: 8px 12px;
  --van-search-input-height: 32px;
  --van-button-small-height: 32px;

  --van-search-content-background: #f8f8f8;

  .van-search__action:active {
    background-color: transparent;
  }

  .van-search__action {
    line-height: var(--van-search-action-font-size);
  }

  .van-search__field {
    font-size: 11px;
  }
}
</style>
