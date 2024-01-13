<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-02 19:17:55
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-13 10:15:51
 * @FilePath: /1s/src/modules/app/views/index/indexSideMenu.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <ion-avatar>
      <img alt="头像" :src="avatar" />
    </ion-avatar>
    <div style="flex: 1"></div>
    <ion-toggle label-placement="end" @ionChange="toggle" :checked="isDark">
      启用夜间模式
    </ion-toggle>
  </div>
</template>
<script setup>

import { onMounted, computed } from "vue";
import { IonToggle, IonItem, IonLabel, IonAvatar } from "@ionic/vue";
import { useLoginStatusStore } from "@/store/stores/login.ts";
import {toggle,isDark} from '../../helper/dark.ts'


const loginStatusStore = useLoginStatusStore();

const avatar = computed(() => {
  return loginStatusStore.userInfo?.preview_avatar || "/defaultAvatar/avatar3.png";
});


</script>
<style lang=""></style>
