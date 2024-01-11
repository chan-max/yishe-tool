<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-11 20:37:37
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-11 22:50:02
 * @FilePath: /1s/src/modules/app/views/market/model/modalContent.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button @click="close" style="--background:transparent;">
          <ion-icon
            style="color: var(--ion-text-color)"
            slot="icon-only"
            :icon="closeOutline"
          ></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <div class="content">
      <div class="viewer">
        <gltf-viewer :model="model"></gltf-viewer>
      </div>

      <ion-text> 221213 </ion-text>
      <div style="flex: 1"></div>
      <div class="bottom">
        <ion-button fill="outline" shape="round">购买</ion-button>
        <ion-button fill="outline" shape="round">评论</ion-button>
        <ion-button shape="round">点赞</ion-button>
      </div>
    </div>
  </ion-content>
</template>
<script setup>
import { isOpen, modalInfo } from "./index";
import { onBeforeMount, computed, ref } from "vue";
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonModal,
  IonHeader,
  IonButton,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonText,
} from "@ionic/vue";

import { closeOutline } from "ionicons/icons";

const model = ref();

function close() {
  isOpen.value = false;
}

onBeforeMount(() => {
  modalInfo.value;
  model.value = JSON.parse(modalInfo.value.modelInfo);
});
</script>
<style lang="less" scoped>
.viewer {
  width: 100%;
  height: 360px;
}


.content{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bottom{
  display: flex;
}
</style>
