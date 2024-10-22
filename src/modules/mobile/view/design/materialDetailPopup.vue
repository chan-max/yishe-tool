<template>
  <van-popup
    round
    closeable
    v-model:show="showMaterialDetailPopup"
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
        :src="currentMaterialDetail?.thumbnail?.url"
      ></s1-img>

      <van-card
        num="999"
        price="0.00"
        tag=""
        :desc="currentMaterialDetail?.description || '暂无相关描述'"
        :title="currentMaterialDetail?.name || '暂无名称'"
        :thumb="currentMaterialDetail?.thumbnail?.url"
      >
        <template #tags>
          <template v-if="currentMaterialDetail?.keywords">
            <van-tag
              v-for="item in currentMaterialDetail?.keywords?.split(',')"
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
        <!-- <van-action-bar-icon text="" /> -->
        <van-action-bar-button @click="use" color="#6900ff" text="使用该材质" />
      </van-action-bar>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  showMaterialDetailPopup,
  currentMaterialDetail,
  showMaterialPopup,
} from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentModelController } from "@/components/design/store";

const search = ref();

function beforeClose() {
  currentMaterialDetail.value = null;
  showMaterialDetailPopup.value = false;
}

function use() {
  currentModelController.value.state.materialTextureInfo = currentMaterialDetail.value;
  showMaterialPopup.value = false;
  showMaterialDetailPopup.value = false;
}
</script>

<style></style>
