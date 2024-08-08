<template>
  <ion-modal
    :is-open="showStickerDetail"
    :initial-breakpoint="1"
    :breakpoints="[1]"
    @didDismiss="didDismiss"
    :keepContentsMounted="true"
  >
    <div class="ion-padding content">
      <ion-card>
        <van-image :src="currentPreviewSticker?.thumbnail" style="height:240px;padding:1em;" fit="contain"/>
        <ion-card-header>
          <ion-card-title>{{ currentPreviewSticker?.name }}</ion-card-title>
          <ion-card-subtitle>{{ currentPreviewSticker?.type }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{ currentPreviewSticker?.description }}
        </ion-card-content>
      </ion-card>
      <ion-button expand="block" @click="add">添加该贴纸</ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  currentPreviewSticker,
  showStickerDetail,
  showSticker
} from "@/modules/app/views/design/store";
import { close, checkmarkDoneOutline, helpCircleOutline } from "ionicons/icons";
import { getProductModelListApi } from "@/api";
import { onBeforeMount } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { getStickerListApi } from "@/api";
import {currentModelController} from '@/components/design/store'


function didDismiss() {
  showStickerDetail.value = false;
  currentPreviewSticker.value = null;
}


/*
    添加贴纸
*/
function add(){
    currentModelController.value.addClickDelaySticker({
      ...currentPreviewSticker.value
    })
    showStickerDetail.value = false;
    showSticker.value = false
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
