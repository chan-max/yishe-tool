<template>
  <ion-modal
    :is-open="showSticker"
    :initial-breakpoint="1"
    :breakpoints="[0, 0.5, 1]"
    @didDismiss="didDismiss"
    :keepContentsMounted="true"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small" @click="showSticker = false">
            <ion-icon slot="icon-only" :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
        <!-- <ion-title> 贴纸 </ion-title> -->
        <ion-buttons slot="end">
          <ion-button size="small">
            <ion-icon slot="icon-only" :icon="helpCircleOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="搜索"></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <chips></chips>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid class="grid">
        <ion-row>
          <template v-for="item in list">
            <ion-col size="4">
              <div class="sticker-item" @click="preview(item)">
                <van-image :src="item.thumbnail" fit="contain"></van-image>
              </div>
            </ion-col>
          </template>
        </ion-row>
      </ion-grid>
      <ion-infinite-scroll @ionInfinite="infiniteScroll">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-modal>
  <sticker-detail></sticker-detail>
</template>

<script setup lang="ts">

import { close, checkmarkDoneOutline, helpCircleOutline } from "ionicons/icons";
import { getProductModelListApi } from "@/api";
import { onBeforeMount } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { showSticker,currentPreviewSticker,showStickerDetail } from "@/modules/app/views/design/store";
import { getStickerListApi } from "@/api";
import stickerDetail from './stickerDetail.vue'
import chips from './chips.vue'

function didDismiss() {
  showSticker.value = false;
}

const { list,getList } = usePaging(
  (params) => {
    return getStickerListApi({
      ...params,
      pageSize: 18,
    });
  },
  {
    forEach: (item) => {
      item.thumbnail = "https://" + item.thumbnail;
      return;
    },
  }
);


/*
  预览该贴纸
*/ 
function preview(item){
    currentPreviewSticker.value = item
    showStickerDetail.value = true
}

async function infiniteScroll(e){
    await getList()
    e.target.complete()
}

</script>

<style lang="less" scoped>
:deep(ion-grid) {
  --ion-grid-column-padding: 2px;
}
.sticker-item {
  width: 100%;
  background-color: #eee;
  padding: 0.5em;
  border-radius: 0.2em;
  overflow: hidden;
  height: 108px;
  position: relative;
}

.dark .sticker-item {
  background-color: #222;
}

:deep(.van-image) {
  width: 100%;
  height: 100%;
}
</style>
