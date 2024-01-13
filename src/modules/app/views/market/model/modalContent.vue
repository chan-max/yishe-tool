<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-11 20:37:37
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-13 20:34:42
 * @FilePath: /1s/src/modules/app/views/market/model/modalContent.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
   <ion-loading :is-open="loading" message="正在加载模型..."> </ion-loading>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button @click="close" style="--background: transparent">
          <ion-icon
            style="color: var(--ion-text-color)"
            slot="icon-only"
            :icon="closeOutline"
          ></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content style="--padding-bottom: var(--ion-safe-area-bottom)">
    <div class="content">
      <div class="viewer">
        <gltf-viewer :model="model" @before-load="beforeLoad" @loaded="loaded"></gltf-viewer>
      </div>
      <div class="thumbnails"> 缩略图 </div>
      <div class="ion-padding" style="display:flex;flex-direction: column;height:100%;">
        <ion-text style="font-size:40px;font-weight: bold;"> 221213 </ion-text>
      <div style="flex: 1"></div>
      <div class="bottom">
        <ion-button fill="outline" shape="round">收藏</ion-button>
        <ion-button fill="outline" shape="round">评论</ion-button>
        <div style="flex: 1"></div>
        <ion-button shape="round" id="buy">
          <ion-icon slot="start" :icon="star"></ion-icon>
          购 买
        </ion-button>
      </div>
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
  IonTitle,
  IonHeader,
  IonButton,
  IonButtons,
  IonToolbar,
  IonContent,
  IonIcon,
  IonText,
} from "@ionic/vue";

import { closeOutline, star } from "ionicons/icons";

const model = ref();

const loading = ref(true)

function loaded(){
  loading.value = false
}

function beforeLoad(){
  loading.value = true
}

function close() {
  isOpen.value = false;
}

onBeforeMount(() => {
  model.value = JSON.parse(modalInfo.value.modelInfo);
  console.log(modalInfo)
});

</script>
<style lang="less" scoped>
.viewer {
  width: 100%;
  height: 300px;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bottom {
  display: flex;
}

#buy {
  --background: #6900ff;
  --background-activated: rgb(125, 0, 255);
}
</style>
