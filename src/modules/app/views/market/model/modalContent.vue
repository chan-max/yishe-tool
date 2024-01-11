<template>
  <ion-header>
    <ion-toolbar>
      <ion-title> 模型 </ion-title>
      <ion-buttons slot="end">
        <ion-button @click="close">关闭</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <div class="viewer">
      <gltf-viewer :model="model"></gltf-viewer>
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
} from "@ionic/vue";

const model = ref();

function close() {
  isOpen.value = false;
}

onBeforeMount(() => {
  modalInfo.value;
  model.value = JSON.parse(modalInfo.value.modelInfo)
});

</script>
<style lang="less" scoped>

.viewer{
    width: 100%;
    height: 300px;
}

ion-button{
    --background:transparent;
}
</style>
