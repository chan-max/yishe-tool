<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:32:43
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 12:10:13
 * @FilePath: /1s/src/modules/app/views/workspace/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <ion-button @click="notification(NotificationType.Success)">
            success
        </ion-button>
        <ion-button @click="notification(NotificationType.Warning)">
            warning
        </ion-button >
        <ion-button @click="notification(NotificationType.Error)">
            error
        </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
import { ref } from "vue";
import { doLogout } from "@/store/stores/loginAction";
import { takePhoto } from "../../helper/camera.ts";
import {impact,notification} from '../../helper/device.ts'

import {  Haptics,ImpactStyle,NotificationType } from '@capacitor/haptics';

</script>

<style></style>
