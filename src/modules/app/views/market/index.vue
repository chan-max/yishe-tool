<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:33:06
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-01 21:28:34
 * @FilePath: /1s/src/modules/app/views/market/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>逛一逛</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card  v-for="i in 100">
        <ion-card-header>
          <ion-card-title>Card Title</ion-card-title>
          <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content> Card Content </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
import { getModelList } from "@/api";
import { onBeforeMount } from "vue";

onBeforeMount(async () => {
  let list = await getModelList();
});
</script>

<style>
/* ion-toolbar {
  --opacity: 0.5;
} */
</style>
