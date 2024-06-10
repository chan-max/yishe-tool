<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:32:43
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 16:38:46
 * @FilePath: /1s/src/modules/app/views/workspace/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar> </ion-toolbar>
    </ion-header>
    <ion-content></ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small" @click="quit">
            <ion-icon slot="icon-only" :icon="iconQuit"></ion-icon>
          </ion-button>
          <ion-button size="small" @click="showSelectModel = true">
            <ion-icon slot="icon-only" :icon="iconCloth"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>

    <select-model></select-model>
  </ion-page>

</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  loadingController,
} from "@ionic/vue";
import { ref, onBeforeMount } from "vue";
import { doLogout } from "@/store/stores/loginAction";
import { playAudio } from "@/common/browser.ts";
import { logoIonic, addCircleOutline, cloudUploadOutline } from "ionicons/icons";
import iconQuit from '@/modules/app/assets/icon/quit.svg?url'
import iconCloth from '@/modules/app/assets/icon/cloth.svg?url'
import selectModel from './layout/selectModel/index.vue'


import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { showSelectModel } from "./store";


function quit(){

}



onBeforeMount(async () => {
  const loading = await loadingController.create({
    message: "初始化中",
    duration: 300,
  });
  loading.present();
});
</script>

<style></style>
