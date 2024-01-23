<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:32:43
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-07 11:00:46
 * @FilePath: /1s/src/modules/app/views/workspace/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <button @click="logout"> 退出登录 </button>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
import { ref } from "vue";
import { doLogout } from "@/store/stores/loginAction";

function logout() {
  doLogout()
}

</script>

<style></style>
