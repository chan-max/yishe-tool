<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-04 19:02:44
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-06 12:08:45
 * @FilePath: /1s/src/modules/app/views/index/indexHeaderDropdown.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-button>
    <ion-icon
      style="color: var(--ion-text-color);"
      slot="icon-only"
      :ios="ellipsisHorizontal"
      :md="ellipsisVertical"
    ></ion-icon>
  </ion-button>
</template>
<script setup>
import { IonButton,IonPopover,IonContent,IonItem,IonIcon } from "@ionic/vue";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
</script>
<style scoped>
  ion-button{
    --background:transparent;
  }

</style>
