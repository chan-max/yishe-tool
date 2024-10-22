<template>
  <van-popup
    round
    closeable
    style="padding-top: 32px"
    v-model:show="showMaterialPopup"
    position="bottom"
    :style="{ height: '90%', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div class="flex flex-col" style="height: 100%">
      <div>
        <van-search v-model="search" placeholder="请输入搜索关键词" />
      </div>

      <div
        style="margin-top: 12px"
        v-if="currentModelController.state.materialTextureInfo"
      >
        <van-card
          tag="当前"
          :desc="
            currentModelController.state.materialTextureInfo.description || '暂无相关描述'
          "
          :title="currentModelController.state.materialTextureInfo.name || '暂无名称'"
          :thumb="currentModelController.state.materialTextureInfo.thumbnail.url"
          style="margin-top: 8px"
        >
          <template #tags>
            <template v-if="currentModelController.state.materialTextureInfo.keywords">
              <van-tag
                v-for="item in currentModelController.state.materialTextureInfo.keywords.split(
                  ','
                )"
                plain
                type="primary"
                >{{ item }}</van-tag
              >
            </template>
            <template v-else> 无标签 </template>
          </template>
          <template #footer>
            <div style="padding: 12px 0 4px 0">
              <van-button
                round
                type="default"
                icon="cross"
                icon-position="right"
                size="small"
                @click="removeMaterial"
              >
                移除当前材质
              </van-button>
            </div>
          </template>
        </van-card>
      </div>

      <div
        style="flex: 1; overflow: auto; padding: 12px; row-gap: 6px"
        class="flex flex-wrap justify-around"
        v-infinite-scroll="getList"
        :infinite-scroll-distance="150"
      >
        <template v-for="item in list">
          <div style="width: 100%; height: 120px" @click="detail(item)">
            <s1-img
              v-if="item"
              :src="item?.thumbnail?.url"
              style="border-radius: 4px"
              fit="cover"
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
import {
  showMaterialPopup,
  showMaterialDetailPopup,
  currentMaterialDetail,
} from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentModelController } from "@/components/design/store";

const search = ref();

const { list, getList, isEmpty, loading, isLastPage } = usePaging(
  (params) => {
    return Api.getStickerList({
      type: "texture",
      ...params,
      pageSize: 20,
    });
  },
  {
    forEach: (item) => {},
  }
);

function detail(item) {
  currentMaterialDetail.value = item;
  showMaterialDetailPopup.value = true;
}

function removeMaterial() {
  // 移除当前材质
  currentModelController.value.state.materialTextureInfo = null;
}
</script>

<style></style>
