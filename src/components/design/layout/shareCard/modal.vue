<template>
  <a-modal
    v-model:open="showShareCardModal"
    width="540px"
    title="分享卡片"
    style="min-width: 540px"
    :footer="null"
    centered
    :destroyOnClose="true"
  >
    <div
      style="height: 640px; overflow: auto; row-gap: 24px"
      class="flex flex-col justify-center items-center"
    >
      <shareCard ref="shareCardRef"></shareCard>

      <div>
        <el-button @click="copy" round> 复制链接 </el-button>
        <el-button @click="download" round> 下载卡片 </el-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {
  openShareCardModal,
  showShareCardModal,
  createCustomModelShareLink,
} from "./index.js";
import { ref, unref } from "vue";
import shareCard from "./shareCard.vue";
import { message } from "ant-design-vue";

const shareCardRef = ref();

function copy() {
  navigator.clipboard.writeText(createCustomModelShareLink());
  message.success("链接复制成功");
}

function download() {
  shareCardRef.value.download();
}
</script>

<style scoped lang="less"></style>
