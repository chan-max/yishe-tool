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
            <ion-menu-button style="color: var(--ion-text-color)"></ion-menu-button>
          </ion-buttons>
          <ion-title>1s</ion-title>
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
import swiper from './swiper/index.vue';


const loginStatusStore = useLoginStatusStore();



// 未登录提示
onMounted(async () => {
  if (!loginStatusStore.isLogin) {
    const alert = await alertController.create({
      header: "提示",
      message: "暂未登录，是否去登录",
      buttons: [
        {
          text: "取消",
          role: "cancel",
        },
        {
          text: "去登录",
          role: "confirm",
        },
      ],
    });
    await alert.present();
  }
});
</script>
