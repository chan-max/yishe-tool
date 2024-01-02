<template>
  <ion-page>
    <ion-menu content-id="main-content">
      <ion-content class="ion-padding">
        <index-side-menu></index-side-menu>
      </ion-content>
    </ion-menu>
    <ion-page id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>1s</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-button router-direction="root" router-link="/scan"> 扫一扫 </ion-button>
        <ion-button router-direction="root" router-link="/login"> 登录 </ion-button>
        <ion-button @click="$router.push({ name: 'Signup' })"> 注册 </ion-button>
        <ion-button id="open-action-sheet">Open</ion-button>
        <ion-action-sheet
          trigger="open-action-sheet"
          header="Actions"
          :buttons="actionSheetButtons"
        ></ion-action-sheet>
        <ion-button id="present-alert">Click Me</ion-button>
        <ion-alert
          trigger="present-alert"
          header="A Short Title Is Best"
          sub-header="A Sub Header Is Optional"
          message="A message should be a short, complete sentence."
          :buttons="alertButtons"
        ></ion-alert>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Card Title</ion-card-title>
            <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            Here's a small text description for the card content. Nothing more, nothing
            less.
          </ion-card-content>
        </ion-card>
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
} from "@ionic/vue";
import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import {ref} from 'vue'
import indexSideMenu from './indexSideMenu.vue'

const isDark = ref(false)

function toggleDark(){

}

const actionSheetButtons = [
  {
    text: "Delete",
    role: "destructive",
    data: {
      action: "delete",
    },
  },
  {
    text: "Share",
    data: {
      action: "share",
    },
  },
  {
    text: "Cancel",
    role: "cancel",
    data: {
      action: "cancel",
    },
  },
];

const alertButtons = ["Action"];
</script>
