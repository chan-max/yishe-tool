<template>
  <ion-modal
    :is-open="showWorkspace"
    :initial-breakpoint=".5"
    :breakpoints="[0, 0.5]"
    @didDismiss="didDismiss"
    :keepContentsMounted="true"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small" @click="showWorkspace = false">
            <ion-icon slot="icon-only" :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>  </ion-title>
        <ion-buttons slot="end">
          <ion-button size="small">
            <ion-icon slot="icon-only" :icon="helpCircleOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid class="grid">
        <ion-row>
          <template>
            <ion-col size="4">
            
            </ion-col>
          </template>
        </ion-row>
      </ion-grid>

    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { showWorkspace } from "@/modules/app/views/design/store";
import { close, checkmarkDoneOutline, helpCircleOutline } from "ionicons/icons";
import { getProductModelListApi } from "@/api";
import { onBeforeMount } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { getStickerListApi } from "@/api";


function didDismiss() {
    showWorkspace.value = false;
}


async function infiniteScroll(e) {
  e.target.complete();
}
</script>

<style lang="less" scoped>
:deep(ion-grid) {
  --ion-grid-column-padding: 2px;
}

</style>
