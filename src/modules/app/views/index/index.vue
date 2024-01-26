<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-17 20:12:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-20 21:10:05
 * @FilePath: /1s/src/modules/app/views/index/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-menu content-id="main-content" type="push">
      <ion-content
        class="ion-padding"
        style="--padding-top: calc(var(--ion-safe-area-top) + 20px)"
      >
        <index-side-menu></index-side-menu>
      </ion-content>
    </ion-menu>
    <ion-page id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-toggle>
               <span style="padding:0 10px;font-weight:bold;font-style: italic;">衣设 1s</span>
            </ion-menu-toggle>
          </ion-buttons>
          <ion-buttons slot="end">
            <index-header-dropdown></index-header-dropdown>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <swiper></swiper>
      </ion-content>
    </ion-page>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonMenu,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonMenuButton,
  IonButtons,
  IonAlert,
  IonActionSheet,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  alertController,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import indexSideMenu from "./indexSideMenu.vue";
import indexHeaderDropdown from "./indexHeaderDropdown.vue";
import { useLoginStatusStore } from "@/store/stores/login";
import swiper from "./swiper/index.vue";

const loginStatusStore = useLoginStatusStore();

</script>
