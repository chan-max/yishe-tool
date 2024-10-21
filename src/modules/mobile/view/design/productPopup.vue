<template>
  <van-popup
    round
    v-model:show="showProductPopup"
    closeable
    position="bottom"
    :style="{ height: '80%', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div style="padding: 48px 12px">
      <van-card
        v-for="item in list"
        num="*"
        tag="有货"
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
          <van-button size="mini" @click="selectModel(item)"> 选择该模型 </van-button>
        </template>
      </van-card>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showProductPopup } from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";

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
