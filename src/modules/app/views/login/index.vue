<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 21:36:27
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-03 20:43:40
 * @FilePath: /1s/src/modules/app/views/login/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text="首页"> </ion-back-button>
        </ion-buttons>
        <ion-title>登录</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <h1>登录到衣设</h1>
      <ion-input
        label="账号"
        label-placement="floating"
        placeholder="账号或邮箱手机号"
      ></ion-input>
      <ion-input
        label="密码"
        label-placement="floating"
        placeholder="密码在6到18位"
      ></ion-input>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonInput
} from "@ionic/vue";
import { chevronBackOutline } from "ionicons/icons";
import { login } from "@/api";

const form = reactive({ account: "", password: "" });

async function submit() {
  const res = await login(form);
  alert(JSON.stringify(res));
}
</script>

<style></style>
