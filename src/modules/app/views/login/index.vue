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
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list-header>
        <ion-label>登录到衣设</ion-label>
      </ion-list-header>
      <ion-list>
        <ion-item>
          <ion-input
            v-model="form.account"
            label="账号"
            label-placement="stacked"
            placeholder="账号或邮箱手机号"
          >
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            v-model="form.password"
            type="password"
            label="密码"
            label-placement="stacked"
            placeholder="密码在6到18位"
          >
          </ion-input>
        </ion-item>
      </ion-list>
      <ion-button @click="submit" expand="block" shape="round">登 录</ion-button>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { ref, reactive } from "vue";

import { ResponseStatusCodeEnum } from "@common/statusCode.js";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  loadingController,
  toastController,
} from "@ionic/vue";
import { eye, lockClosed, person, checkmarkCircle, closeCircle } from "ionicons/icons";
import { login } from "@/api";
import { doLoginAction } from "../../../../store/stores/loginAction";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({ account: "", password: "" });

async function submit() {
  const toast = await toastController.create({
    duration: 1000,
    position: "bottom",
  });

  const loading = await loadingController.create({
    message: "正在登录...",
    duration: 0,
  });
  loading.present();
  try {
    const res = await login(form);
    await loading.dismiss();
    switch (res.status) {
      case ResponseStatusCodeEnum.LOGIN_SUCCESS:
        toast.message = "登录成功";
        toast.icon = checkmarkCircle;
        toast.style = "color:var(--ion-color-success)";
        doLoginAction(res.data);
        await toast.present();
        setTimeout(() => {
          router.push({ path: "/" });
        }, 1000);
        break;
      case ResponseStatusCodeEnum.PASSWORD_ERROR:
        toast.message = "密码错误";
        await toast.present();
        break;
      case ResponseStatusCodeEnum.ACCOUNT_NOT_EXIST:
        toast.icon = closeCircle;
        toast.style = "color:var(--ion-color-danger)";
        toast.message = "账号不存在";
        await toast.present();
        break;
    }
  } catch (e) {
    loading.dismiss();
  }
}

</script>

<style lang="less"></style>
