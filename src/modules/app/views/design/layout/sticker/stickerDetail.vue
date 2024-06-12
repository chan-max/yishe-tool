<template>
  <ion-modal
    :is-open="showStickerDetail"
    :initial-breakpoint="1"
    :breakpoints="[1]"
    @didDismiss="didDismiss"
    :keepContentsMounted="true"
  >
    <div class="ion-padding content">
      <div style="flex: 1"></div>
      <ion-button expand="block">添加该贴纸</ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  currentPreviewSticker,
  showStickerDetail,
} from "@/modules/app/views/design/store";
import { close, checkmarkDoneOutline, helpCircleOutline } from "ionicons/icons";
import { getProductModelListApi } from "@/api";
import { onBeforeMount } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { getStickerListApi } from "@/api";

function didDismiss() {
  showStickerDetail.value = false;
  currentPreviewSticker.value = null;
}
</script>

<style lang="less" scoped>
ion-modal {
  --height: auto;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
