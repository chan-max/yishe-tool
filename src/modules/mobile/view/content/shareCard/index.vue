<template>
  <van-popup
    v-model:show="showShareCardPopup"
    closeable
    position="bottom"
    :style="{ width: '100%', height: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <template v-if="showShareCardPopup">
      <div
        class="flex flex-col h-full items-center justify-center"
        style="padding: 64px 0 36px 0; row-gap: 24px; box-sizing: border-box"
      >
        <shareCard :info="currentShareCardInfo" ref="cardRef" :width="360"></shareCard>

        <div>
          <van-button type="primary" round @click="save" icon="down">下载卡片</van-button>
          <van-button
            icon="link-o"
            style="margin-left: 12px"
            type="primary"
            round
            @click="copy"
            >复制链接</van-button
          >
          <van-button
            icon="share-o"
            style="margin-left: 12px"
            type="primary"
            round
            @click="share"
            >分享模型</van-button
          >
        </div>

        <div>如果卡片出现模型图或二维码丢失，请尝试更换设备或截图保存</div>
      </div>
    </template>
  </van-popup>
</template>

<script setup lang="ts">
import { functionsIn } from "lodash";
import { showShareCardPopup, currentShareCardInfo } from "./index.ts";
import { ref, computed } from "vue";
import { showToast } from "vant";
import { useConfigStore } from "@/store/stores/config";
import shareCard from "@/components/design/layout/shareCard/shareCard.vue";

const cardRef = ref();

function save() {
  cardRef.value.download();
}

async function share() {
  cardRef.value.share();
}

function copy() {
  cardRef.value.copylink();
  showToast("链接复制成功");
}
</script>

<style></style>
