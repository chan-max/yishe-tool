<template>
  <van-popup
    round
    v-model:show="showProductPopup"
    closeable
    position="bottom"
    :style="{ height: '80%', width: '100%', paddingTop: '32px' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div style="padding: 48px 12px; box-sizing: border-box; height: 100%; overflow: auto">
      <template v-for="item in list">
        <div style="border-bottom: 1px solid #eee; padding: 12px 12px">
          <van-badge
            style="width: 100%; height: auto"
            :offset="[-36, 16]"
            :content="item.id == currentOperatingBaseModelInfo?.id ? '当前选用' : ''"
          >
            <van-card
              num="*"
              :tag="''"
              :price="item.price"
              :desc="item.description || '无描述'"
              :title="item.name || '未命名'"
              :thumb="item.thumbnail.url"
            >
              <template #tags>
                <van-tag v-for="tag in item.keywords.split(',')" plain type="primary">{{
                  tag
                }}</van-tag>
              </template>
              <template #footer>
                <van-button size="mini" @click="selectModel(item)">
                  选择该模型
                </van-button>
              </template>
            </van-card>
          </van-badge>
        </div>
      </template>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showProductPopup } from "./index.ts";
import Api from "@/api";
import {
  currentOperatingBaseModelInfo,
  currentOperatingDecalController,
} from "@/components/design/store";

import { usePaging } from "@/hooks/data/paging.ts";

const { list } = usePaging(
  (params) => {
    return Api.getProductModelList({
      ...params,
      pageSize: 999,
    });
  },
  {
    forEach: (item) => {},
  }
);

function selectModel(item) {
  currentOperatingBaseModelInfo.value = item;
  showProductPopup.value = false;
}
</script>

<style></style>
