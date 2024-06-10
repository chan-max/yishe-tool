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
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small" id="open-action-sheet">
            <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
          </ion-button>
          <ion-action-sheet
            trigger="open-action-sheet"
            header="上传"
            :buttons="actionSheetButtons"
          ></ion-action-sheet>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button size="small">
            <ion-icon slot="icon-only" :icon="cloudUploadOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <ion-button @click="quickStart"> 快速开始 </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,useIonRouter } from "@ionic/vue";
import { ref } from "vue";
import { doLogout } from "@/store/stores/loginAction";
import { takePhoto } from "../../helper/camera.ts";
import { impact, notification } from "../../helper/device.ts";
import { playAudio } from "@/common/browser.ts";
import { logoIonic ,addCircleOutline ,cloudUploadOutline} from 'ionicons/icons';
import add from "@/icon/mobile/add.svg?url";
import bell from "@/icon/mobile/bell.svg?url";
const router = useIonRouter();
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

const actionSheetButtons = [
  {
    text: "创建群聊",
  },
  {
    text: "加入群聊",
  },
  {
    text: "添加聊天",
  },
  {
    text: "返回",
    role: "cancel",
    data: {
      action: "cancel",
    },
  },
];

function quickStart(params) {
  router.push({
    name:'Design'
  })
}
</script>

<style></style>
