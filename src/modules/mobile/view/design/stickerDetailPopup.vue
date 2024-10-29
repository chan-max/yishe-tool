<template>
  <van-popup
    round
    closeable
    v-model:show="showStickerDetailPopup"
    position="bottom"
    :style="{ height: '80%', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
    :before-close="beforeClose"
  >
    <div class="flex flex-col" style="height: 100%; row-gap: 16px">
      <div style="padding: 16px; box-sizing: border-box">
        <s1-img
          class="png-background"
          style="width: 100%; height: 360px"
          :src="currentSticker?.thumbnail?.url"
        ></s1-img>
      </div>

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
              type="primary"
              style="margin: 3px; font-size: 10px; padding: 2px 6px"
              color="#ddd"
              round
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
        <van-action-bar-button @click="use" color="#6900ff" text="使用该贴纸" />
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
import { showToast } from "vant";
const search = ref();

function beforeClose() {
  currentSticker.value = null;
  showStickerDetailPopup.value = false;
}

function use() {
  if (!currentOperatingBaseModelInfo.value?.id) {
    return showToast("请先从服装模型中选择一个模型");
  }

  currentModelController.value.addClickDelaySticker({
    ...currentSticker.value,
  });
  showStickerDetailPopup.value = false;
  showStickerPopup.value = false;
}
</script>

<style></style>
