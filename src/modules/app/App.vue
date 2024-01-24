<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-02 19:17:55
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-06 23:30:05
 * @FilePath: /1s/src/modules/app/App.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <van-config-provider  :theme="isDark ? 'dark':'light'">
    <ion-app>
      <keep-alive>
        <ion-router-outlet></ion-router-outlet>
      </keep-alive>
    </ion-app>
  </van-config-provider>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonPage } from "@ionic/vue";
import {isDark} from '@/store/stores/app.ts'
</script>
