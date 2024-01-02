<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 21:36:27
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-02 22:59:41
 * @FilePath: /1s/src/modules/app/views/login/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>登录</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content :fullscreen="true" class="ion-padding">
    <el-input placeholder="账号" v-model="form.account" size="large"></el-input>
    <el-input placeholder="密码" v-model="form.password" size="large"></el-input>
    <el-button @click="submit"> 登录 </el-button>
  </ion-content>
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
} from "@ionic/vue";
import { login } from "@/api";

const form = reactive({ account: "", password: "" });

async function submit() {
  const res = await login(form);
  alert(JSON.stringify(res));
}
</script>

<style></style>
