<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-02 19:17:55
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-04 21:51:15
 * @FilePath: /1s/src/modules/app/App.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <van-config-provider :theme="isDark ? 'dark':'light'">
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  </van-config-provider>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonPage } from "@ionic/vue";
import {isDark} from './helper/dark'
</script>
