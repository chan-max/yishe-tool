<template>
  <van-popup
    round
    v-model:show="showStickerDetailPopup"
    position="bottom"
    :style="{ height: '80%', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
    :before-close="beforeClose"
  >
    <div
      class="flex flex-col"
      style="height: 100%; padding: 12px; box-sizing: border-box; row-gap: 16px"
    >
      <s1-img
        class="png-background"
        style="width: 100%; height: 360px"
        :src="currentSticker?.thumbnail?.url"
      ></s1-img>

      <van-card
        num="999"
        price="0.00"
        tag=""
        :desc="currentSticker?.description || '暂无相关描述'"
        :title="currentSticker?.name || '暂无名称'"
        :thumb="currentSticker?.thumbnail?.url"
      >
        <template #tags>
          <template v-if="currentSticker?.keywords">
            <van-tag
              v-for="item in currentSticker?.keywords?.split(',')"
              plain
              type="primary"
              >{{ item }}</van-tag
            >
          </template>
          <template v-else> 无标签 </template>
        </template>
        <template #footer> </template>
      </van-card>
      <van-action-bar>
        <van-action-bar-icon text="模仿" />
        <van-action-bar-icon text="收藏" />
        <van-action-bar-icon text="分享" />
        <van-action-bar-button
          @click="use"
          color="#6900ff"
          icon="aim"
          text="使用该贴纸"
        />
      </van-action-bar>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showStickerDetailPopup, currentSticker, showStickerPopup } from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentModelController } from "@/components/design/store";

const search = ref();

function beforeClose() {
  currentSticker.value = null;
  showStickerDetailPopup.value = false;
}

function use() {
  currentModelController.value.addClickDelaySticker({
    ...currentSticker.value,
  });
  showStickerDetailPopup.value = false;
  showStickerPopup.value = false;
}
</script>

<style></style>
